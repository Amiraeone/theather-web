import React, { useState, useEffect } from 'react';
import { Ticket } from '../types';
import { theaterDb } from '../db/theaterDatabase';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

export const TicketInspector: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [inquiryResult, setInquiryResult] = useState<{
    status: 'idle' | 'success' | 'already_used' | 'not_found';
    message: string;
    ticket?: Ticket;
  }>({ status: 'idle', message: '' });

  const [stats, setStats] = useState(theaterDb.getStats());

  const refreshData = () => {
    setStats(theaterDb.getStats());
  };

  useEffect(() => {
    refreshData();
    const handleDbUpdate = () => refreshData();
    window.addEventListener('theaterticket_db_updated', handleDbUpdate);
    return () => window.removeEventListener('theaterticket_db_updated', handleDbUpdate);
  }, []);

  const handleSearch = (codeToSearch?: string) => {
    const code = (codeToSearch !== undefined ? codeToSearch : searchQuery).trim();
    if (!code) return;

    const ticket = theaterDb.getTicketByCode(code);

    if (!ticket) {
      setInquiryResult({
        status: 'not_found',
        message: `بلیط با کد پیگیری «${code}» در سامانه یافت نشد. لطفاً کد را مجدداً بررسی نمایید.`,
      });
      setActiveTicket(null);
      return;
    }

    setActiveTicket(ticket);
    if (ticket.status === 'valid') {
      setInquiryResult({
        status: 'success',
        message: 'بلیط معتبر و آماده ورود به سالن می‌باشد.',
        ticket,
      });
    } else if (ticket.status === 'used') {
      setInquiryResult({
        status: 'already_used',
        message: `هشدار: این بلیط قبلاً در تاریخ ${ticket.validatedAt || 'ثبت شده'} توسط ${ticket.inspectorName || 'گیت سالن'} پذیرش و باطل شده است!`,
        ticket,
      });
    } else {
      setInquiryResult({
        status: 'not_found',
        message: 'این بلیط لغو شده است و اجازه ورود ندارد.',
        ticket,
      });
    }
  };

  const handleAdmitTicket = () => {
    if (!activeTicket) return;

    const res = theaterDb.validateTicket(activeTicket.id, 'متصدی گیت ورودی');
    if (res.success && res.ticket) {
      setActiveTicket(res.ticket);
      setInquiryResult({
        status: 'success',
        message: 'ورود تماشاگر با موفقیت تایید و بلیط باطل گردید.',
        ticket: res.ticket,
      });
      refreshData();
    } else {
      setInquiryResult({
        status: 'already_used',
        message: res.message,
        ticket: res.ticket,
      });
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setActiveTicket(null);
    setInquiryResult({ status: 'idle', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              سامانه استعلام و کنترل گیت ورودی
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              احراز اصالت بلیط دیجیتال، پذیرش تماشاگران و جلوگیری از ورود تکراری به سالن
            </p>
          </div>
        </div>

        {/* Live Theater Stats Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">کل صندلی‌های فروخته شده</span>
            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums mt-0.5 block">
              {stats.totalSoldTickets} صندلی
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">پذیرش شده در سالن</span>
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 tabular-nums mt-0.5 block">
              {stats.totalAdmitted} نفر
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
            <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">منتظر ورود (فعال)</span>
            <span className="text-lg font-black text-blue-700 dark:text-blue-300 tabular-nums mt-0.5 block">
              {stats.totalSoldTickets - stats.totalAdmitted} نفر
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">مجموع فروش سالن</span>
            <span className="text-base font-black text-slate-900 dark:text-white tabular-nums truncate block mt-0.5">
              {stats.totalRevenue.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">تومان</span>
            </span>
          </div>
        </div>
      </div>

      {/* Inquiry Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>استعلام بارکد یا کد پیگیری بلیط</span>
          </h2>
          {activeTicket && (
            <button
              onClick={handleResetSearch}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعلام بلیط جدید</span>
            </button>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="کد پیگیری را وارد نمایید (مثال: TT-782140)"
              className="w-full pl-4 pr-10 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold tabular-nums tracking-wider text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all min-h-[44px]"
          >
            استعلام و احراز اصالت
          </button>
        </form>

        {/* Inquiry Result Display */}
        {inquiryResult.status !== 'idle' && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            {/* Status: Valid */}
            {inquiryResult.status === 'success' && activeTicket && (
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">{inquiryResult.message}</span>
                  </div>

                  <span className="self-start sm:self-auto px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white font-mono shadow-xs">
                    {activeTicket.id}
                  </span>
                </div>

                {/* Ticket Details breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-white/90 dark:bg-slate-900/90 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <div>
                    <span className="text-slate-400 block text-[11px]">عنوان نمایش:</span>
                    <strong className="text-slate-900 dark:text-white font-bold">{activeTicket.playTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">سانس و تاریخ:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{activeTicket.sessionDate} ({activeTicket.sessionTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مکان سالن:</span>
                    <span className="text-slate-800 dark:text-slate-200">{activeTicket.venueName} - {activeTicket.hallName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مشخصات خریدار:</span>
                    <span className="text-slate-800 dark:text-slate-200">{activeTicket.buyerName} <span dir="ltr" className="font-mono text-[11px]">({activeTicket.buyerPhone})</span></span>
                  </div>
                </div>

                {/* Seats and Admission Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">صندلی‌های اختصاص یافته:</span>
                    {activeTicket.seats.map((seat, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 text-xs font-bold tabular-nums"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>

                  {activeTicket.status === 'valid' && (
                    <button
                      onClick={handleAdmitTicket}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all min-h-[44px]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>تایید ورود تماشاگر و ابطال بلیط</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Status: Already Used */}
            {inquiryResult.status === 'already_used' && activeTicket && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 space-y-3">
                <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold">{inquiryResult.message}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/90 dark:bg-slate-900/90 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                  <div>
                    <span className="text-slate-400 block text-[11px]">نمایش:</span>
                    <strong className="text-slate-900 dark:text-white">{activeTicket.playTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">خریدار:</span>
                    <span className="text-slate-800 dark:text-slate-200">{activeTicket.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">زمان ابطال در گیت:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-bold tabular-nums">{activeTicket.validatedAt}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status: Not Found */}
            {inquiryResult.status === 'not_found' && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 text-rose-800 dark:text-rose-300 flex items-center gap-2 text-xs sm:text-sm">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{inquiryResult.message}</span>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
};
