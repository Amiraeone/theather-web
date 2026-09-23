import React, { useState, useEffect } from 'react';
import { Play, PlaySession, Ticket, ThemeMode, UserAccount } from './types';
import { theaterDb } from './db/theaterDatabase';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PlayCard } from './components/PlayCard';
import { PlayDetailPage } from './components/PlayDetailPage';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { TicketInspector } from './components/TicketInspector';
import { TheaterExplorerHeader } from './components/TheaterExplorerHeader';
import { Check, ShieldCheck } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theaterticket_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [currentTab, setCurrentTab] = useState<'home' | 'profile' | 'inspector'>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(theaterDb.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [plays, setPlays] = useState<Play[]>([]);
  const [selectedPlayDetail, setSelectedPlayDetail] = useState<Play | null>(null);
  const [selectedPlayForBooking, setSelectedPlayForBooking] = useState<Play | null>(null);
  const [selectedSessionIdForBooking, setSelectedSessionIdForBooking] = useState<string | undefined>(undefined);
  
  const [userTicketCount, setUserTicketCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'duration'>('popular');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme class with documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theaterticket_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshData = () => {
    const loadedPlays = theaterDb.getPlays();
    setPlays(loadedPlays);

    const user = theaterDb.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const tickets = theaterDb.getUserTickets(user.phone);
      setUserTicketCount(tickets.length);
    } else {
      setUserTicketCount(0);
    }
  };

  useEffect(() => {
    refreshData();
    const handleDbUpdate = () => refreshData();
    window.addEventListener('theaterticket_db_updated', handleDbUpdate);
    return () => window.removeEventListener('theaterticket_db_updated', handleDbUpdate);
  }, []);

  const handleBookingSuccess = (newTicket: Ticket) => {
    refreshData();
    showToast(`بلیط شما با کد ${newTicket.id} با موفقیت صادر شد!`);
  };

  const handleLogout = () => {
    theaterDb.logout();
    refreshData();
    showToast('با موفقیت از حساب کاربری خارج شدید.');
  };

  const handleAuthSuccess = (user: UserAccount) => {
    refreshData();
    showToast(`خوش آمدید، ${user.name} (${user.role === 'seller' ? 'متصدی گیت' : 'کاربر خریدار'})`);
  };

  // Filter and sort plays
  const filteredPlays = plays
    .filter((play) => {
      const matchesSearch =
        play.title.includes(searchQuery) ||
        play.director.includes(searchQuery) ||
        play.venueName.includes(searchQuery) ||
        play.hallName.includes(searchQuery) ||
        play.cast.some((c) => c.name.includes(searchQuery));

      const matchesGenre =
        selectedGenre === 'all' ||
        play.genre.includes(selectedGenre);

      const matchesVenue =
        selectedVenue === 'all' ||
        play.venueName.includes(selectedVenue) ||
        play.hallName.includes(selectedVenue);

      const matchesDay =
        selectedDay === 'all' ||
        (selectedDay === 'today' && play.sessions.some((s) => s.dateStr.includes('چهارشنبه') || s.dateIso.includes('09-24'))) ||
        (selectedDay === 'tomorrow' && play.sessions.some((s) => s.dateStr.includes('پنج‌شنبه') || s.dateIso.includes('09-25'))) ||
        (selectedDay === 'weekend' && play.sessions.some((s) => s.dateStr.includes('جمعه') || s.dateIso.includes('09-26')));

      return matchesSearch && matchesGenre && matchesVenue && matchesDay;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
      if (sortBy === 'duration') return b.durationMinutes - a.durationMinutes;
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-blue-600 text-white shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedPlayDetail(null);
          setCurrentTab(tab);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
        userTicketCount={userTicketCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* Dedicated Play Detail Page (When clicked on poster/card) */}
        {selectedPlayDetail ? (
          <PlayDetailPage
            play={selectedPlayDetail}
            onBack={() => setSelectedPlayDetail(null)}
            onOpenBookingModal={(p, session) => {
              setSelectedPlayForBooking(p);
              setSelectedSessionIdForBooking(session?.id);
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <div className="space-y-6 sm:space-y-8 pb-10">
                
                {/* CinemaTicket & Tiwall Inspired Explorer Header with Wrap-responsive Filters */}
                <TheaterExplorerHeader
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedGenre={selectedGenre}
                  setSelectedGenre={setSelectedGenre}
                  selectedVenue={selectedVenue}
                  setSelectedVenue={setSelectedVenue}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  totalCount={filteredPlays.length}
                />

                {/* Plays Grid */}
                <section id="plays-grid-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {filteredPlays.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        نمایشی با فیلترهای انتخابی شما پیدا نشد.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedGenre('all');
                          setSelectedVenue('all');
                          setSelectedDay('all');
                        }}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                      >
                        حذف فیلترها و مشاهده همه نمایش‌ها
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlays.map((play) => (
                        <PlayCard
                          key={play.id}
                          play={play}
                          onSelectPlay={(p) => {
                            setSelectedPlayDetail(p);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          onQuickBook={(p) => {
                            setSelectedPlayForBooking(p);
                            setSelectedSessionIdForBooking(p.sessions[0]?.id);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Trust and Venue Info Section */}
                <section id="trust-features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                  <div className="bg-blue-600 dark:bg-blue-900/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-600/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">انتخاب آنلاین صندلی</h3>
                        <p className="text-xs text-blue-100">
                          مشاهده نقشه واقعی سالن تئاتر شهر و ایرانشهر و انتخاب بهترین زاویه دید صحنه
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">صدور آنی و کد پیگیری یکتا</h3>
                        <p className="text-xs text-blue-100">
                          دریافت آنی بلیط دیجیتال همراه با بارکد رسمی و امکان استعلام در گیت ورودی سالن
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white">پنل اختصاصی مسئول گیت</h3>
                        <p className="text-xs text-blue-100">
                          امکان استعلام آنلاین، اسکن بارکد بلیط و ابطال هوشمند جهت جلوگیری از ورود تکراری
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {currentTab === 'profile' && (
              <UserProfile
                onBrowsePlays={() => setCurrentTab('home')}
                onNavigateToInspector={() => setCurrentTab('inspector')}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {currentTab === 'inspector' && (
              <TicketInspector />
            )}
          </>
        )}

      </main>

      {/* Footer - Reduced height by half for both mobile and desktop */}
      <footer className="mt-2 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xs py-1.5 pb-16 sm:pb-1.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-right">
          
          {/* Copyright & Info in a super-slim single line */}
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-800 dark:text-slate-200">تئاتر تیکت © ۱۴۰۵</span>
            <span>·</span>
            <span>سامانه رزرو آنلاین و استعلام بلیط تئاتر</span>
          </div>

          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">
            <span>تئاتر شهر</span>
            <span>·</span>
            <span>تماشاخانه ایرانشهر</span>
            <span>·</span>
            <span>پردیس تئاتر شهرزاد</span>
          </div>

        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedPlayDetail(null);
          setCurrentTab(tab);
        }}
        userTicketCount={userTicketCount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Auth Modal (Login / Register with 2 demo users) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Booking / Seat Selection Modal */}
      {selectedPlayForBooking && (
        <BookingModal
          play={selectedPlayForBooking}
          initialSessionId={selectedSessionIdForBooking}
          onClose={() => setSelectedPlayForBooking(null)}
          onBookingSuccess={handleBookingSuccess}
          onGoToProfile={() => {
            setSelectedPlayForBooking(null);
            setSelectedPlayDetail(null);
            setCurrentTab('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

    </div>
  );
}
