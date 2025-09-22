import { Match } from '@/components/betting/MatchCard';
import { BetSlipItem } from '@/components/betting/BetSlip';

export interface TrendingBet {
  id: string;
  title: string;
  description: string;
  odds: number;
  popularity: number;
  category: 'goalscorer' | 'result' | 'special';
  event: string;
  isPopular?: boolean;
}

export interface BetHistory {
  id: string;
  selections: Array<{
    selection: string;
    odds: number;
    market: string;
    event: string;
    result?: 'won' | 'lost' | 'void' | 'pending';
  }>;
  betType: 'single' | 'accumulator';
  stake: number;
  potentialReturn: number;
  actualReturn?: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  placedAt: string;
  settledAt?: string;
}

// Mock live matches
export const mockLiveMatches: Match[] = [
  {
    id: 'live-1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    sport: 'Football',
    league: 'Premier League',
    startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // Started 45 mins ago
    isLive: true,
    liveScore: {
      home: 2,
      away: 1,
      time: "67'"
    },
    markets: {
      matchWinner: {
        home: 2.15,
        draw: 3.50,
        away: 3.10
      }
    },
    featured: true
  },
  {
    id: 'live-2',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'LA Lakers',
    sport: 'Basketball',
    league: 'NBA',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isLive: true,
    liveScore: {
      home: 98,
      away: 102,
      time: "Q3 8:45"
    },
    markets: {
      matchWinner: {
        home: 1.80,
        away: 2.05
      }
    }
  },
  {
    id: 'live-3',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    sport: 'Football',
    league: 'Premier League',
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isLive: true,
    liveScore: {
      home: 0,
      away: 1,
      time: "23'"
    },
    markets: {
      matchWinner: {
        home: 2.80,
        draw: 3.20,
        away: 2.40
      }
    }
  }
];

// Mock upcoming matches
export const mockUpcomingMatches: Match[] = [
  {
    id: 'upcoming-1',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    sport: 'Football',
    league: 'La Liga',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    isLive: false,
    markets: {
      matchWinner: {
        home: 2.25,
        draw: 3.40,
        away: 2.90
      }
    },
    featured: true
  },
  {
    id: 'upcoming-2',
    homeTeam: 'Miami Heat',
    awayTeam: 'Boston Celtics',
    sport: 'Basketball',
    league: 'NBA',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    isLive: false,
    markets: {
      matchWinner: {
        home: 1.95,
        away: 1.85
      }
    }
  },
  {
    id: 'upcoming-3',
    homeTeam: 'Tottenham',
    awayTeam: 'Newcastle',
    sport: 'Football',
    league: 'Premier League',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    isLive: false,
    markets: {
      matchWinner: {
        home: 1.75,
        draw: 3.60,
        away: 4.20
      }
    }
  },
  {
    id: 'upcoming-4',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    sport: 'Football',
    league: 'Bundesliga',
    startTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    isLive: false,
    markets: {
      matchWinner: {
        home: 1.55,
        draw: 4.00,
        away: 5.50
      }
    }
  }
];

// Mock trending bets
export const mockTrendingBets: TrendingBet[] = [
  {
    id: 'trend-1',
    title: 'Salah to score first',
    description: 'Mohamed Salah to score the opening goal against Manchester United',
    odds: 4.50,
    popularity: 78,
    category: 'goalscorer',
    event: 'Liverpool vs Manchester United',
    isPopular: true
  },
  {
    id: 'trend-2',
    title: 'LeBron James over 25.5 points',
    description: 'LeBron James to score more than 25.5 points in the game',
    odds: 1.85,
    popularity: 65,
    category: 'special',
    event: 'LA Lakers vs Golden State Warriors'
  },
  {
    id: 'trend-3',
    title: 'Fury to win by KO',
    description: 'Tyson Fury to win the fight by knockout or technical knockout',
    odds: 3.20,
    popularity: 72,
    category: 'result',
    event: 'Fury vs Wilder III',
    isPopular: true
  },
  {
    id: 'trend-4',
    title: 'Both teams to score',
    description: 'Both Barcelona and Real Madrid to score at least one goal',
    odds: 1.45,
    popularity: 89,
    category: 'special',
    event: 'Barcelona vs Real Madrid',
    isPopular: true
  },
  {
    id: 'trend-5',
    title: 'Over 2.5 goals',
    description: 'Total goals in the match to be over 2.5',
    odds: 1.75,
    popularity: 56,
    category: 'special',
    event: 'Chelsea vs Arsenal'
  },
  {
    id: 'trend-6',
    title: 'Haaland anytime scorer',
    description: 'Erling Haaland to score at any time during the match',
    odds: 1.60,
    popularity: 82,
    category: 'goalscorer',
    event: 'Manchester City vs Liverpool',
    isPopular: true
  }
];

// Mock bet history
export const mockBetHistory: BetHistory[] = [
  {
    id: 'bet-1',
    selections: [
      {
        selection: 'Manchester City',
        odds: 1.75,
        market: 'Match Winner',
        event: 'Manchester City vs Arsenal',
        result: 'won'
      }
    ],
    betType: 'single',
    stake: 25.00,
    potentialReturn: 43.75,
    actualReturn: 43.75,
    status: 'won',
    placedAt: '2025-01-20T15:30:00Z',
    settledAt: '2025-01-20T17:30:00Z'
  },
  {
    id: 'bet-2',
    selections: [
      {
        selection: 'Liverpool',
        odds: 2.10,
        market: 'Match Winner',
        event: 'Liverpool vs Chelsea',
        result: 'won'
      },
      {
        selection: 'Barcelona',
        odds: 1.85,
        market: 'Match Winner',
        event: 'Barcelona vs Valencia',
        result: 'won'
      }
    ],
    betType: 'accumulator',
    stake: 15.00,
    potentialReturn: 58.28,
    actualReturn: 58.28,
    status: 'won',
    placedAt: '2025-01-19T14:15:00Z',
    settledAt: '2025-01-19T18:45:00Z'
  },
  {
    id: 'bet-3',
    selections: [
      {
        selection: 'Over 2.5 Goals',
        odds: 1.65,
        market: 'Total Goals',
        event: 'Real Madrid vs Atletico',
        result: 'lost'
      }
    ],
    betType: 'single',
    stake: 30.00,
    potentialReturn: 49.50,
    actualReturn: 0,
    status: 'lost',
    placedAt: '2025-01-18T16:00:00Z',
    settledAt: '2025-01-18T18:00:00Z'
  },
  {
    id: 'bet-4',
    selections: [
      {
        selection: 'Miami Heat',
        odds: 1.95,
        market: 'Match Winner',
        event: 'Miami Heat vs Boston Celtics',
        result: 'pending'
      }
    ],
    betType: 'single',
    stake: 20.00,
    potentialReturn: 39.00,
    status: 'pending',
    placedAt: '2025-01-21T10:30:00Z'
  }
];

// Combined data
export const mockMatches: Match[] = [...mockLiveMatches, ...mockUpcomingMatches];