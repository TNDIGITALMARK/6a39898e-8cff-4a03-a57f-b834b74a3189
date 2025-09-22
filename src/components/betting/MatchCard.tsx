'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OddsButton } from './OddsButton';
import { Clock, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league: string;
  startTime: string;
  isLive: boolean;
  liveScore?: {
    home: number;
    away: number;
    time?: string;
  };
  markets: {
    matchWinner: {
      home: number;
      draw?: number;
      away: number;
    };
  };
  featured?: boolean;
}

interface MatchCardProps {
  match: Match;
  onOddsClick: (selection: string, odds: number, market: string) => void;
  selectedOdds?: string[];
  compact?: boolean;
  className?: string;
}

export function MatchCard({
  match,
  onOddsClick,
  selectedOdds = [],
  compact = false,
  className
}: MatchCardProps) {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isOddsSelected = (selection: string) => {
    return selectedOdds.includes(`${match.id}-${selection}`);
  };

  const handleOddsClick = (selection: string, odds: number) => {
    onOddsClick(selection, odds, 'Match Winner');
  };

  // Generate odds keys for simulation
  const homeOddsKey = `${match.id}-match-winner-home`;
  const drawOddsKey = `${match.id}-match-winner-draw`;
  const awayOddsKey = `${match.id}-match-winner-away`;

  return (
    <Card className={cn(
      'match-card hover:shadow-lg transition-all duration-200',
      match.featured && 'ring-2 ring-warning/50',
      className
    )}>
      <CardContent className={cn('p-4', compact && 'p-3')}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={match.isLive ? 'destructive' : 'secondary'} className="text-xs">
              {match.isLive ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                  LIVE
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(match.startTime)}
                </div>
              )}
            </Badge>
            {match.featured && (
              <Badge variant="outline" className="text-warning border-warning text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {match.isLive ? match.liveScore?.time : formatDate(match.startTime)}
          </div>
        </div>

        {/* League */}
        {!compact && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <Users className="w-3 h-3" />
            <span>{match.sport}</span>
            <span>•</span>
            <span>{match.league}</span>
          </div>
        )}

        {/* Teams */}
        <div className={cn(
          'grid gap-2 mb-4',
          compact ? 'grid-cols-1' : 'grid-cols-1'
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-medium',
                compact ? 'text-sm' : 'text-base'
              )}>
                {match.homeTeam}
              </span>
              {match.isLive && match.liveScore && (
                <span className="text-lg font-bold text-primary">
                  {match.liveScore.home}
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center py-1">
            vs
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={cn(
                'font-medium',
                compact ? 'text-sm' : 'text-base'
              )}>
                {match.awayTeam}
              </span>
              {match.isLive && match.liveScore && (
                <span className="text-lg font-bold text-primary">
                  {match.liveScore.away}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Odds */}
        <div className="grid grid-cols-3 gap-2">
          <OddsButton
            odds={match.markets.matchWinner.home}
            selection={compact ? '1' : match.homeTeam}
            market="Match Winner"
            isSelected={isOddsSelected('home')}
            onClick={() => handleOddsClick('home', match.markets.matchWinner.home)}
            className="text-xs"
          />

          {match.markets.matchWinner.draw && (
            <OddsButton
              odds={match.markets.matchWinner.draw}
              selection="Draw"
              market="Match Winner"
              isSelected={isOddsSelected('draw')}
              onClick={() => handleOddsClick('draw', match.markets.matchWinner.draw)}
              className="text-xs"
            />
          )}

          <OddsButton
            odds={match.markets.matchWinner.away}
            selection={compact ? '2' : match.awayTeam}
            market="Match Winner"
            isSelected={isOddsSelected('away')}
            onClick={() => handleOddsClick('away', match.markets.matchWinner.away)}
            className="text-xs"
          />
        </div>
      </CardContent>
    </Card>
  );
}