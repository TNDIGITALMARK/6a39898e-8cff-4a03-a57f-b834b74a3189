'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { LiveMatchesSection } from '@/components/content/LiveMatchesSection';
import { TrendingBetsSection } from '@/components/content/TrendingBetsSection';
import { OddsUpdateFeed } from '@/components/content/OddsUpdateFeed';
import { MatchCard } from '@/components/betting/MatchCard';
import { BetSlip } from '@/components/betting/BetSlip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBetSlip } from '@/hooks/useBetSlip';
import { useOddsSimulation } from '@/hooks/useOddsSimulation';
import {
  mockLiveMatches,
  mockUpcomingMatches,
  mockTrendingBets,
  mockMatches
} from '@/lib/mockData';
import {
  Calendar,
  TrendingUp,
  Star,
  ChevronRight,
  Trophy
} from 'lucide-react';

export default function Home() {
  const betSlip = useBetSlip();
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'featured'>('live');

  // Initialize odds simulation
  const initialOdds: Record<string, number> = {};
  mockMatches.forEach(match => {
    initialOdds[`${match.id}-match-winner-home`] = match.markets.matchWinner.home;
    if (match.markets.matchWinner.draw) {
      initialOdds[`${match.id}-match-winner-draw`] = match.markets.matchWinner.draw;
    }
    initialOdds[`${match.id}-match-winner-away`] = match.markets.matchWinner.away;
  });

  const oddsSimulation = useOddsSimulation(initialOdds, {
    updateInterval: 15000, // 15 seconds for demo
    maxChange: 0.08, // 8% max change
    volatility: 0.4 // 40% chance of change
  });

  const handleOddsClick = (
    selection: string,
    odds: number,
    market: string,
    matchId: string,
    event: string
  ) => {
    betSlip.addItem(selection, odds, market, matchId, event);
  };

  const handleTrendingBetClick = (bet: any) => {
    // Extract match ID from event or generate one
    const matchId = `trending-${bet.id}`;
    betSlip.addItem(bet.title, bet.odds, bet.category, matchId, bet.event);
  };

  const handlePlaceBet = () => {
    // In a real app, this would make an API call
    console.log('Placing bet:', betSlip.items);
    alert('Bet placed successfully!');
    betSlip.clearAll();
  };

  const filteredMatches = mockMatches.filter(match => {
    switch (activeTab) {
      case 'live':
        return match.isLive;
      case 'upcoming':
        return !match.isLive;
      case 'featured':
        return match.featured;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header
        balance={1250.35}
        betSlipCount={betSlip.count}
        userName="John Doe"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-warning/10 p-6">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold font-heading text-foreground mb-2">
                  Welcome to BetZone
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Experience the thrill of sports betting with live odds and in-play action
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-sm">
                    <Trophy className="w-4 h-4 mr-1" />
                    £50 Welcome Bonus
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    Live Streaming Available
                  </Badge>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-warning/5 rounded-full translate-y-12 -translate-x-12" />
            </div>

            {/* Live Matches Section */}
            <LiveMatchesSection
              matches={mockLiveMatches}
              onOddsClick={handleOddsClick}
              selectedOdds={betSlip.getSelectedOddsIds()}
            />

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={activeTab === 'live' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('live')}
                  className="flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  Live ({mockLiveMatches.length})
                </Button>
                <Button
                  variant={activeTab === 'upcoming' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('upcoming')}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Upcoming ({mockUpcomingMatches.length})
                </Button>
                <Button
                  variant={activeTab === 'featured' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('featured')}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Featured
                </Button>
              </div>

              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All Matches
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onOddsClick={(selection, odds, market) =>
                    handleOddsClick(selection, odds, market, match.id, `${match.homeTeam} vs ${match.awayTeam}`)
                  }
                  selectedOdds={betSlip.getSelectedOddsIds()}
                />
              ))}
            </div>

            {/* Trending Bets Section */}
            <TrendingBetsSection
              bets={mockTrendingBets}
              onBetClick={handleTrendingBetClick}
            />
          </div>

          {/* Bet Slip Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <BetSlip
                items={betSlip.items}
                onRemoveItem={betSlip.removeItem}
                onUpdateStake={betSlip.updateStake}
                onPlaceBet={handlePlaceBet}
                onClear={betSlip.clearAll}
              />

              {/* Odds Update Feed */}
              <OddsUpdateFeed
                updates={oddsSimulation.updates}
                isRunning={oddsSimulation.isRunning}
                onToggleSimulation={() => {
                  if (oddsSimulation.isRunning) {
                    oddsSimulation.stopSimulation();
                  } else {
                    oddsSimulation.startSimulation();
                  }
                }}
                onClearUpdates={oddsSimulation.clearUpdates}
                lastUpdateTime={oddsSimulation.lastUpdateTime}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}