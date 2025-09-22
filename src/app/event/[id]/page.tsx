'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { MarketSection, Market } from '@/components/betting/MarketSection';
import { BetSlip } from '@/components/betting/BetSlip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBetSlip } from '@/hooks/useBetSlip';
import {
  ArrowLeft,
  Clock,
  Users,
  TrendingUp,
  Play,
  BarChart3,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock detailed match data
const mockEventData = {
  'live-1': {
    id: 'live-1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    sport: 'Football',
    league: 'Premier League',
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isLive: true,
    liveScore: { home: 2, away: 1, time: "67'" },
    venue: 'Old Trafford',
    attendance: 75000,
    statistics: {
      possession: { home: 45, away: 55 },
      shots: { home: 8, away: 12 },
      shotsOnTarget: { home: 4, away: 5 },
      corners: { home: 3, away: 7 },
      fouls: { home: 12, away: 8 },
      yellowCards: { home: 2, away: 1 },
      redCards: { home: 0, away: 0 }
    }
  }
};

const mockMarkets: Market[] = [
  {
    id: 'match-winner',
    name: 'Match Winner',
    description: 'Predict the outcome of the match',
    popular: true,
    selections: [
      { id: 'home', name: 'Manchester United', odds: 2.15, movement: 'up' },
      { id: 'draw', name: 'Draw', odds: 3.50, movement: 'same' },
      { id: 'away', name: 'Liverpool', odds: 3.10, movement: 'down' }
    ]
  },
  {
    id: 'both-teams-score',
    name: 'Both Teams to Score',
    description: 'Will both teams score at least one goal?',
    popular: true,
    selections: [
      { id: 'yes', name: 'Yes', odds: 1.45, movement: 'down' },
      { id: 'no', name: 'No', odds: 2.75, movement: 'up' }
    ]
  },
  {
    id: 'total-goals',
    name: 'Total Goals',
    description: 'Total number of goals scored in the match',
    selections: [
      { id: 'under-2.5', name: 'Under 2.5', odds: 2.20, movement: 'up' },
      { id: 'over-2.5', name: 'Over 2.5', odds: 1.65, movement: 'down' },
      { id: 'under-3.5', name: 'Under 3.5', odds: 1.35, movement: 'same' },
      { id: 'over-3.5', name: 'Over 3.5', odds: 3.10, movement: 'up' }
    ]
  },
  {
    id: 'correct-score',
    name: 'Correct Score',
    description: 'Predict the exact final score',
    selections: [
      { id: '1-0', name: '1-0', odds: 8.50 },
      { id: '2-0', name: '2-0', odds: 12.00 },
      { id: '2-1', name: '2-1', odds: 9.50, movement: 'down' },
      { id: '1-1', name: '1-1', odds: 6.75 },
      { id: '0-1', name: '0-1', odds: 11.00 },
      { id: '1-2', name: '1-2', odds: 14.00 },
      { id: '3-1', name: '3-1', odds: 18.00 },
      { id: '0-2', name: '0-2', odds: 22.00 }
    ]
  },
  {
    id: 'first-goalscorer',
    name: 'First Goalscorer',
    description: 'Who will score the first goal?',
    popular: true,
    selections: [
      { id: 'rashford', name: 'Marcus Rashford', odds: 4.50, movement: 'up' },
      { id: 'salah', name: 'Mohamed Salah', odds: 5.00, movement: 'same' },
      { id: 'fernandes', name: 'Bruno Fernandes', odds: 6.50 },
      { id: 'nunez', name: 'Darwin Núñez', odds: 7.00, movement: 'down' },
      { id: 'garnacho', name: 'Alejandro Garnacho', odds: 8.00 },
      { id: 'diaz', name: 'Luis Díaz', odds: 8.50 }
    ]
  },
  {
    id: 'asian-handicap',
    name: 'Asian Handicap',
    description: 'Handicap betting with level playing field',
    handicap: '+0.5/-0.5',
    selections: [
      { id: 'home-handicap', name: 'Manchester United +0.5', odds: 1.95 },
      { id: 'away-handicap', name: 'Liverpool -0.5', odds: 1.85 }
    ]
  }
];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const betSlip = useBetSlip();
  const [activeTab, setActiveTab] = useState('markets');

  const eventId = params.id as string;
  const eventData = mockEventData[eventId as keyof typeof mockEventData];

  const handleOddsClick = (
    selectionId: string,
    selection: string,
    odds: number,
    market: string
  ) => {
    betSlip.addItem(
      selection,
      odds,
      market,
      eventId,
      `${eventData.homeTeam} vs ${eventData.awayTeam}`
    );
  };

  const handlePlaceBet = () => {
    console.log('Placing bet:', betSlip.items);
    alert('Bet placed successfully!');
    betSlip.clearAll();
  };

  if (!eventData) {
    return (
      <div className="min-h-screen bg-background">
        <Header betSlipCount={betSlip.count} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Event not found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }

  const popularMarkets = mockMarkets.filter(market => market.popular);
  const allMarkets = mockMarkets;

  return (
    <div className="min-h-screen bg-background">
      <Header betSlipCount={betSlip.count} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to matches
            </Button>

            {/* Match Header */}
            <Card className="relative overflow-hidden">
              {eventData.isLive && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="animate-pulse">
                    <div className="w-2 h-2 bg-current rounded-full mr-2" />
                    LIVE
                  </Badge>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span>{eventData.sport} • {eventData.league}</span>
                  <span>•</span>
                  <span>{eventData.venue}</span>
                </div>

                <div className="grid grid-cols-3 items-center gap-4 text-center">
                  <div>
                    <h1 className="text-xl font-bold">{eventData.homeTeam}</h1>
                    {eventData.isLive && eventData.liveScore && (
                      <div className="text-3xl font-bold text-primary mt-2">
                        {eventData.liveScore.home}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {eventData.isLive ? eventData.liveScore?.time : 'Kick-off'}
                    </div>
                    {!eventData.isLive ? (
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(eventData.startTime).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold">VS</div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-xl font-bold">{eventData.awayTeam}</h1>
                    {eventData.isLive && eventData.liveScore && (
                      <div className="text-3xl font-bold text-primary mt-2">
                        {eventData.liveScore.away}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="markets" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Markets
                </TabsTrigger>
                <TabsTrigger value="statistics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Statistics
                </TabsTrigger>
                <TabsTrigger value="live" className="flex items-center gap-2" disabled={!eventData.isLive}>
                  <Play className="w-4 h-4" />
                  Live
                </TabsTrigger>
              </TabsList>

              <TabsContent value="markets" className="space-y-6 mt-6">
                {/* Popular Markets */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-warning" />
                    <h2 className="text-xl font-bold font-heading">Popular Markets</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {popularMarkets.map(market => (
                      <MarketSection
                        key={market.id}
                        market={market}
                        onOddsClick={handleOddsClick}
                        selectedOdds={betSlip.getSelectedOddsIds()}
                        expanded={true}
                      />
                    ))}
                  </div>
                </div>

                {/* All Markets */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold font-heading">All Markets</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {allMarkets.filter(market => !market.popular).map(market => (
                      <MarketSection
                        key={market.id}
                        market={market}
                        onOddsClick={handleOddsClick}
                        selectedOdds={betSlip.getSelectedOddsIds()}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-6 mt-6">
                {eventData.statistics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Match Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(eventData.statistics).map(([key, value]) => {
                        if (typeof value === 'object' && 'home' in value && 'away' in value) {
                          const homeValue = value.home;
                          const awayValue = value.away;
                          const total = homeValue + awayValue;
                          const homePercentage = total > 0 ? (homeValue / total) * 100 : 0;

                          return (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-2">
                                <span>{homeValue}</span>
                                <span className="font-medium capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span>{awayValue}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${homePercentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="live" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-destructive" />
                      Live Match Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                      <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Live streaming and commentary would appear here</p>
                      <p className="text-sm mt-2">Real-time updates every 30 seconds</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Bet Slip Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BetSlip
                items={betSlip.items}
                onRemoveItem={betSlip.removeItem}
                onUpdateStake={betSlip.updateStake}
                onPlaceBet={handlePlaceBet}
                onClear={betSlip.clearAll}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}