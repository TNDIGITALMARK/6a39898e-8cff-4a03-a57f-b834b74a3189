'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OddsButton } from './OddsButton';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Market {
  id: string;
  name: string;
  description?: string;
  selections: Array<{
    id: string;
    name: string;
    odds: number;
    movement?: 'up' | 'down' | 'same';
    isAvailable?: boolean;
  }>;
  popular?: boolean;
  handicap?: string;
}

interface MarketSectionProps {
  market: Market;
  onOddsClick: (selectionId: string, selection: string, odds: number, market: string) => void;
  selectedOdds?: string[];
  expanded?: boolean;
  className?: string;
}

export function MarketSection({
  market,
  onOddsClick,
  selectedOdds = [],
  expanded = false,
  className
}: MarketSectionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const isSelectionSelected = (selectionId: string) => {
    return selectedOdds.includes(`${market.id}-${selectionId}`);
  };

  const getMovementIcon = (movement?: 'up' | 'down' | 'same') => {
    if (movement === 'up') return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (movement === 'down') return <TrendingDown className="w-3 h-3 text-red-400" />;
    return null;
  };

  const handleOddsClick = (selection: any) => {
    if (selection.isAvailable !== false) {
      onOddsClick(selection.id, selection.name, selection.odds, market.name);
    }
  };

  // Show first 3 selections by default, expand to show all
  const visibleSelections = isExpanded
    ? market.selections
    : market.selections.slice(0, 3);

  const hasMoreSelections = market.selections.length > 3;

  return (
    <Card className={cn('market-section', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              {market.name}
              {market.handicap && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({market.handicap})
                </span>
              )}
            </CardTitle>
            {market.popular && (
              <Badge variant="outline" className="text-xs text-warning border-warning/20 bg-warning/5">
                Popular
              </Badge>
            )}
          </div>

          {hasMoreSelections && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? (
                <>
                  Less <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  More <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>

        {market.description && (
          <p className="text-sm text-muted-foreground">
            {market.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className={cn(
          'grid gap-3',
          market.selections.length === 2 ? 'grid-cols-2' :
          market.selections.length === 3 ? 'grid-cols-3' :
          'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        )}>
          {visibleSelections.map((selection) => (
            <div key={selection.id} className="relative">
              <OddsButton
                odds={selection.odds}
                selection={selection.name}
                market={market.name}
                isSelected={isSelectionSelected(selection.id)}
                movement={selection.movement}
                onClick={() => handleOddsClick(selection)}
                className={cn(
                  'w-full h-16',
                  selection.isAvailable === false && 'opacity-50 cursor-not-allowed'
                )}
              />

              {/* Movement indicator */}
              {selection.movement && selection.movement !== 'same' && (
                <div className="absolute top-1 right-1">
                  {getMovementIcon(selection.movement)}
                </div>
              )}

              {/* Unavailable overlay */}
              {selection.isAvailable === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                  <span className="text-xs text-muted-foreground font-medium">
                    Suspended
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show remaining count when collapsed */}
        {!isExpanded && hasMoreSelections && (
          <div className="text-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              +{market.selections.length - 3} more options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}