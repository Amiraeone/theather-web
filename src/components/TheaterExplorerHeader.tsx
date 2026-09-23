import React from 'react';
import { Search, MapPin, Calendar, Sparkles, Filter, CheckCircle2, Ticket, QrCode, Armchair, X, Flame, ChevronDown } from 'lucide-react';

interface TheaterExplorerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedVenue: string;
  setSelectedVenue: (venue: string) => void;
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  sortBy: 'popular' | 'price_asc' | 'duration';
  setSortBy: (sort: 'popular' | 'price_asc' | 'duration') => void;
  totalCount: number;
}

export const TheaterExplorerHeader: React.FC<TheaterExplorerHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedVenue,
  setSelectedVenue,
  selectedDay,
  setSelectedDay,
  sortBy,
  setSortBy,
  totalCount,
}) => {
  const days = [
    { id: 'all', label: 'همه روزها', sub: 'تمام سانس‌ها' },
    { id: 'today', label: 'امروز', sub: '۴ فروردین' },
    { id: 'tomorrow', label: 'فردا', sub: '۵ فروردین' },
    { id: 'weekend', label: 'آخر هفته', sub: '۶ فروردین' },
  ];

  const genres = [
    { id: 'all', label: 'همه تئاترها' },
    { id: 'تراژدی', label: 'تراژدی و درام' },
    { id: 'ابزورد', label: 'کمدی و ابزورد' },
    { id: 'عاشقانه', label: 'عاشقانه و کلاسیک' },
  ];

  const quickSearchTags = ['در انتظار گودو', 'مکبث زار', 'سیزیف', 'تئاتر شهر', 'ایرانشهر'];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 space-y-4">
      
      {/* Top Banner Bar - CinemaTicket & Tiwall Style */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
        
        {/* Row 1: City & Theater Badge + Main Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* City Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/60">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>تهران</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>

              {/* Theater Scene Tag */}
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                جدول رسمی اجرای نمایش‌های تئاتر شهر و تماشاخانه ایرانشهر
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              خرید و رزرو آنلاین بلیط تئاتر
            </h1>
          </div>

          {/* Quick trust metrics */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 self-start sm:self-center">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <Armchair className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>انتخاب مستقیم صندلی</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>ورود با بارکد هوشمند</span>
            </span>
          </div>

        </div>

        {/* Row 2: Search Input & Venue Dropdown/Pills */}
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          
          {/* CinemaTicket-style Search Input with clear button */}
          <div className="lg:col-span-7 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام نمایش، کارگردان، بازیگر یا تماشاخانه..."
                className="w-full pr-10 pl-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[42px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title="پاک کردن جستجو"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick search tags (Tiwall style) - flex-wrap responsive without scroll */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[11px]">
              <span className="text-slate-400 shrink-0">پیشنهاد:</span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    searchQuery === tag
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Selector Pills (تئاتر شهر / ایرانشهر) - flex-wrap responsive */}
          <div className="lg:col-span-5 flex flex-wrap items-center gap-1.5 lg:justify-end">
            <span className="text-xs text-slate-400 shrink-0 ml-1">سالن:</span>
            {[
              { id: 'all', label: 'همه تماشاخانه‌ها' },
              { id: 'تئاتر شهر', label: 'تئاتر شهر (سالن اصلی)' },
              { id: 'ایرانشهر', label: 'ایرانشهر (سمندریان)' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVenue(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] ${
                  selectedVenue === v.id
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Row 3: CinemaTicket-Style Date Picker Strip (تقویم روزهای اجرا) - responsive wrap */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Day selection tabs (flex-wrap, no overflow scroll) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 shrink-0 ml-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold">تاریخ اجرا:</span>
            </div>

            {days.map((day) => {
              const isActive = selectedDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all min-h-[36px] ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <span>{day.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}>
                    {day.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tiwall-Style Genre/Category Pills (flex-wrap, no overflow scroll) */}
          <div className="flex flex-wrap items-center gap-1 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
            {genres.map((genre) => {
              const isActive = selectedGenre === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[34px] ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {genre.label}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Row 4: Results Counter & Sort Controls (CinemaTicket catalog toolbar) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 px-1">
        
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            اجراهای در حال نمایش
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 tabular-nums">
            {totalCount.toLocaleString('fa-IR')} نمایش
          </span>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[11px] ml-1">مرتب‌سازی:</span>
          {[
            { id: 'popular', label: 'محبوب‌ترین‌ها' },
            { id: 'price_asc', label: 'ارزان‌ترین' },
            { id: 'duration', label: 'مدت زمان' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setSortBy(s.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                sortBy === s.id
                  ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

      </div>

    </section>
  );
};
