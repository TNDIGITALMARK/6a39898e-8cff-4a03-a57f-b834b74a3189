'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BetSlipItem {
  id: string;
  selection: string;
  odds: number;
  market: string;
  event: string;
  stake?: number;
}

interface BetSlipProps {
  items: BetSlipItem[];
  onRemoveItem: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  onPlaceBet: () => void;
  onClear: () => void;
  className?: string;
}

export function BetSlip({
  items,
  onRemoveItem,
  onUpdateStake,
  onPlaceBet,
  onClear,
  className
}: BetSlipProps) {
  const [betType, setBetType] = useState<'single' | 'accumulator'>('single');
  const [totalStake, setTotalStake] = useState<number>(0);

  const totalOdds = items.reduce((acc, item) => acc * item.odds, 1);
  const totalPayout = totalStake * (betType === 'accumulator' ? totalOdds : items.reduce((acc, item) => acc + (item.stake || 0) * item.odds, 0));
  const totalIndividualStake = items.reduce((acc, item) => acc + (item.stake || 0), 0);

  const handleStakeUpdate = (id: string, value: string) => {
    const stake = parseFloat(value) || 0;
    onUpdateStake(id, stake);
  };

  const handleTotalStakeUpdate = (value: string) => {
    const stake = parseFloat(value) || 0;
    setTotalStake(stake);

    if (betType === 'accumulator' && items.length > 0) {
      const stakePerBet = stake / items.length;
      items.forEach(item => onUpdateStake(item.id, stakePerBet));
    }
  };

  if (items.length === 0) {
    return (
      <Card className={cn('bet-slip', className)}>
        <CardHeader>
          <CardTitle className="font-heading">Bet Slip</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Your bet slip is empty</p>
          <p className="text-sm mt-2">Select odds to add bets</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('bet-slip', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading">Bet Slip ({items.length})</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        </div>

        {items.length > 1 && (
          <div className="flex gap-2 mt-4">
            <Button
              variant={betType === 'single' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBetType('single')}
              className="flex-1"
            >
              Singles
            </Button>
            <Button
              variant={betType === 'accumulator' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBetType('accumulator')}
              className="flex-1"
            >
              Accumulator
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bet-slip-item p-3 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="font-medium text-sm">{item.selection}</div>
                <div className="text-xs text-muted-foreground">{item.event}</div>
                <div className="text-xs text-muted-foreground">{item.market}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{item.odds.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {betType === 'single' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`stake-${item.id}`} className="text-xs">Stake:</Label>
                  <Input
                    id={`stake-${item.id}`}
                    type="number"
                    placeholder="0.00"
                    value={item.stake || ''}
                    onChange={(e) => handleStakeUpdate(item.id, e.target.value)}
                    className="flex-1 h-8 text-sm"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-xs text-muted-foreground">£</span>
                </div>
                {item.stake && (
                  <div className="text-xs text-muted-foreground">
                    Potential win: £{((item.stake * item.odds) - item.stake).toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {betType === 'accumulator' && items.length > 1 && (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="total-stake" className="text-sm font-medium">
                Accumulator Stake:
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="total-stake"
                  type="number"
                  placeholder="0.00"
                  value={totalStake || ''}
                  onChange={(e) => handleTotalStakeUpdate(e.target.value)}
                  className="flex-1"
                  min="0"
                  step="0.01"
                />
                <span className="text-sm text-muted-foreground">£</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total odds:</span>
                  <span className="font-bold text-warning">{totalOdds.toFixed(2)}</span>
                </div>
                {totalStake > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potential win:</span>
                    <span className="font-bold text-primary">
                      £{(totalPayout - totalStake).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          {betType === 'single' && (
            <div className="flex justify-between text-sm">
              <span>Total Stake:</span>
              <span className="font-bold">£{totalIndividualStake.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Total Potential Return:</span>
            <span className="font-bold text-primary">
              £{(betType === 'accumulator' ? totalPayout : totalIndividualStake + (totalPayout - totalIndividualStake)).toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          onClick={onPlaceBet}
          className="w-full"
          size="lg"
          disabled={(betType === 'single' && totalIndividualStake === 0) || (betType === 'accumulator' && totalStake === 0)}
        >
          Place Bet{betType === 'accumulator' ? 's' : ''}
        </Button>
      </CardContent>
    </Card>
  );
}