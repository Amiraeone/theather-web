import React from 'react';
import { Ticket as TicketIcon, User, Sun, Moon, LogIn, LogOut, Shield } from 'lucide-react';
import { ThemeMode, UserAccount } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'profile' | 'inspector';
  setCurrentTab: (tab: 'home' | 'profile' | 'inspector') => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  userTicketCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  theme,
  toggleTheme,
  userTicketCount,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-blue-100/60 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Right Zone: Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-right focus:outline-none group"
            title="صفحه اصلی تئاتر تیکت"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                تئاتر تیکت
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
              </span>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hidden sm:block">
                سامانه رزرو و استعلام بلیط تئاتر
              </p>
            </div>
          </button>
        </div>

        {/* Left Zone: Theme Switcher & Authentication / User Capsule */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            title={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
            aria-label="تغییر تم"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* User State */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {/* Profile Capsule (Desktop & Tablet) */}
              <button
                onClick={() => setCurrentTab('profile')}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all ${
                  currentTab === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
                title="مشاهده پروفایل و بلیط‌ها"
              >
                <div className="relative shrink-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs text-white ${
                    currentUser.role === 'seller' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.role === 'seller' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    {userTicketCount > 0 && currentUser.role === 'customer' && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white tabular-nums">
                        {userTicketCount.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                    {currentUser.role === 'seller' ? 'متصدی گیت' : 'کاربر خریدار'}
                  </span>
                </div>
              </button>

              {/* Quick Logout Button */}
              <button
                onClick={onLogout}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center transition-colors"
                title="خروج از حساب"
                aria-label="خروج از حساب"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all min-h-[40px]"
            >
              <LogIn className="w-4 h-4" />
              <span>ورود / ثبت‌نام</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
