'use client';

import { useState, useEffect, useCallback } from 'react';

export interface OddsUpdate {
  matchId: string;
  market: string;
  selection: string;
  oldOdds: number;
  newOdds: number;
  movement: 'up' | 'down' | 'same';
}

export interface SimulationConfig {
  updateInterval: number; // in milliseconds
  maxChange: number; // maximum percentage change per update
  volatility: number; // 0-1, how often odds change
}

const defaultConfig: SimulationConfig = {
  updateInterval: 30000, // 30 seconds
  maxChange: 0.05, // 5%
  volatility: 0.3 // 30% chance of change per update
};

export function useOddsSimulation(
  initialOdds: Record<string, number>,
  config: Partial<SimulationConfig> = {}
) {
  const { updateInterval, maxChange, volatility } = { ...defaultConfig, ...config };

  const [odds, setOdds] = useState(initialOdds);
  const [updates, setUpdates] = useState<OddsUpdate[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  const generateOddsChange = useCallback((currentOdds: number): number => {
    // More realistic odds movement based on current value
    const baseChange = (Math.random() - 0.5) * 2 * maxChange;

    // Bias towards specific ranges (bookmaker behavior)
    let adjustedChange = baseChange;

    // Odds below 1.5 tend to be more stable
    if (currentOdds < 1.5) {
      adjustedChange *= 0.3;
    }
    // Odds above 5.0 can be more volatile
    else if (currentOdds > 5.0) {
      adjustedChange *= 1.5;
    }

    const newOdds = currentOdds * (1 + adjustedChange);

    // Ensure odds stay within reasonable bounds
    const minOdds = 1.01;
    const maxOdds = 50.0;

    return Math.max(minOdds, Math.min(maxOdds, newOdds));
  }, [maxChange]);

  const updateOdds = useCallback(() => {
    if (!isRunning) return;

    setOdds(currentOdds => {
      const newOdds = { ...currentOdds };
      const newUpdates: OddsUpdate[] = [];

      Object.keys(currentOdds).forEach(key => {
        // Only update if random chance hits
        if (Math.random() < volatility) {
          const oldValue = currentOdds[key];
          const newValue = generateOddsChange(oldValue);

          // Only update if there's a meaningful change
          const change = Math.abs(newValue - oldValue) / oldValue;
          if (change > 0.01) { // 1% minimum change
            newOdds[key] = parseFloat(newValue.toFixed(2));

            // Determine movement direction
            let movement: 'up' | 'down' | 'same' = 'same';
            if (newValue > oldValue * 1.01) movement = 'up';
            else if (newValue < oldValue * 0.99) movement = 'down';

            // Parse key to extract match info (format: matchId-market-selection)
            const [matchId, market, ...selectionParts] = key.split('-');
            const selection = selectionParts.join('-');

            newUpdates.push({
              matchId,
              market: market || 'unknown',
              selection: selection || 'unknown',
              oldOdds: oldValue,
              newOdds: newValue,
              movement
            });
          }
        }
      });

      if (newUpdates.length > 0) {
        setUpdates(prev => [...newUpdates, ...prev.slice(0, 49)]); // Keep last 50 updates
        setLastUpdateTime(Date.now());
      }

      return newOdds;
    });
  }, [isRunning, volatility, generateOddsChange]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  const getOddsForKey = useCallback((key: string): number => {
    return odds[key] || 0;
  }, [odds]);

  const getMovementForKey = useCallback((key: string): 'up' | 'down' | 'same' => {
    const recentUpdate = updates.find(update =>
      `${update.matchId}-${update.market}-${update.selection}` === key
    );
    return recentUpdate?.movement || 'same';
  }, [updates]);

  // Set up the interval for odds updates
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(updateOdds, updateInterval);
    return () => clearInterval(interval);
  }, [isRunning, updateOdds, updateInterval]);

  // Auto-start simulation in live environments
  useEffect(() => {
    const autoStart = setTimeout(() => {
      startSimulation();
    }, 2000); // Start after 2 seconds

    return () => clearTimeout(autoStart);
  }, [startSimulation]);

  return {
    odds,
    updates,
    isRunning,
    lastUpdateTime,
    startSimulation,
    stopSimulation,
    clearUpdates,
    getOddsForKey,
    getMovementForKey,
    // Utility functions
    getTotalUpdates: () => updates.length,
    getRecentUpdates: (limit: number = 10) => updates.slice(0, limit),
    getUpdatesForMatch: (matchId: string) =>
      updates.filter(update => update.matchId === matchId)
  };
}

// Hook for live score simulation
export function useLiveScoreSimulation(initialScore: { home: number; away: number }) {
  const [score, setScore] = useState(initialScore);
  const [events, setEvents] = useState<Array<{
    time: string;
    type: 'goal' | 'card' | 'substitution';
    team: 'home' | 'away';
    player: string;
  }>>([]);

  const simulateEvent = useCallback(() => {
    // Random chance of event occurring
    if (Math.random() < 0.1) { // 10% chance per update
      const eventType = Math.random() < 0.7 ? 'goal' : 'card';
      const team = Math.random() < 0.5 ? 'home' : 'away';
      const time = `${Math.floor(Math.random() * 90) + 1}'`;

      const players = [
        'Johnson', 'Smith', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
      ];
      const player = players[Math.floor(Math.random() * players.length)];

      if (eventType === 'goal') {
        setScore(prev => ({
          ...prev,
          [team]: prev[team] + 1
        }));
      }

      setEvents(prev => [
        { time, type: eventType, team, player },
        ...prev.slice(0, 9) // Keep last 10 events
      ]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateEvent, 45000); // Check every 45 seconds
    return () => clearInterval(interval);
  }, [simulateEvent]);

  return { score, events };
}