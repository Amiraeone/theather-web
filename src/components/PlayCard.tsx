import React from 'react';
import { Play } from '../types';
import { Calendar, Clock, MapPin, Sparkles, ChevronLeft } from 'lucide-react';

interface PlayCardProps {
  play: Play;
  onSelectPlay: (play: Play) => void;
  onQuickBook: (play: Play) => void;
}

export const PlayCard: React.FC<PlayCardProps> = ({
  play,
  onSelectPlay,
  onQuickBook,
}) => {
  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Poster Image Container */}
      <div 
        onClick={() => onSelectPlay(play)}
        className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer bg-slate-950"
      >
        <img
          src={play.posterUrl}
          alt={`پوستر ${play.title}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

        {/* Floating Details Overlay on Bottom of Image */}
        <div className="absolute bottom-3 right-3 left-3 text-white">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-1">
            <span>{play.genre}</span>
            <span aria-hidden="true">·</span>
            <span>رده سنی {play.ageRating}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
            {play.title}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5 truncate">
            کارگردان: {play.director}
          </p>
        </div>

        {/* Hall tag in subtle corner */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium text-slate-200 border border-white/10">
          {play.hallName}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Zero-pill discipline */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {play.venueName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{play.durationMinutes.toLocaleString('fa-IR')} دقیقه</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {play.synopsis}
          </p>

          {/* Cast Preview */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 mb-3">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1.5">
              بازیگران اصلی:
            </p>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 flex-wrap">
              {play.cast.slice(0, 3).map((actor, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  <span>{actor.name}</span>
                  {idx < 2 && <span className="text-slate-400">،</span>}
                </span>
              ))}
              {play.cast.length > 3 && (
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  و...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & CTA Controls */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">شروع قیمت از</span>
            <span className="text-sm font-black text-blue-700 dark:text-blue-400 tabular-nums">
              {play.basePrice.toLocaleString('fa-IR')} <span className="text-[11px] font-normal">تومان</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectPlay(play)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-colors whitespace-nowrap min-h-[44px]"
            >
              مشاهده و عوامل
            </button>
            <button
              onClick={() => onQuickBook(play)}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow-md shadow-blue-600/20 transition-all flex items-center gap-1 whitespace-nowrap min-h-[44px]"
            >
              <span>رزرو بلیط</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
