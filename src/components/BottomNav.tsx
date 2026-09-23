import React from 'react';
import { Home, User, LogIn } from 'lucide-react';
import { UserAccount } from '../types';

interface BottomNavProps {
  currentTab: 'home' | 'profile' | 'inspector';
  setCurrentTab: (tab: 'home' | 'profile' | 'inspector') => void;
  userTicketCount: number;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  userTicketCount,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 px-4 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
      <div className="flex max-w-sm mx-auto items-center justify-around">
        
        {/* Tab 1: Home / Plays */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 transition-colors relative ${
            currentTab === 'home'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="نمایش‌ها"
        >
          <Home className={`w-5 h-5 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[11px] tracking-tight mt-1">نمایش‌ها</span>
          {currentTab === 'home' && (
            <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          )}
        </button>

        {/* Tab 2: Profile / My Tickets or Login */}
        {currentUser ? (
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 transition-colors relative ${
              currentTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-label="پروفایل کاربری"
          >
            <div className="relative">
              <User className={`w-5 h-5 transition-transform ${currentTab === 'profile' ? 'scale-110' : ''}`} />
              {userTicketCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white dark:ring-slate-950 tabular-nums">
                  {userTicketCount.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight mt-1">
              {currentUser.role === 'seller' ? 'حساب کاربری' : 'بلیط‌های من'}
            </span>
            {currentTab === 'profile' && (
              <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            )}
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex-1 flex flex-col items-center justify-center min-h-[46px] py-1 transition-colors text-blue-600 dark:text-blue-400 font-bold"
            aria-label="ورود به حساب"
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[11px] tracking-tight mt-1">ورود / ثبت‌نام</span>
          </button>
        )}

      </div>
    </div>
  );
};
