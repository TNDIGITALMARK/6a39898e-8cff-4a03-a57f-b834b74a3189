'use client';

import { Header } from '@/components/navigation/Header';
import { BetSlip } from '@/components/betting/BetSlip';
import { useBetSlip } from '@/hooks/useBetSlip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function BetSlipPage() {
  const betSlip = useBetSlip();

  const handlePlaceBet = () => {
    console.log('Placing bet:', betSlip.items);
    alert('Bet placed successfully!');
    betSlip.clearAll();
  };

  const quickStakes = [5, 10, 25, 50, 100];

  const applyQuickStake = (amount: number) => {
    betSlip.items.forEach(item => {
      betSlip.updateStake(item.id, amount);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header betSlipCount={betSlip.count} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold font-heading">Bet Slip</h1>
                <p className="text-muted-foreground">
                  Review and place your bets
                </p>
              </div>
            </div>

            {betSlip.items.length > 0 && (
              <Badge variant="secondary" className="text-sm">
                {betSlip.items.length} {betSlip.items.length === 1 ? 'selection' : 'selections'}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Bet Slip */}
            <div className="lg:col-span-2 space-y-6">
              {betSlip.items.length > 0 && (
                <>
                  {/* Quick Stakes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="w-5 h-5" />
                        Quick Stakes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {quickStakes.map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => applyQuickStake(amount)}
                            className="flex items-center gap-1"
                          >
                            £{amount}
                          </Button>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Apply stake amount to all selections
                      </p>
                    </CardContent>
                  </Card>

                  {/* Betting Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="w-5 h-5" />
                        Betting Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Stake Responsibly</div>
                            <div className="text-muted-foreground">
                              Only bet what you can afford to lose
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Check Odds</div>
                            <div className="text-muted-foreground">
                              Odds can change until you place your bet
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calculator className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Accumulator Risk</div>
                            <div className="text-muted-foreground">
                              All selections must win for accumulator payout
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">Research First</div>
                            <div className="text-muted-foreground">
                              Check team news and recent form
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Empty State */}
              {betSlip.items.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Your bet slip is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Browse our sports and add selections to get started
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button asChild>
                        <Link href="/">
                          Browse Live Matches
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/event/live-1">
                          View Featured Match
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Bet Slip Component */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BetSlip
                  items={betSlip.items}
                  onRemoveItem={betSlip.removeItem}
                  onUpdateStake={betSlip.updateStake}
                  onPlaceBet={handlePlaceBet}
                  onClear={betSlip.clearAll}
                />

                {/* Additional Actions */}
                {betSlip.items.length > 0 && (
                  <Card className="mt-4">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full" disabled>
                          Save Bet Slip
                        </Button>
                        <Button variant="ghost" className="w-full" disabled>
                          Share Bet Slip
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        Features coming soon
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  <strong>Responsible Gambling:</strong> Gambling can be addictive.
                  Please play responsibly and within your means.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <span>18+ Only</span>
                  <span>•</span>
                  <span>Terms & Conditions Apply</span>
                  <span>•</span>
                  <span>BeGambleAware.org</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}