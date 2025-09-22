'use client';

import { useState, useCallback } from 'react';
import { BetSlipItem } from '@/components/betting/BetSlip';

export function useBetSlip() {
  const [items, setItems] = useState<BetSlipItem[]>([]);

  const addItem = useCallback((
    selection: string,
    odds: number,
    market: string,
    matchId: string,
    event: string
  ) => {
    const itemId = `${matchId}-${selection}`;

    setItems(prev => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(item => item.id === itemId);

      if (existingItemIndex !== -1) {
        // Update existing item with new odds
        return prev.map((item, index) =>
          index === existingItemIndex
            ? { ...item, odds }
            : item
        );
      }

      // Add new item
      const newItem: BetSlipItem = {
        id: itemId,
        selection,
        odds,
        market,
        event,
        stake: 0
      };

      return [...prev, newItem];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateStake = useCallback((id: string, stake: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, stake } : item
    ));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const isItemSelected = useCallback((matchId: string, selection: string) => {
    return items.some(item => item.id === `${matchId}-${selection}`);
  }, [items]);

  const getSelectedOddsIds = useCallback(() => {
    return items.map(item => item.id);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateStake,
    clearAll,
    isItemSelected,
    getSelectedOddsIds,
    count: items.length
  };
}