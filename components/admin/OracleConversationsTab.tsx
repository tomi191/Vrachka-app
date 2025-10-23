'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  Download,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Filter,
} from "lucide-react";

interface OracleConversation {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  tokens_used: number | null;
  asked_at: string;
  conversation_id: string | null;
  message_type: string | null;
  sentiment: string | null;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

interface OracleConversationsTabProps {
  conversations: OracleConversation[];
}

export function OracleConversationsTab({ conversations }: OracleConversationsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  // Get unique users and sentiments
  const uniqueUsers = useMemo(() => {
    const users = conversations
      .map(c => ({
        name: c.profiles?.full_name || 'Unknown',
        email: c.profiles?.email || ''
      }))
      .filter((user, index, self) =>
        index === self.findIndex(u => u.email === user.email)
      );
    return users;
  }, [conversations]);

  const uniqueSentiments = useMemo(() => {
    const sentiments = conversations
      .map(c => c.sentiment)
      .filter((s): s is string => s !== null)
      .filter((s, i, arr) => arr.indexOf(s) === i);
    return sentiments;
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (dateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      } else if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0);
      }

      filtered = filtered.filter(c => new Date(c.asked_at) >= filterDate);
    }

    // Sentiment filter
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(c => c.sentiment === sentimentFilter);
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(c => c.profiles?.email === userFilter);
    }

    return filtered;
  }, [conversations, searchQuery, dateFilter, sentimentFilter, userFilter]);

  // Analytics
  const analytics = useMemo(() => {
    const totalTokens = filteredConversations.reduce((sum, c) => sum + (c.tokens_used || 0), 0);
    const avgTokens = filteredConversations.length > 0
      ? Math.round(totalTokens / filteredConversations.length)
      : 0;

    const sentimentCounts = filteredConversations.reduce((acc, c) => {
      if (c.sentiment) {
        acc[c.sentiment] = (acc[c.sentiment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topSentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0];

    const uniqueUsersCount = new Set(
      filteredConversations.map(c => c.user_id)
    ).size;

    return {
      total: filteredConversations.length,
      totalTokens,
      avgTokens,
      uniqueUsers: uniqueUsersCount,
      topSentiment: topSentiment ? topSentiment[0] : 'N/A',
    };
  }, [filteredConversations]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Дата', 'Час', 'Потребител', 'Email', 'Въпрос', 'Отговор', 'Tokens', 'Sentiment'];
    const rows = filteredConversations.map(c => [
      new Date(c.asked_at).toLocaleDateString('bg-BG'),
      new Date(c.asked_at).toLocaleTimeString('bg-BG'),
      c.profiles?.full_name || 'Unknown',
      c.profiles?.email || '',
      `"${c.question.replace(/"/g, '""')}"`,
      `"${c.answer.replace(/"/g, '""')}"`,
      c.tokens_used || '',
      c.sentiment || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `oracle-conversations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setSentimentFilter('all');
    setUserFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-50">{analytics.total}</p>
              <p className="text-xs text-zinc-400 mt-1">Разговори</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-50">{analytics.uniqueUsers}</p>
              <p className="text-xs text-zinc-400 mt-1">Потребители</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-zinc-50">{analytics.avgTokens}</p>
              <p className="text-xs text-zinc-400 mt-1">Avg Tokens</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-zinc-50">{analytics.topSentiment}</p>
              <p className="text-xs text-zinc-400 mt-1">Top Sentiment</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center gap-2 text-base">
            <Filter className="w-4 h-4" />
            Филтри
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Търси в разговори..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-zinc-800 text-zinc-100"
              />
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="glass-card border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                <SelectItem value="today">Днес</SelectItem>
                <SelectItem value="7days">Последните 7 дни</SelectItem>
                <SelectItem value="30days">Последните 30 дни</SelectItem>
              </SelectContent>
            </Select>

            {/* Sentiment Filter */}
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="glass-card border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {uniqueSentiments.map(sentiment => (
                  <SelectItem key={sentiment} value={sentiment}>
                    {sentiment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* User Filter */}
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="glass-card border-zinc-800 text-zinc-100">
                <SelectValue placeholder="Потребител" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всички</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex-1 glass-card border-zinc-800 hover:border-zinc-700"
              >
                Изчисти
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex-1 glass-card border-zinc-800 hover:border-zinc-700"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-zinc-50 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Oracle разговори ({filteredConversations.length})
            </span>
            <span className="text-sm text-zinc-500 font-normal">
              {analytics.totalTokens.toLocaleString()} total tokens
            </span>
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Виж всички разговори с AI Оракула за анализ и подобрения
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-5 bg-gradient-to-br from-zinc-950/80 to-zinc-900/50 border border-zinc-800 rounded-lg hover:border-cyan-900/50 transition-all"
                >
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-zinc-100 flex items-center gap-2">
                        {conv.profiles?.full_name || "Unknown"}
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-normal rounded">
                          {conv.message_type || 'user_question'}
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {conv.profiles?.email || 'No email'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">
                        {new Date(conv.asked_at).toLocaleDateString("bg-BG")}
                      </p>
                      <p className="text-xs text-zinc-600">
                        {new Date(conv.asked_at).toLocaleTimeString("bg-BG")}
                      </p>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-cyan-400 mb-1">ВЪПРОС:</p>
                    <p className="text-sm text-zinc-200 bg-zinc-950/50 p-3 rounded border border-zinc-800">
                      {conv.question}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-purple-400 mb-1">ОТГОВОР:</p>
                    <p className="text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded border border-zinc-800 whitespace-pre-wrap">
                      {conv.answer}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                    {conv.conversation_id && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Conv: {conv.conversation_id.slice(0, 8)}...
                      </span>
                    )}
                    {conv.tokens_used && (
                      <span>🎯 {conv.tokens_used} tokens</span>
                    )}
                    {conv.sentiment && (
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded">
                        {conv.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 text-center py-12">
                {searchQuery || dateFilter !== 'all' || sentimentFilter !== 'all' || userFilter !== 'all'
                  ? 'Няма резултати с тези филтри'
                  : 'Няма Oracle разговори'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
