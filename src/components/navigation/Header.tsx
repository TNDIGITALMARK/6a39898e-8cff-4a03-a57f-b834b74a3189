'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  Circle,
  User,
  Wallet,
  History,
  Settings,
  LogOut,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  balance?: number;
  betSlipCount?: number;
  userName?: string;
}

export function Header({ balance = 1250.35, betSlipCount = 0, userName }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sports = [
    { name: 'Football', icon: Circle, href: '/', active: true },
    { name: 'Basketball', icon: Target, href: '/basketball' },
    { name: 'Tennis', icon: Trophy, href: '/tennis' },
    { name: 'Boxing', icon: Zap, href: '/boxing' },
  ];

  const userMenuItems = [
    { name: 'My Account', icon: User, href: '/account' },
    { name: 'Bet History', icon: History, href: '/history' },
    { name: 'Deposit', icon: Wallet, href: '/deposit' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Circle className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold">BetZone</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {sports.map((sport) => (
              <NavigationMenuItem key={sport.name}>
                <NavigationMenuLink asChild>
                  <Link
                    href={sport.href}
                    className={cn(
                      'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                      sport.active && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <sport.icon className="mr-2 h-4 w-4" />
                    {sport.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side - Balance, Bet Slip, User */}
        <div className="flex items-center space-x-4">
          {/* Balance */}
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Balance:</span>
            <span className="font-bold text-primary">£{balance.toFixed(2)}</span>
          </div>

          {/* Bet Slip Button */}
          <Button variant="outline" asChild className="relative">
            <Link href="/bet-slip">
              Bet Slip
              {betSlipCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {betSlipCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu - Desktop */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-3">
                  <User className="h-4 w-4 mr-2" />
                  {userName || 'Account'}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-48 p-2">
                    {userMenuItems.map((item) => (
                      <NavigationMenuLink key={item.name} asChild>
                        <Link
                          href={item.href}
                          className="flex items-center space-x-2 w-full rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                    <div className="border-t mt-2 pt-2">
                      <button className="flex items-center space-x-2 w-full rounded-md p-2 text-sm text-destructive hover:bg-accent">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col h-full">
                {/* Balance */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Balance:</span>
                  </div>
                  <span className="font-bold text-primary">£{balance.toFixed(2)}</span>
                </div>

                {/* Sports */}
                <div className="space-y-2 mb-6">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                    Sports
                  </h3>
                  {sports.map((sport) => (
                    <Link
                      key={sport.name}
                      href={sport.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 w-full rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                        sport.active && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <sport.icon className="h-4 w-4" />
                      <span>{sport.name}</span>
                    </Link>
                  ))}
                </div>

                {/* User Menu */}
                <div className="space-y-2 flex-1">
                  <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
                    Account
                  </h3>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 w-full rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Sign Out */}
                <button className="flex items-center space-x-3 w-full rounded-md p-3 text-sm text-destructive hover:bg-accent mt-4">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}