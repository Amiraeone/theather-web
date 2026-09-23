import React from 'react';
import { Play, PlaySession } from '../types';
import { Check } from 'lucide-react';

export interface SelectedSeatInfo {
  id: string; // e.g. "R1-S4"
  label: string; // "ردیف ۱ - صندلی ۴ (VIP)"
  price: number;
}

interface SeatMapProps {
  play: Play;
  session: PlaySession;
  selectedSeats: SelectedSeatInfo[];
  onToggleSeat: (seat: SelectedSeatInfo) => void;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  play,
  session,
  selectedSeats,
  onToggleSeat,
}) => {
  // 6 rows, each having 8-10 seats
  const rows = [
    { rowNumber: 1, type: 'vip', seatCount: 8, price: play.vipPrice, label: 'ردیف ۱ (VIP)' },
    { rowNumber: 2, type: 'vip', seatCount: 8, price: play.vipPrice, label: 'ردیف ۲ (VIP)' },
    { rowNumber: 3, type: 'regular', seatCount: 10, price: play.basePrice, label: 'ردیف ۳ (همکف)' },
    { rowNumber: 4, type: 'regular', seatCount: 10, price: play.basePrice, label: 'ردیف ۴ (همکف)' },
    { rowNumber: 5, type: 'regular', seatCount: 10, price: play.basePrice, label: 'ردیف ۵ (همکف)' },
    { rowNumber: 6, type: 'regular', seatCount: 10, price: Math.round(play.basePrice * 0.9), label: 'ردیف ۶ (انتهای سالن)' },
  ];

  const isSeatTaken = (seatId: string) => {
    return session.seatsTaken.includes(seatId);
  };

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some((s) => s.id === seatId);
  };

  return (
    <div className="w-full select-none">
      {/* Stage Representation */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-4/5 max-w-md h-8 rounded-b-2xl bg-gradient-to-b from-blue-500/20 to-blue-600/10 dark:from-blue-600/30 dark:to-blue-900/10 border-t-2 border-b border-blue-500/50 flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,99,235,0.2)]">
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 tracking-wider">
            صحنه اجرای نمایش
          </span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          (جهت دید تماشاگران به سمت صحنه است)
        </p>
      </div>

      {/* Seat Grid - Touch scrollable container */}
      <div className="overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[420px] max-w-xl mx-auto flex flex-col gap-3.5">
          {rows.map((row) => (
            <div key={row.rowNumber} className="flex items-center justify-between gap-2">
              {/* Row Label (Right side in RTL) */}
              <div className="w-16 shrink-0 text-right">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  ردیف {row.rowNumber.toLocaleString('fa-IR')}
                </span>
                {row.type === 'vip' && (
                  <span className="block text-[9px] font-black text-amber-600 dark:text-amber-400">
                    VIP
                  </span>
                )}
              </div>

              {/* Seats in this row */}
              <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2">
                {Array.from({ length: row.seatCount }).map((_, idx) => {
                  const seatNumber = idx + 1;
                  const seatId = `R${row.rowNumber}-S${seatNumber}`;
                  const taken = isSeatTaken(seatId);
                  const selected = isSeatSelected(seatId);
                  const isVip = row.type === 'vip';

                  const seatInfo: SelectedSeatInfo = {
                    id: seatId,
                    label: `ردیف ${row.rowNumber.toLocaleString('fa-IR')} - صندلی ${seatNumber.toLocaleString('fa-IR')}${isVip ? ' (VIP)' : ''}`,
                    price: row.price,
                  };

                  let seatStyle = 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:scale-105';
                  if (taken) {
                    seatStyle = 'bg-slate-200 dark:bg-slate-800/60 border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
                  } else if (selected) {
                    seatStyle = 'bg-blue-600 text-white border-blue-600 scale-105 shadow-md shadow-blue-600/30';
                  } else if (isVip) {
                    seatStyle = 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 hover:border-amber-500';
                  }

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={taken}
                      onClick={() => onToggleSeat(seatInfo)}
                      className={`relative min-w-[34px] h-[34px] sm:min-w-[38px] sm:h-[38px] rounded-xl border text-xs font-bold transition-all flex items-center justify-center focus:outline-none ${seatStyle}`}
                      title={
                        taken
                          ? `ردیف ${row.rowNumber.toLocaleString('fa-IR')}، صندلی ${seatNumber.toLocaleString('fa-IR')} (رزرو شده)`
                          : `ردیف ${row.rowNumber.toLocaleString('fa-IR')}، صندلی ${seatNumber.toLocaleString('fa-IR')} - ${row.price.toLocaleString('fa-IR')} تومان`
                      }
                      aria-label={`صندلی شماره ${seatNumber.toLocaleString('fa-IR')}`}
                    >
                      {selected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span className="font-bold text-xs">{seatNumber.toLocaleString('fa-IR')}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Row Price (Left side in RTL for symmetry) */}
              <div className="w-16 shrink-0 text-left text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                {row.price.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">ت</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Legend */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700"></div>
          <span className="text-slate-600 dark:text-slate-300 font-medium">عادی (آزاد)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/60"></div>
          <span className="text-slate-600 dark:text-slate-300 font-medium">VIP (ویژه)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-blue-600 border border-blue-600"></div>
          <span className="text-slate-600 dark:text-slate-300 font-medium">انتخاب شما</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-800"></div>
          <span className="text-slate-400 dark:text-slate-500 font-medium">رزرو شده</span>
        </div>
      </div>
    </div>
  );
};
