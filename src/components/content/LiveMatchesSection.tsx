'use client';

import React from 'react';
import { MatchCard, Match } from '@/components/betting/MatchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveMatchesSectionProps {
  matches: Match[];
  onOddsClick: (selection: string, odds: number, market: string, matchId: string, event: string) => void;
  selectedOdds?: string[];
  className?: string;
}

export function LiveMatchesSection({
  matches,
  onOddsClick,
  selectedOdds = [],
  className
}: LiveMatchesSectionProps) {
  const liveMatches = matches.filter(match => match.isLive);

  const handleOddsClick = (selection: string, odds: number, market: string) => {
    const match = liveMatches[0]; // This would need to be passed properly in a real implementation
    if (match) {
      onOddsClick(selection, odds, market, match.id, `${match.homeTeam} vs ${match.awayTeam}`);
    }
  };

  if (liveMatches.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Zap className="w-6 h-6 text-destructive" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold font-heading">Live Matches</h2>
          </div>
          <Badge variant="destructive" className="animate-pulse">
            {liveMatches.length} Live
          </Badge>
        </div>

        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Featured Live Match */}
      {liveMatches[0] && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 to-warning/20 rounded-lg blur" />
          <MatchCard
            match={liveMatches[0]}
            onOddsClick={handleOddsClick}
            selectedOdds={selectedOdds}
            className="relative bg-card border-destructive/30"
          />
        </div>
      )}

      {/* Other Live Matches Grid */}
      {liveMatches.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.slice(1).map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              onOddsClick={(selection, odds, market) =>
                onOddsClick(selection, odds, market, match.id, `${match.homeTeam} vs ${match.awayTeam}`)
              }
              selectedOdds={selectedOdds}
              compact={index > 2}
              className="hover:border-destructive/50 transition-colors"
            />
          ))}
        </div>
      )}

      {/* Live Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
          <span>Live updates every 30 seconds</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>In-play betting available</span>
        </div>
      </div>
    </div>
  );
}