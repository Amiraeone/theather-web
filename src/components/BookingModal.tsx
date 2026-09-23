import React, { useState } from 'react';
import { Play, PlaySession, Ticket } from '../types';
import { SeatMap, SelectedSeatInfo } from './SeatMap';
import { theaterDb } from '../db/theaterDatabase';
import { X, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, ChevronLeft, CreditCard, ShieldCheck, AlertCircle, User } from 'lucide-react';

interface BookingModalProps {
  play: Play;
  initialSessionId?: string;
  onClose: () => void;
  onBookingSuccess: (ticket: Ticket) => void;
  onGoToProfile?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  play,
  initialSessionId,
  onClose,
  onBookingSuccess,
  onGoToProfile,
}) => {
  const currentUser = theaterDb.getCurrentUser();
  const [selectedSession, setSelectedSession] = useState<PlaySession>(() => {
    if (initialSessionId) {
      const found = play.sessions.find((s) => s.id === initialSessionId);
      if (found) return found;
    }
    return play.sessions[0];
  });

  const [step, setStep] = useState<'seats' | 'buyer' | 'success'>('seats');
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatInfo[]>([]);
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(currentUser?.phone || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [issuedTicket, setIssuedTicket] = useState<Ticket | null>(null);

  const handleToggleSeat = (seat: SelectedSeatInfo) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= 6) {
          setErrorMessage('حداکثر می‌توانید ۶ صندلی در هر تراکنش انتخاب نمایید.');
          return prev;
        }
        setErrorMessage('');
        return [...prev, seat];
      }
    });
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceedToBuyer = () => {
    if (selectedSeats.length === 0) {
      setErrorMessage('لطفاً حداقل یک صندلی از نقشه سالن انتخاب نمایید.');
      return;
    }
    setErrorMessage('');
    setStep('buyer');
  };

  const handleConfirmBooking = () => {
    if (!buyerName.trim()) {
      setErrorMessage('لطفاً نام و نام خانوادگی خریدار را وارد نمایید.');
      return;
    }
    if (!buyerPhone.trim() || buyerPhone.trim().length < 10) {
      setErrorMessage('لطفاً شماره موبایل معتبر (مثال: 09123456789) وارد نمایید.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      try {
        // Save user info if logged in or update contact info
        if (currentUser) {
          theaterDb.setCurrentUser({
            ...currentUser,
            name: buyerName.trim(),
            phone: buyerPhone.trim(),
          });
        }

        // Create ticket in database
        const ticket = theaterDb.createTicket({
          play,
          session: selectedSession,
          seats: selectedSeats,
          buyerName: buyerName.trim(),
          buyerPhone: buyerPhone.trim(),
        });

        setIssuedTicket(ticket);
        setIsProcessing(false);
        setStep('success');
        onBookingSuccess(ticket);
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
        setErrorMessage('خطایی در ثبت رزرو رخ داد. لطفاً دوباره تلاش کنید.');
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mb-0.5">
              {step === 'seats' ? 'مرحله اول: انتخاب سانس و صندلی' : step === 'buyer' ? 'مرحله دوم: اطلاعات خریدار و پرداخت' : 'رزرو با موفقیت انجام شد'}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-sm">
              رزرو بلیط: {play.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'seats' && (
            <>
              {/* Session Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2.5">
                  انتخاب تاریخ و سانس اجرا:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {play.sessions.map((sess) => {
                    const isSelected = sess.id === selectedSession.id;
                    return (
                      <button
                        key={sess.id}
                        type="button"
                        onClick={() => {
                          setSelectedSession(sess);
                          setSelectedSeats([]); // reset seats when switching session
                        }}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{sess.dateStr}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            ساعت {sess.timeStr}
                          </span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            {sess.hallName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Auditorium Map */}
              <div className="pt-2">
                <SeatMap
                  play={play}
                  session={selectedSession}
                  selectedSeats={selectedSeats}
                  onToggleSeat={handleToggleSeat}
                />
              </div>

              {/* Selected Seats summary */}
              {selectedSeats.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
                  <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    صندلی‌های انتخابی ({selectedSeats.length} صندلی):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSeats.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-blue-200 dark:border-slate-700 font-medium"
                      >
                        {s.label} ({s.price.toLocaleString('fa-IR')} ت)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'buyer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>نمایش:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{play.title}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>زمان:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedSession.dateStr} - ساعت {selectedSession.timeStr}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>سالن:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{play.venueName} ({selectedSession.hallName})</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>صندلی‌ها:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {selectedSeats.map((s) => s.label).join('، ')}
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    نام و نام خانوادگی خریدار: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="مثال: امیر صادقی"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    شماره موبایل خریدار (جهت دریافت کد بلیط): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-right"
                  />
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    کد پیگیری بلیط برای این شماره صادر و در پروفایل شما ثبت خواهد شد.
                  </p>
                </div>
              </div>

              {/* Payment simulation info */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>درگاه پرداخت امن بانکی (شبیه‌سازی شده) - صدور آنی با بارکد رسمی گیت ورودی</span>
              </div>
            </div>
          )}

          {step === 'success' && issuedTicket && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  خرید بلیط شما با موفقیت انجام شد!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  کد پیگیری اختصاصی بلیط شما صادر گردید و در دیتابیس ثبت شد.
                </p>
              </div>

              {/* Generated Ticket Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-200 dark:border-slate-700 text-right space-y-3">
                <div className="flex justify-between items-center border-b border-blue-100 dark:border-slate-700/80 pb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">کد پیگیری ورود:</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums tracking-wide">
                    {issuedTicket.id}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">نمایش:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{issuedTicket.playTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاریخ و ساعت:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{issuedTicket.sessionDate} ({issuedTicket.sessionTime})</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[11px]">صندلی‌ها:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-400">
                      {issuedTicket.seats.join(' - ')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                این بلیط در بخش <strong className="text-blue-600 dark:text-blue-400">بلیط‌های من</strong> قرار گرفته است و با همین کد در پنل بلیط‌فروش قابل استعلام و ورود است.
              </p>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          {step === 'seats' && (
            <>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  مبلغ نهایی ({selectedSeats.length} صندلی):
                </span>
                <span className="text-base sm:text-lg font-black text-blue-700 dark:text-blue-400 tabular-nums">
                  {totalPrice.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={handleProceedToBuyer}
                  disabled={selectedSeats.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  <span>ادامه و ثبت خرید</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 'buyer' && (
            <>
              <button
                type="button"
                onClick={() => setStep('seats')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 min-h-[44px]"
              >
                <ChevronRight className="w-4 h-4" />
                <span>بازگشت به صندلی‌ها</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 min-h-[44px]"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isProcessing ? 'در حال ثبت و صدور...' : `پرداخت و دریافت بلیط (${totalPrice.toLocaleString('fa-IR')} ت)`}</span>
              </button>
            </>
          )}

          {step === 'success' && (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onGoToProfile) {
                    onGoToProfile();
                  }
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <User className="w-4 h-4" />
                <span>مشاهده در پروفایل من (بلیط‌های خریداری شده)</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors min-h-[44px]"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
