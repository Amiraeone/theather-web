import React, { useState } from 'react';
import { Play, PlaySession } from '../types';
import { 
  ArrowRight, Calendar, Clock, MapPin, Users, Ticket, 
  Armchair, Share2, Sparkles, AlertCircle, ChevronLeft, 
  Info, Check, ShieldCheck 
} from 'lucide-react';

interface PlayDetailPageProps {
  play: Play;
  onBack: () => void;
  onOpenBookingModal: (play: Play, session?: PlaySession) => void;
}

export const PlayDetailPage: React.FC<PlayDetailPageProps> = ({
  play,
  onBack,
  onOpenBookingModal,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(play.sessions[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedSession = play.sessions.find((s) => s.id === selectedSessionId) || play.sessions[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 md:pb-16 text-slate-900 dark:text-slate-100 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>بازگشت به جدول همه نمایش‌ها</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'لینک کپی شد' : 'اشتراک‌گذاری'}</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Header */}
      <div className="relative w-full bg-slate-950 text-white overflow-hidden">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <img
            src={play.stageImageUrl}
            alt={play.title}
            className="w-full h-full object-cover opacity-35 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-end">
            
            {/* Play Poster */}
            <div className="w-44 sm:w-56 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/80 ring-2 ring-white/10 shrink-0 bg-slate-900">
              <img
                src={play.posterUrl}
                alt={play.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 text-center md:text-right space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/90 text-white backdrop-blur-xs">
                  {play.genre}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 backdrop-blur-xs">
                  رده سنی {play.ageRating}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 backdrop-blur-xs">
                  {play.durationMinutes} دقیقه
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {play.title}
                </h1>
                {play.originalTitle && (
                  <p className="text-sm font-mono text-slate-300 mt-1 opacity-80">
                    {play.originalTitle}
                  </p>
                )}
              </div>

              {/* Theater City / Hall Badge */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">{play.venueName}</span>
                  <span className="text-slate-400">({play.hallName})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{play.sessions.length} سانس فعال در این هفته</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => onOpenBookingModal(play, selectedSession)}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
                >
                  <Ticket className="w-4 h-4" />
                  <span>انتخاب صندلی و رزرو آنلاین</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column (8 cols): Synopsis, Cast, Credits */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Synopsis */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>درباره نمایش و خلاصه داستان</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base text-justify whitespace-pre-line">
              {play.synopsis}
            </p>
          </section>

          {/* Cast & Crew Grid */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>بازیگران و گروه اجرایی</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {play.cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center flex flex-col items-center group hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
                >
                  <img
                    src={actor.avatarUrl}
                    alt={actor.name}
                    className="w-16 h-16 rounded-full object-cover mb-2.5 ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {actor.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {actor.role}
                  </span>
                </div>
              ))}
            </div>

            {/* Crew credits */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-400">کارگردان:</span>
                <p className="font-bold text-slate-900 dark:text-white">{play.director}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400">نویسنده:</span>
                <p className="font-bold text-slate-900 dark:text-white">{play.writer}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-400">تهیه‌کننده:</span>
                <p className="font-bold text-slate-900 dark:text-white">{play.producer}</p>
              </div>
            </div>
          </section>

          {/* Venue & Stage Info */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>محل اجرا و تماشاخانه</span>
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white text-base">
                  {play.venueName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold">
                  {play.hallName}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                آدرس: {play.venueAddress}
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  سیستم صوتی استریو دالبی
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  تهویه مطبوع مرکزی
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                  دسترسی آسان از ایستگاه مترو تئاتر شهر
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Column (4 cols): Sessions & Booking Box */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs sticky top-32">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>انتخاب سانس اجرا</span>
            </h3>

            <div className="space-y-2.5 mb-5">
              {play.sessions.map((session) => {
                const isSelected = session.id === selectedSessionId;
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {session.dateStr}
                        </span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                          ساعت {session.timeStr}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
                        {session.hallName}
                      </span>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                        آماده رزرو
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Price Preview */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">شروع قیمت صندلی:</span>
                <span className="text-base font-black text-slate-900 dark:text-white tabular-nums">
                  {play.basePrice.toLocaleString('fa-IR')} تومان
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold">
                انتخاب مستقیم نقشه
              </span>
            </div>

            {/* Big CTA */}
            <button
              onClick={() => onOpenBookingModal(play, selectedSession)}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[46px]"
            >
              <Armchair className="w-4 h-4" />
              <span>ورود به نقشه سالن و خرید بلیط</span>
            </button>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>تضمین رسمی اصالت بلیط با کیوآرکد و بارکد اختصاصی</span>
            </p>

          </div>

        </div>

      </div>

      {/* Mobile Fixed Bottom CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block">قیمت صندلی از:</span>
          <span className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {play.basePrice.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        <button
          onClick={() => onOpenBookingModal(play, selectedSession)}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 min-h-[42px]"
        >
          <Armchair className="w-4 h-4" />
          <span>انتخاب صندلی و رزرو</span>
        </button>
      </div>

    </div>
  );
};
