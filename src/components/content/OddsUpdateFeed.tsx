'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OddsUpdate } from '@/hooks/useOddsSimulation';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
  Pause,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OddsUpdateFeedProps {
  updates: OddsUpdate[];
  isRunning: boolean;
  onToggleSimulation: () => void;
  onClearUpdates: () => void;
  lastUpdateTime: number;
  className?: string;
}

export function OddsUpdateFeed({
  updates,
  isRunning,
  onToggleSimulation,
  onClearUpdates,
  lastUpdateTime,
  className
}: OddsUpdateFeedProps) {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMovementIcon = (movement: 'up' | 'down' | 'same') => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Activity className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getMovementColor = (movement: 'up' | 'down' | 'same') => {
    switch (movement) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const calculateChange = (oldOdds: number, newOdds: number) => {
    const change = ((newOdds - oldOdds) / oldOdds) * 100;
    return Math.abs(change);
  };

  const recentUpdates = updates.slice(0, 10);

  return (
    <Card className={cn('odds-update-feed', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Odds Movement
            {isRunning && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSimulation}
              className="text-xs"
            >
              {isRunning ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearUpdates}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {updates.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Total updates: {updates.length}</span>
            <span>Last update: {formatTime(lastUpdateTime)}</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {recentUpdates.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No odds movements yet</p>
            <p className="text-xs mt-1">
              {isRunning ? 'Waiting for updates...' : 'Simulation paused'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentUpdates.map((update, index) => (
              <div
                key={`${update.matchId}-${update.selection}-${index}`}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1">
                    {getMovementIcon(update.movement)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {update.selection}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {update.market}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground line-through">
                      {update.oldOdds.toFixed(2)}
                    </div>
                    <div className={cn('text-sm font-bold', getMovementColor(update.movement))}>
                      {update.newOdds.toFixed(2)}
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs px-1 min-w-[50px] text-center',
                      update.movement === 'up'
                        ? 'border-green-500/20 bg-green-500/5 text-green-500'
                        : update.movement === 'down'
                        ? 'border-red-500/20 bg-red-500/5 text-red-500'
                        : 'border-muted-foreground/20 bg-muted/5 text-muted-foreground'
                    )}
                  >
                    {update.movement === 'up' ? '+' : update.movement === 'down' ? '-' : ''}
                    {calculateChange(update.oldOdds, update.newOdds).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}

            {updates.length > 10 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  +{updates.length - 10} more updates
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}