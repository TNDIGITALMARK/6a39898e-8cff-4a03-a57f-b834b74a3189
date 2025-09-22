'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OddsButtonProps {
  odds: number;
  selection: string;
  market: string;
  isSelected?: boolean;
  isWinning?: boolean;
  isLosing?: boolean;
  movement?: 'up' | 'down' | 'same';
  onClick?: () => void;
  className?: string;
}

export function OddsButton({
  odds,
  selection,
  market,
  isSelected = false,
  isWinning = false,
  isLosing = false,
  movement = 'same',
  onClick,
  className
}: OddsButtonProps) {
  const getMovementColor = () => {
    if (movement === 'up') return 'text-green-400';
    if (movement === 'down') return 'text-red-400';
    return 'text-foreground';
  };

  const getBackgroundColor = () => {
    if (isSelected) return 'bg-primary text-primary-foreground border-primary';
    if (isWinning) return 'bg-green-500/20 border-green-500 text-green-300';
    if (isLosing) return 'bg-red-500/20 border-red-500 text-red-300';
    return 'bg-card border-border hover:bg-muted';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'odds-button',
        'flex flex-col items-center justify-center',
        'min-h-[80px] min-w-[90px] p-3',
        'border rounded-lg',
        'text-center cursor-pointer',
        'transition-all duration-200',
        'hover:scale-105 active:scale-95',
        getBackgroundColor(),
        className
      )}
    >
      <div className="text-xs font-medium mb-1 opacity-80 leading-tight">
        {selection}
      </div>
      <div className={cn('text-lg font-bold font-heading', getMovementColor())}>
        {odds.toFixed(2)}
        {movement !== 'same' && (
          <span className="ml-1 text-xs">
            {movement === 'up' ? '↗' : '↘'}
          </span>
        )}
      </div>
    </button>
  );
}