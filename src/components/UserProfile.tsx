import React, { useState, useEffect } from 'react';
import { Ticket, UserAccount } from '../types';
import { theaterDb } from '../db/theaterDatabase';
import { 
  User, Phone, Ticket as TicketIcon, Calendar, Clock, MapPin, 
  Copy, Check, QrCode, Edit3, Save, ShieldCheck, LogOut, ArrowRight, LogIn 
} from 'lucide-react';

interface UserProfileProps {
  onBrowsePlays: () => void;
  onNavigateToInspector?: () => void;
  onOpenAuth?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  onBrowsePlays, 
  onNavigateToInspector, 
  onOpenAuth 
}) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(theaterDb.getCurrentUser());
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'valid' | 'used'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');

  const loadUserData = () => {
    const user = theaterDb.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      const userTickets = theaterDb.getUserTickets(user.phone);
      setTickets(userTickets);
    } else {
      setTickets([]);
    }
  };

  useEffect(() => {
    loadUserData();
    const handleDbUpdate = () => loadUserData();
    window.addEventListener('theaterticket_db_updated', handleDbUpdate);
    return () => window.removeEventListener('theaterticket_db_updated', handleDbUpdate);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editName.trim() || !editPhone.trim()) return;

    const updated: UserAccount = {
      ...currentUser,
      name: editName.trim(),
      phone: editPhone.trim(),
    };
    theaterDb.setCurrentUser(updated);
    setCurrentUser(updated);
    setIsEditingProfile(false);
    loadUserData();
  };

  const handleLogout = () => {
    theaterDb.logout();
    loadUserData();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTickets = tickets.filter((t) => {
    if (activeFilter === 'valid') return t.status === 'valid';
    if (activeFilter === 'used') return t.status === 'used';
    return true;
  });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          شما وارد حساب کاربری نشده‌اید
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          برای مشاهده بلیط‌های خریداری شده، صدور کارت ورود و دسترسی به اطلاعات کاربری، لطفاً وارد شوید.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all inline-flex items-center gap-2 min-h-[44px]"
        >
          <LogIn className="w-4 h-4" />
          <span>ورود به حساب کاربری</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md shrink-0 ${
              currentUser.role === 'seller' 
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20' 
                : 'bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/20'
            }`}>
              {currentUser.role === 'seller' ? <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" /> : (currentUser.name ? currentUser.name[0] : 'ک')}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </h1>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                  currentUser.role === 'seller'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {currentUser.role === 'seller' ? '🛡️ مسئول سالن و گیت' : '👤 کاربر خریدار'}
                </span>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="p-1 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                  title="ویرایش مشخصات"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1 tabular-nums tracking-wide" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentUser.phone}</span>
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="tabular-nums font-semibold">{tickets.length.toLocaleString('fa-IR')} بلیط ثبت شده</span>
              </div>
            </div>
          </div>

          {/* Account Actions: Logout */}
          <div className="w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>
          </div>

        </div>

        {/* Edit Profile Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                نام و نام خانوادگی:
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                شماره موبایل:
              </label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                required
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm min-h-[38px]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>ذخیره تغییرات</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl min-h-[38px]"
              >
                انصراف
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Seller Gatekeeper Access Banner (Hidden on mobile/responsive as requested) */}
      {currentUser.role === 'seller' && onNavigateToInspector && (
        <div className="hidden md:flex bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 p-5 items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                پنل مدیریت و استعلام گیت ورودی
              </h3>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              دسترسی به استعلام آنی بلیط، تایید ورود تماشاگران و آمار سالن در مانیتور دسکتاپ.
            </p>
          </div>

          <button
            onClick={onNavigateToInspector}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0 transition-all min-h-[40px]"
          >
            <span>ورود به پنل گیت</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

      {/* User Tickets Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TicketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>بلیط‌های خریداری شده</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              جهت ورود به تماشاخانه، بارکد یا کد پیگیری بلیط را به متصدی گیت نشان دهید.
            </p>
          </div>

          {/* Ticket status filter tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              همه ({tickets.length})
            </button>
            <button
              onClick={() => setActiveFilter('valid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'valid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              معتبر ({tickets.filter((t) => t.status === 'valid').length})
            </button>
            <button
              onClick={() => setActiveFilter('used')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeFilter === 'used'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              استفاده شده ({tickets.filter((t) => t.status === 'used').length})
            </button>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <TicketIcon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                بلیطی در این وضعیت ثبت نشده است.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                برای رزرو صندلی نمایش‌های در حال اجرا، به صفحه نمایش‌ها مراجعه کنید.
              </p>
            </div>
            <button
              onClick={onBrowsePlays}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all inline-flex items-center gap-1.5 min-h-[40px]"
            >
              <span>مشاهده و خرید بلیط تئاتر</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const isValid = ticket.status === 'valid';

              return (
                <div
                  key={ticket.id}
                  className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-xs overflow-hidden transition-all ${
                    isValid
                      ? 'border-blue-200/80 dark:border-slate-800 hover:border-blue-400'
                      : 'border-slate-200 dark:border-slate-800 opacity-85'
                  }`}
                >
                  <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-5 md:items-center justify-between">
                    
                    {/* Play info with poster */}
                    <div className="flex items-start gap-3.5 sm:gap-4 min-w-0 flex-1">
                      <img
                        src={ticket.posterUrl}
                        alt={ticket.playTitle}
                        className="w-20 h-28 sm:w-22 sm:h-30 object-cover rounded-2xl shadow-md shrink-0 bg-slate-800"
                      />

                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white break-words">
                            {ticket.playTitle}
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ${
                            isValid
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {isValid ? 'معتبر جهت ورود' : 'استفاده شده'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{ticket.venueName} - {ticket.hallName}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            <span>{ticket.sessionDate}</span>
                          </span>
                          <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{ticket.sessionTime}</span>
                          </span>
                        </div>

                        {/* Seat Tags */}
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          <span className="text-[11px] text-slate-400">صندلی:</span>
                          {ticket.seats.map((seat, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold tabular-nums"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* QR Code & Tracking ID (Boarding pass strip) */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-r border-slate-100 dark:border-slate-800 md:pr-5 shrink-0">
                      
                      <div className="text-right space-y-1">
                        <span className="text-[10px] text-slate-400 block">کد رهگیری بلیط:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-black tracking-wide text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                            {ticket.id}
                          </span>
                          <button
                            onClick={() => handleCopyCode(ticket.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors"
                            title="کپی کد"
                          >
                            {copiedId === ticket.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold tabular-nums block">
                          {ticket.totalPrice.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      {/* Barcode / QR Box */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-1 shrink-0 shadow-2xs">
                        <QrCode className="w-8 h-8 sm:w-9 sm:h-9 text-slate-800 dark:text-slate-200" />
                        <span className="text-[8px] text-slate-500 font-bold tracking-tight">QR-PASS</span>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
