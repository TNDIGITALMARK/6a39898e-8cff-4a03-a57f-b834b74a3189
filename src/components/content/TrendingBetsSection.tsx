'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendingBet {
  id: string;
  title: string;
  description: string;
  odds: number;
  popularity: number; // percentage
  category: 'goalscorer' | 'result' | 'special';
  event: string;
  isPopular?: boolean;
}

interface TrendingBetsSectionProps {
  bets: TrendingBet[];
  onBetClick: (bet: TrendingBet) => void;
  className?: string;
}

export function TrendingBetsSection({
  bets,
  onBetClick,
  className
}: TrendingBetsSectionProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'goalscorer':
        return Target;
      case 'result':
        return TrendingUp;
      case 'special':
        return Users;
      default:
        return TrendingUp;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'goalscorer':
        return 'text-warning border-warning/20 bg-warning/5';
      case 'result':
        return 'text-primary border-primary/20 bg-primary/5';
      case 'special':
        return 'text-purple-400 border-purple-400/20 bg-purple-400/5';
      default:
        return 'text-primary border-primary/20 bg-primary/5';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold font-heading">Trending Bets</h2>
        </div>

        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Trending Bets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bets.map((bet) => {
          const Icon = getCategoryIcon(bet.category);
          const categoryStyle = getCategoryColor(bet.category);

          return (
            <Card
              key={bet.id}
              className={cn(
                'group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
                bet.isPopular && 'ring-2 ring-warning/50'
              )}
              onClick={() => onBetClick(bet)}
            >
              <CardContent className="p-4">
                {/* Category and Popularity */}
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={cn('text-xs', categoryStyle)}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {bet.category.charAt(0).toUpperCase() + bet.category.slice(1)}
                  </Badge>
                  {bet.isPopular && (
                    <Badge variant="outline" className="text-warning border-warning/20 bg-warning/5 text-xs">
                      Hot
                    </Badge>
                  )}
                </div>

                {/* Bet Title */}
                <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                  {bet.title}
                </h3>

                {/* Event */}
                <p className="text-sm text-muted-foreground mb-2">
                  {bet.event}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {bet.description}
                </p>

                {/* Odds and Popularity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {bet.odds.toFixed(2)}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      odds
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{bet.popularity}% popular</span>
                  </div>
                </div>

                {/* Popularity Bar */}
                <div className="mt-3 w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${bet.popularity}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trending Stats */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground mt-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>Updated every 5 minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Based on user betting patterns</span>
        </div>
      </div>
    </div>
  );
}