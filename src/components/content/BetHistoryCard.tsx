'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BetHistory } from '@/lib/mockData';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BetHistoryCardProps {
  bet: BetHistory;
  onViewDetails?: (betId: string) => void;
  className?: string;
}

export function BetHistoryCard({
  bet,
  onViewDetails,
  className
}: BetHistoryCardProps) {
  const getStatusIcon = (status: BetHistory['status']) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'void':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BetHistory['status']) => {
    switch (status) {
      case 'won':
        return 'text-green-500 border-green-500/20 bg-green-500/5';
      case 'lost':
        return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'void':
        return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5';
      case 'pending':
        return 'text-blue-500 border-blue-500/20 bg-blue-500/5';
      default:
        return '';
    }
  };

  const getPnL = () => {
    if (bet.status === 'pending' || bet.status === 'void') return null;
    const profit = (bet.actualReturn || 0) - bet.stake;
    return profit;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const profit = getPnL();

  return (
    <Card className={cn('bet-history-card hover:shadow-lg transition-all duration-200', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn('text-xs', getStatusColor(bet.status))}>
              {getStatusIcon(bet.status)}
              <span className="ml-1 capitalize">{bet.status}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {bet.betType === 'single' ? 'Single' : 'Accumulator'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(bet.placedAt)}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selections */}
        <div className="space-y-2">
          {bet.selections.map((selection, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{selection.selection}</div>
                <div className="text-xs text-muted-foreground">
                  {selection.event} • {selection.market}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{selection.odds.toFixed(2)}</span>
                {selection.result && (
                  <div className="w-2 h-2 rounded-full">
                    {selection.result === 'won' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    {selection.result === 'lost' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                    {selection.result === 'void' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bet Summary */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Stake</div>
            <div className="font-bold">£{bet.stake.toFixed(2)}</div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground mb-1">Potential Return</div>
            <div className="font-bold">£{bet.potentialReturn.toFixed(2)}</div>
          </div>

          {bet.status !== 'pending' && (
            <>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Actual Return</div>
                <div className="font-bold">
                  £{(bet.actualReturn || 0).toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">P&L</div>
                <div className={cn(
                  'font-bold flex items-center gap-1',
                  profit && profit > 0 ? 'text-green-500' : 'text-red-500'
                )}>
                  {profit && profit > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {profit !== null ? `£${Math.abs(profit).toFixed(2)}` : '£0.00'}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Settlement Info */}
        {bet.settledAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <CheckCircle className="w-3 h-3" />
            <span>Settled on {formatDate(bet.settledAt)}</span>
          </div>
        )}

        {/* Actions */}
        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(bet.id)}
            className="w-full mt-4"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}