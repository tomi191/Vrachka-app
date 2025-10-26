"use client";import { useState } from 'react';import { Sun, Moon, Star, Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';interface ChartData {  chart_data: any;  interpretation: any;}export function NatalChartView({ chart }: { chart: ChartData }) {  const [activeTab, setActiveTab] = useState<'overview' | 'planets' | 'houses' | 'aspects'>('overview');  const raw = chart.chart_data || {};  const interpretation = chart.interpretation;  // Normalization helpers to handle legacy saved charts (different shapes)  const safeNum = (v: any, d = 0) => {    const n = typeof v === 'number' ? v : Number(v);    return isFinite(n) ? n : d;  };  const getSignText = (v: any): string => {    if (!v) return 'Unknown';    if (typeof v === 'string') return v;    if (typeof v?.Sign?.key === 'string') return v.Sign.key;    return String(v.label || 'Unknown');  };  const normalizePlanet = (p: any) => {    if (!p || typeof p !== 'object') return {} as any;    const emoji = p.emoji || '';    const name = p.name || p.label || '';    const degree = safeNum(p.degree ?? p?.ChartPosition?.Ecliptic?.DecimalDegrees);    const house = safeNum(p.house ?? p?.House ?? 1) || 1;    const retrograde = Boolean(p.retrograde ?? p.isRetrograde);    const sign = typeof p.sign === 'string' ? p.sign : getSignText(p);    return { emoji, name, degree, house, retrograde, sign };  };  const normalizeHouses = (h: any): Array<{ number: number; sign: string; degree: number }> => {    const list: any[] = Array.isArray(h) ? h : Array.isArray(h?.Houses) ? h.Houses : Array.isArray(h?.houses) ? h.houses : [];    return list.map((house, idx) => ({      number: safeNum(house.number ?? idx + 1),      sign: typeof house.sign === 'string' ? house.sign : getSignText(house),      degree: safeNum(house.degree ?? house?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees),    }));  };  const normalizeAspects = (a: any): Array<{ planet1: string; planet2: string; type: string; angle: number; orb: number }> => {    const list: any[] = Array.isArray(a) ? a : Array.isArray(a?.all) ? a.all : [];    return list.map((x) => ({      planet1: String(x.planet1 || x.firstPlanetName || ''),      planet2: String(x.planet2 || x.secondPlanetName || ''),      type: String(x.type || x.name || '').toLowerCase(),      angle: safeNum(x.angle),      orb: safeNum(x.orb),    }));  };  const chartData = {    sun: normalizePlanet(raw.sun),    moon: normalizePlanet(raw.moon),    rising: normalizePlanet(raw.rising),    mercury: normalizePlanet(raw.mercury),    venus: normalizePlanet(raw.venus),    mars: normalizePlanet(raw.mars),    jupiter: normalizePlanet(raw.jupiter),    saturn: normalizePlanet(raw.saturn),    uranus: normalizePlanet(raw.uranus),    neptune: normalizePlanet(raw.neptune),    pluto: normalizePlanet(raw.pluto),    houses: normalizeHouses(raw.houses || raw.Houses || raw.positions?.houses),    aspects: normalizeAspects(raw.aspects || raw.Aspects || raw.positions?.aspects),    calculated_at: raw.calculated_at,  } as any;  const tabs = [    { id: 'overview', label: 'Преглед', icon: Sparkles },    { id: 'planets', label: 'Планети', icon: Star },    { id: 'houses', label: 'Къщи', icon: Sun },    { id: 'aspects', label: 'Аспекти', icon: Moon },  ];  return (    <div className="space-y-8">      {/* Summary Cards */}      <div className="grid md:grid-cols-3 gap-6">        {/* Sun Card */}        <div className="glass-card p-6">          <div className="flex items-center gap-3 mb-4">            <div className="text-3xl">{chartData.sun.emoji}</div>            <div>              <h3 className="text-lg font-bold text-zinc-50">Слънце</h3>              <p className="text-sm text-zinc-400">{chartData.sun.sign}</p>            </div>          </div>          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.sun.degree).toFixed(2)}°</p>          <p className="text-sm text-zinc-500 mt-1">Къща {chartData.sun.house}</p>        </div>        {/* Moon Card */}        <div className="glass-card p-6">          <div className="flex items-center gap-3 mb-4">            <div className="text-3xl">{chartData.moon.emoji}</div>            <div>              <h3 className="text-lg font-bold text-zinc-50">Луна</h3>              <p className="text-sm text-zinc-400">{chartData.moon.sign}</p>            </div>          </div>          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.moon.degree).toFixed(2)}°</p>          <p className="text-sm text-zinc-500 mt-1">Къща {chartData.moon.house}</p>        </div>        {/* Rising Card */}        <div className="glass-card p-6">          <div className="flex items-center gap-3 mb-4">            <div className="text-3xl">{chartData.rising.emoji}</div>            <div>              <h3 className="text-lg font-bold text-zinc-50">Възходящ</h3>              <p className="text-sm text-zinc-400">{chartData.rising.sign}</p>            </div>          </div>          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.rising.degree).toFixed(2)}°</p>          <p className="text-sm text-zinc-500 mt-1">Асцендент</p>        </div>      </div>      {/* Main Content */}      <div className="glass-card p-6">        {/* Tabs */}        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">          {tabs.map(tab => {            const Icon = tab.icon;            return (              <button                key={tab.id}                onClick={() => setActiveTab(tab.id as any)}                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${                  activeTab === tab.id                    ? 'bg-accent-600 text-white'                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'                }`}              >                <Icon className="w-4 h-4" />                {tab.label}              </button>            );          })}        </div>        {/* Tab Content */}        {activeTab === 'overview' && interpretation && (          <div className="space-y-8">            {/* Overview */}            <div>              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Обща Интерпретация</h2>              <div className="prose prose-invert max-w-none">                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">                  {interpretation.overview}                </p>              </div>            </div>            {/* Big 3 Interpretations */}            <div className="grid md:grid-cols-3 gap-6">              <div className="p-4 bg-zinc-900/50 rounded-lg">                <div className="flex items-center gap-2 mb-3">                  <Sun className="w-5 h-5 text-yellow-400" />                  <h3 className="font-bold text-zinc-50">Слънце</h3>                </div>                <p className="text-sm text-zinc-400 leading-relaxed">                  {interpretation.sun_interpretation}                </p>              </div>              <div className="p-4 bg-zinc-900/50 rounded-lg">                <div className="flex items-center gap-2 mb-3">                  <Moon className="w-5 h-5 text-blue-400" />                  <h3 className="font-bold text-zinc-50">Луна</h3>                </div>                <p className="text-sm text-zinc-400 leading-relaxed">                  {interpretation.moon_interpretation}                </p>              </div>              <div className="p-4 bg-zinc-900/50 rounded-lg">                <div className="flex items-center gap-2 mb-3">                  <Star className="w-5 h-5 text-purple-400" />                  <h3 className="font-bold text-zinc-50">Възходящ</h3>                </div>                <p className="text-sm text-zinc-400 leading-relaxed">                  {interpretation.rising_interpretation}                </p>              </div>            </div>            {/* Strengths, Challenges, Recommendations */}            <div className="grid md:grid-cols-3 gap-6">              {/* Strengths */}              <div>                <div className="flex items-center gap-2 mb-4">                  <TrendingUp className="w-5 h-5 text-green-400" />                  <h3 className="text-lg font-bold text-zinc-50">Силни Страни</h3>                </div>                <ul className="space-y-2">                  {interpretation.strengths.map((strength: string, i: number) => (                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">                      <span className="text-green-400 mt-1">✓</span>                      <span>{strength}</span>                    </li>                  ))}                </ul>              </div>              {/* Challenges */}              <div>                <div className="flex items-center gap-2 mb-4">                  <AlertCircle className="w-5 h-5 text-orange-400" />                  <h3 className="text-lg font-bold text-zinc-50">Предизвикателства</h3>                </div>                <ul className="space-y-2">                  {interpretation.challenges.map((challenge: string, i: number) => (                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">                      <span className="text-orange-400 mt-1">⚠</span>                      <span>{challenge}</span>                    </li>                  ))}                </ul>              </div>              {/* Recommendations */}              <div>                <div className="flex items-center gap-2 mb-4">                  <Lightbulb className="w-5 h-5 text-yellow-400" />                  <h3 className="text-lg font-bold text-zinc-50">Препоръки</h3>                </div>                <ul className="space-y-2">                  {interpretation.recommendations.map((rec: string, i: number) => (                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">                      <span className="text-yellow-400 mt-1">💡</span>                      <span>{rec}</span>                    </li>                  ))}                </ul>              </div>            </div>            {/* Life Path */}            <div className="p-6 bg-gradient-to-r from-accent-500/10 to-purple-500/10 border border-accent-500/20 rounded-lg">              <h3 className="text-xl font-bold text-zinc-50 mb-4">Жизнен Път</h3>              <p className="text-zinc-300 leading-relaxed whitespace-pre-line">                {interpretation.life_path}              </p>            </div>            {/* Major Aspects */}            {interpretation.major_aspects && (              <div>                <h3 className="text-xl font-bold text-zinc-50 mb-4">Важни Аспекти</h3>                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">                  {interpretation.major_aspects}                </p>              </div>            )}          </div>        )}        {activeTab === 'planets' && (          <div>            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Планетни Позиции</h2>            <div className="grid md:grid-cols-2 gap-4">              {Object.entries(chartData).map(([key, value]: [string, any]) => {                if (key === 'houses' || key === 'aspects' || key === 'calculated_at' || key === 'rising') {                  return null;                }                return (                  <div key={key} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg">                    <div className="text-3xl">{value.emoji}</div>                    <div className="flex-1">                      <div className="flex items-center gap-2 mb-1">                        <h3 className="font-bold text-zinc-50">{value.name}</h3>                        {value.retrograde && (                          <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">                            ℞                          </span>                        )}                      </div>                      <p className="text-sm text-zinc-400">                        {value.sign} {safeNum(value.degree).toFixed(2)}° • Къща {value.house}                      </p>                    </div>                  </div>                );              })}            </div>          </div>        )}        {activeTab === 'houses' && (          <div>            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Астрологични Къщи</h2>            <div className="grid md:grid-cols-2 gap-4">              {chartData.houses.map((house: any) => (                <div key={house.number} className="p-4 bg-zinc-900/50 rounded-lg">                  <div className="flex items-center justify-between mb-2">                    <h3 className="font-bold text-zinc-50">Къща {house.number}</h3>                    <span className="text-accent-400">{safeNum(house.degree).toFixed(2)}°</span>                  </div>                  <p className="text-sm text-zinc-400">{house.sign}</p>                </div>              ))}            </div>          </div>        )}        {activeTab === 'aspects' && (          <div>            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Планетни Аспекти</h2>            <div className="space-y-3">              {chartData.aspects.slice(0, 15).map((aspect: any, i: number) => (                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">                  <div className="flex items-center gap-3">                    <span className="text-2xl">{getAspectSymbol(aspect.type)}</span>                    <div>                      <p className="text-zinc-200 font-medium">                        {aspect.planet1} {aspect.type} {aspect.planet2}                      </p>                      <p className="text-sm text-zinc-500">                        {safeNum(aspect.angle).toFixed(2)}° • Орб: {safeNum(aspect.orb).toFixed(2)}°                      </p>                    </div>                  </div>                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAspectColor(aspect.type)}`}>                    {aspect.type}                  </span>                </div>              ))}            </div>          </div>        )}      </div>    </div>  );}function getAspectSymbol(type: string): string {  const symbols: Record<string, string> = {    conjunction: '☌',    opposition: '☍',    trine: '△',    square: '□',    sextile: '⚹',  };  return symbols[type.toLowerCase()] || '∠';}function getAspectColor(type: string): string {  const colors: Record<string, string> = {    conjunction: 'bg-purple-500/20 text-purple-400',    opposition: 'bg-red-500/20 text-red-400',    trine: 'bg-green-500/20 text-green-400',    square: 'bg-orange-500/20 text-orange-400',    sextile: 'bg-blue-500/20 text-blue-400',  };  return colors[type.toLowerCase()] || 'bg-zinc-500/20 text-zinc-400';}
"use client";

import React, { useState } from 'react';
import { Sun, Moon, Star, Sparkles } from 'lucide-react';

interface ChartData {
  chart_data: any;
  interpretation: any;
}

export function NatalChartView({ chart }: { chart: ChartData }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'planets' | 'houses' | 'aspects'>('overview');

  const raw = chart.chart_data || {};
  const interpretation = chart.interpretation;

  // Helpers to normalize legacy chart shapes safely
  const safeNum = (v: any, d = 0) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : d;
  };

  const getSignText = (v: any): string => {
    if (!v) return 'Unknown';
    if (typeof v === 'string') return v;
    if (typeof v?.Sign?.key === 'string') return String(v.Sign.key);
    return String(v?.label || 'Unknown');
  };

  const normalizePlanet = (p: any) => {
    if (!p || typeof p !== 'object') return { emoji: '', name: '', degree: 0, house: 1, retrograde: false, sign: 'Unknown' };
    const emoji = p.emoji || '';
    const name = p.name || p.label || '';
    const degree = safeNum(p.degree ?? p?.ChartPosition?.Ecliptic?.DecimalDegrees);
    const house = safeNum(p.house ?? p?.House ?? 1) || 1;
    const retrograde = Boolean(p.retrograde ?? p.isRetrograde);
    const sign = typeof p.sign === 'string' ? p.sign : getSignText(p);
    return { emoji, name, degree, house, retrograde, sign };
  };

  const normalizeHouses = (h: any): Array<{ number: number; sign: string; degree: number }> => {
    const list: any[] = Array.isArray(h) ? h : Array.isArray(h?.Houses) ? h.Houses : Array.isArray(h?.houses) ? h.houses : [];
    return list.map((house, idx) => ({
      number: safeNum(house.number ?? idx + 1),
      sign: typeof house.sign === 'string' ? house.sign : getSignText(house),
      degree: safeNum(house.degree ?? house?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees),
    }));
  };

  const normalizeAspects = (a: any): Array<{ planet1: string; planet2: string; type: string; angle: number; orb: number }> => {
    const list: any[] = Array.isArray(a) ? a : Array.isArray(a?.all) ? a.all : [];
    return list.map((x) => ({
      planet1: String(x.planet1 || x.firstPlanetName || ''),
      planet2: String(x.planet2 || x.secondPlanetName || ''),
      type: String(x.type || x.name || '').toLowerCase(),
      angle: safeNum(x.angle),
      orb: safeNum(x.orb),
    }));
  };

  const chartData = {
    sun: normalizePlanet(raw.sun),
    moon: normalizePlanet(raw.moon),
    rising: normalizePlanet(raw.rising),
    mercury: normalizePlanet(raw.mercury),
    venus: normalizePlanet(raw.venus),
    mars: normalizePlanet(raw.mars),
    jupiter: normalizePlanet(raw.jupiter),
    saturn: normalizePlanet(raw.saturn),
    uranus: normalizePlanet(raw.uranus),
    neptune: normalizePlanet(raw.neptune),
    pluto: normalizePlanet(raw.pluto),
    houses: normalizeHouses(raw.houses || raw.Houses || raw.positions?.houses),
    aspects: normalizeAspects(raw.aspects || raw.Aspects || raw.positions?.aspects),
    calculated_at: raw.calculated_at,
  } as any;

  const tabs = [
    { id: 'overview', label: 'Преглед', icon: Sparkles },
    { id: 'planets', label: 'Планети', icon: Star },
    { id: 'houses', label: 'Къщи', icon: Sun },
    { id: 'aspects', label: 'Аспекти', icon: Moon },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Sun Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{chartData.sun.emoji || '☉'}</div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50">Слънце</h3>
              <p className="text-sm text-zinc-400">{String(chartData.sun.sign || '')}</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.sun.degree).toFixed(2)}°</p>
          <p className="text-sm text-zinc-500 mt-1">Къща {safeNum(chartData.sun.house)}</p>
        </div>

        {/* Moon Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{chartData.moon.emoji || '☽'}</div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50">Луна</h3>
              <p className="text-sm text-zinc-400">{String(chartData.moon.sign || '')}</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.moon.degree).toFixed(2)}°</p>
          <p className="text-sm text-zinc-500 mt-1">Къща {safeNum(chartData.moon.house)}</p>
        </div>

        {/* Rising Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{chartData.rising.emoji || '↗️'}</div>
            <div>
              <h3 className="text-lg font-bold text-zinc-50">Асцендент</h3>
              <p className="text-sm text-zinc-400">{String(chartData.rising.sign || '')}</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-accent-400">{safeNum(chartData.rising.degree).toFixed(2)}°</p>
          <p className="text-sm text-zinc-500 mt-1">Асцендент</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="glass-card p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && interpretation && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Общ преглед</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {interpretation.overview}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-bold text-zinc-50">Слънце</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {interpretation.sun_interpretation}
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-zinc-50">Луна</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {interpretation.moon_interpretation}
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-zinc-50">Асцендент</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {interpretation.rising_interpretation}
                </p>
              </div>
            </div>

            {interpretation.major_aspects && (
              <div>
                <h3 className="text-xl font-bold text-zinc-50 mb-4">Основни аспекти</h3>
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {interpretation.major_aspects}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'planets' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Планети и позиции</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(data).map(([key, value]: [string, any]) => {
                if (key === 'houses' || key === 'aspects' || key === 'calculated_at' || key === 'rising') {
                  return null;
                }
                return (
                  <div key={key} className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg">
                    <div className="text-3xl">{value.emoji || ''}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-50">{String(value.name || '')}</h3>
                        {value.retrograde && (
                          <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                            ℞
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400">
                        {String(value.sign || '')} {safeNum(value.degree).toFixed(2)}° • къща {safeNum(value.house)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'houses' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Астрологични къщи</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.houses.map((house: any, i: number) => (
                <div key={house.number || i} className="p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-zinc-50">Къща {safeNum(house.number)}</h3>
                    <span className="text-accent-400">{safeNum(house.degree).toFixed(2)}°</span>
                  </div>
                  <p className="text-sm text-zinc-400">{String(house.sign || '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'aspects' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-50 mb-6">Планетарни аспекти</h2>
            <div className="space-y-3">
              {data.aspects.slice(0, 15).map((aspect: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getAspectSymbol(aspect.type)}</span>
                    <div>
                      <p className="text-zinc-200 font-medium">
                        {aspect.planet1} {aspect.type} {aspect.planet2}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {safeNum(aspect.angle).toFixed(2)}° • орб: {safeNum(aspect.orb).toFixed(2)}°
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAspectColor(aspect.type)}`}>
                    {aspect.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getAspectSymbol(type: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌',
    opposition: '☍',
    trine: '△',
    square: '□',
    sextile: '✶',
  };
  return symbols[type.toLowerCase()] || '•';
}

function getAspectColor(type: string): string {
  const colors: Record<string, string> = {
    conjunction: 'bg-purple-500/20 text-purple-400',
    opposition: 'bg-red-500/20 text-red-400',
    trine: 'bg-green-500/20 text-green-400',
    square: 'bg-orange-500/20 text-orange-400',
    sextile: 'bg-blue-500/20 text-blue-400',
  };
  return colors[type.toLowerCase()] || 'bg-zinc-500/20 text-zinc-400';
}
