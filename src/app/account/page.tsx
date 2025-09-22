'use client';

import { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { BetHistoryCard } from '@/components/content/BetHistoryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockBetHistory } from '@/lib/mockData';
import {
  User,
  Wallet,
  History,
  Settings,
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  CreditCard,
  Download,
  Filter,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showBalance, setShowBalance] = useState(true);

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    balance: 1250.35,
    totalDeposited: 2500.00,
    totalWithdrawn: 800.00,
    totalWagered: 5670.50,
    totalWon: 3240.75,
    totalLost: 2429.75,
    joinDate: '2024-03-15',
    verificationStatus: 'verified',
    lastLogin: new Date().toISOString(),
  };

  const stats = {
    totalBets: mockBetHistory.length,
    wonBets: mockBetHistory.filter(bet => bet.status === 'won').length,
    lostBets: mockBetHistory.filter(bet => bet.status === 'lost').length,
    pendingBets: mockBetHistory.filter(bet => bet.status === 'pending').length,
    winRate: mockBetHistory.length > 0
      ? (mockBetHistory.filter(bet => bet.status === 'won').length / mockBetHistory.filter(bet => bet.status !== 'pending').length) * 100
      : 0,
    profit: userData.totalWon - userData.totalLost
  };

  const filteredBetHistory = mockBetHistory.filter(bet => {
    if (filterStatus !== 'all' && bet.status !== filterStatus) return false;
    // Add period filtering logic here if needed
    return true;
  });

  const handleViewBetDetails = (betId: string) => {
    console.log('Viewing bet details for:', betId);
    // In a real app, this would navigate to a detailed bet view
  };

  return (
    <div className="min-h-screen bg-background">
      <Header balance={userData.balance} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-heading">My Account</h1>
              <p className="text-muted-foreground mt-2">
                Manage your betting account and view your history
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={userData.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                {userData.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Bet History
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Balance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Account Balance
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-4">
                    {showBalance ? `£${userData.balance.toFixed(2)}` : '••••••'}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Total Deposited</div>
                      <div className="font-semibold">£{userData.totalDeposited.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Withdrawn</div>
                      <div className="font-semibold">£{userData.totalWithdrawn.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total Wagered</div>
                      <div className="font-semibold">£{userData.totalWagered.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Net P&L</div>
                      <div className={cn(
                        'font-semibold flex items-center gap-1',
                        stats.profit >= 0 ? 'text-green-500' : 'text-red-500'
                      )}>
                        {stats.profit >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        £{Math.abs(stats.profit).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Total Bets</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{stats.totalBets}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">Won</span>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-green-500">{stats.wonBets}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">Lost</span>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-red-500">{stats.lostBets}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                    </div>
                    <div className="text-2xl font-bold mt-2 text-warning">
                      {stats.winRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Bets */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBetHistory.slice(0, 3).map(bet => (
                      <BetHistoryCard
                        key={bet.id}
                        bet={bet}
                        onViewDetails={handleViewBetDetails}
                      />
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Bets
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="status-filter">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="void">Void</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="period-filter">Period</Label>
                      <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bet History */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBetHistory.map(bet => (
                  <BetHistoryCard
                    key={bet.id}
                    bet={bet}
                    onViewDetails={handleViewBetDetails}
                  />
                ))}
              </div>

              {filteredBetHistory.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold mb-2">No bets found</h3>
                    <p className="text-muted-foreground">
                      No bets match your current filters. Try adjusting your search criteria.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Deposit Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Deposit Funds
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deposit-amount">Amount</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        min="10"
                        max="5000"
                      />
                    </div>
                    <div>
                      <Label>Payment Method</Label>
                      <Select defaultValue="card">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Credit/Debit Card
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      Deposit Funds
                    </Button>
                  </CardContent>
                </Card>

                {/* Withdraw Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      Withdraw Funds
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">Amount</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="0.00"
                        min="10"
                        max={userData.balance}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Available balance: £{userData.balance.toFixed(2)}
                    </div>
                    <Button variant="outline" className="w-full">
                      Withdraw Funds
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <Wallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Transaction history would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              {/* Profile Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={userData.email} />
                    </div>
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Enable Two-Factor Authentication
                  </Button>
                </CardContent>
              </Card>

              {/* Betting Limits */}
              <Card>
                <CardHeader>
                  <CardTitle>Responsible Gambling</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="daily-limit">Daily Betting Limit</Label>
                    <Input
                      id="daily-limit"
                      type="number"
                      placeholder="100.00"
                    />
                  </div>
                  <Button variant="outline">Set Limits</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}