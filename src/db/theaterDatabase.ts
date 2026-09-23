import { Play, PlaySession, Ticket, UserProfileData, UserAccount, UserRole } from '../types';

import hamletPoster from '../assets/images/theater_poster_hamlet_1790145339240.jpg';
import rhinoPoster from '../assets/images/theater_poster_rhino_1790145354794.jpg';
import seagullPoster from '../assets/images/theater_poster_seagull_1790145396141.jpg';
import hallStageImg from '../assets/images/theater_stage_hall_1790145406802.jpg';
import actorMale from '../assets/images/actor_portrait_male_1790145445016.jpg';
import actorFemale from '../assets/images/actor_portrait_female_1790145455510.jpg';

// Initial Seed Data for Plays
const INITIAL_PLAYS: Play[] = [
  {
    id: 'hamlet-2026',
    title: 'تئاتر هملت در تهران',
    originalTitle: 'Hamlet (Adaptation)',
    director: 'رضا گوران',
    writer: 'ویلیام شکسپیر (ترجمه و اقتباس)',
    producer: 'موسسه فرهنگی تئاتر معاصر',
    genre: 'تراژدی مدرن / درام روان‌شناختی',
    durationMinutes: 105,
    ageRating: '۱۲+',
    venueName: 'تئاتر شهر',
    hallName: 'سالن اصلی',
    venueAddress: 'تهران، چهارراه ولیعصر، پارک دانشجو، تئاتر شهر',
    basePrice: 280000,
    vipPrice: 380000,
    posterUrl: hamletPoster,
    stageImageUrl: hallStageImg,
    synopsis: 'روایتی مدرن و کوبنده از تراژدی هملت در فضایی مینی‌مالیستی با تمرکز بر تنهایی انسان معاصر، تردیدهای فلسفی و ساختار قدرت. تلفیق نورپردازی سایه‌روشن دراماتیک و موسیقی زنده با اجرای گروه بازیگران برجسته تئاتر ایران.',
    cast: [
      { name: 'نوید محمدزاده', role: 'هملت (شاهزاده دانمارک)', avatarUrl: actorMale },
      { name: 'پانته‌آ پناهی‌ها', role: 'گرترود (ملکه)', avatarUrl: actorFemale },
      { name: 'صابر ابر', role: 'هوراشیو (یار وفادار)', avatarUrl: actorMale },
      { name: 'ستاره پسیانی', role: 'اوفلیا', avatarUrl: actorFemale },
      { name: 'رضا بهبودی', role: 'کلادیوس (پادشاه)', avatarUrl: actorMale },
    ],
    sessions: [
      {
        id: 's-h-1',
        dateStr: 'چهارشنبه ۲ مهر',
        dateIso: '2026-09-24',
        timeStr: '۱۹:۰۰',
        hallName: 'سالن اصلی',
        seatsTaken: ['R1-S3', 'R1-S4', 'R2-S5', 'R3-S1', 'R4-S8'],
      },
      {
        id: 's-h-2',
        dateStr: 'پنج‌شنبه ۳ مهر',
        dateIso: '2026-09-25',
        timeStr: '۲۱:۱۵',
        hallName: 'سالن اصلی',
        seatsTaken: ['R2-S2', 'R2-S3', 'R3-S4', 'R5-S6'],
      },
      {
        id: 's-h-3',
        dateStr: 'جمعه ۴ مهر',
        dateIso: '2026-09-26',
        timeStr: '۲۰:۰۰',
        hallName: 'سالن اصلی',
        seatsTaken: ['R1-S1', 'R1-S2', 'R2-S8', 'R4-S3'],
      },
    ],
  },
  {
    id: 'rhinoceros-2026',
    title: 'کرگدن',
    originalTitle: 'Rhinoceros',
    director: 'فرهاد مهندس‌پور',
    writer: 'اوژن یونسکو (ترجمه جلال آل‌احمد)',
    producer: 'گروه تئاتر آوانگارد',
    genre: 'تئاتر ابزورد / کمدی سیاه',
    durationMinutes: 90,
    ageRating: '۱۴+',
    venueName: 'تماشاخانه ایرانشهر',
    hallName: 'سالن استاد سمندریان',
    venueAddress: 'تهران، خیابان طالقانی، خیابان شهید موسوی، پارک هنرمندان',
    basePrice: 250000,
    vipPrice: 340000,
    posterUrl: rhinoPoster,
    stageImageUrl: hallStageImg,
    synopsis: 'در یک شهر آرام ناگهان اهالی تک‌تک به کرگدن تبدیل می‌شوند. برانژه، تنها انسانی که در برابر همرنگ شدن با جماعت و دگردیسی مقاومت می‌کند، ناگزیر به رویارویی با هراس از تنهایی و حفظ هویت انسانی خویش است.',
    cast: [
      { name: 'هوتن شکیبا', role: 'برانژه (مرد مقاوم)', avatarUrl: actorMale },
      { name: 'سحر دولتشاهی', role: 'دِیزی', avatarUrl: actorFemale },
      { name: 'بهرام افشاری', role: 'ژان (دوست منطقی)', avatarUrl: actorMale },
      { name: 'الهام کردا', role: 'خانم بووُف', avatarUrl: actorFemale },
    ],
    sessions: [
      {
        id: 's-r-1',
        dateStr: 'پنج‌شنبه ۳ مهر',
        dateIso: '2026-09-25',
        timeStr: '۱۸:۳۰',
        hallName: 'سالن استاد سمندریان',
        seatsTaken: ['R1-S5', 'R1-S6', 'R3-S2'],
      },
      {
        id: 's-r-2',
        dateStr: 'جمعه ۴ مهر',
        dateIso: '2026-09-26',
        timeStr: '۲۰:۳۰',
        hallName: 'سالن استاد سمندریان',
        seatsTaken: ['R2-S4', 'R2-S5', 'R4-S1', 'R4-S2'],
      },
    ],
  },
  {
    id: 'seagull-2026',
    title: 'مرغ دریایی',
    originalTitle: 'The Seagull',
    director: 'همایون غنی‌زاده',
    writer: 'آنتون چخوف',
    producer: 'کمپانی تئاتر تجربه',
    genre: 'درام عاشقانه و هنری',
    durationMinutes: 110,
    ageRating: '۱۰+',
    venueName: 'پردیس تئاتر شهرزاد',
    hallName: 'سالن شماره یک',
    venueAddress: 'تهران، خیابان نوفل‌لوشاتو، تقاطع خیابان رازی',
    basePrice: 220000,
    vipPrice: 310000,
    posterUrl: seagullPoster,
    stageImageUrl: hallStageImg,
    synopsis: 'تقابل عشق‌های یک‌طرفه، آرزوهای بر باد رفته نویسندگان و بازیگران جوان و جستجوی فرم‌های نوین در هنر نمایش. یکی از ماندگارترین شاهکارهای تئاتر جهان در فضایی پر از طنز گزنده و تلخ.',
    cast: [
      { name: 'علی شادمان', role: 'کنستانتین ترپلف (نویسنده جوان)', avatarUrl: actorMale },
      { name: 'ترانه علیدوستی', role: 'نینا زارچنایا', avatarUrl: actorFemale },
      { name: 'فرهاد اصلانی', role: 'تریگورین (رمان‌نویس نامدار)', avatarUrl: actorMale },
      { name: 'شبنم مقدمی', role: 'آرکادینا (هنرپیشه کهنه‌کار)', avatarUrl: actorFemale },
    ],
    sessions: [
      {
        id: 's-s-1',
        dateStr: 'شنبه ۵ مهر',
        dateIso: '2026-09-27',
        timeStr: '۱۹:۴۵',
        hallName: 'سالن شماره یک',
        seatsTaken: ['R1-S2', 'R2-S3'],
      },
      {
        id: 's-s-2',
        dateStr: 'یکشنبه ۶ مهر',
        dateIso: '2026-09-28',
        timeStr: '۲۱:۰۰',
        hallName: 'سالن شماره یک',
        seatsTaken: ['R3-S5', 'R3-S6'],
      },
    ],
  },
];

// Initial Seed Tickets for immediate testing and inspection
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'TT-782140',
    playId: 'hamlet-2026',
    playTitle: 'تئاتر هملت در تهران',
    posterUrl: hamletPoster,
    venueName: 'تئاتر شهر',
    hallName: 'سالن اصلی',
    sessionDate: 'چهارشنبه ۲ مهر',
    sessionTime: '۱۹:۰۰',
    seats: ['ردیف ۱ - صندلی ۳ (VIP)', 'ردیف ۱ - صندلی ۴ (VIP)'],
    seatIds: ['R1-S3', 'R1-S4'],
    totalPrice: 760000,
    buyerName: 'امیر صادقی',
    buyerPhone: '09121112233',
    purchaseDate: '۱۴۰۵/۰۷/۰۱ - ۱۱:۳۰',
    status: 'valid',
  },
  {
    id: 'TT-409155',
    playId: 'hamlet-2026',
    playTitle: 'تئاتر هملت در تهران',
    posterUrl: hamletPoster,
    venueName: 'تئاتر شهر',
    hallName: 'سالن اصلی',
    sessionDate: 'چهارشنبه ۲ مهر',
    sessionTime: '۱۹:۰۰',
    seats: ['ردیف ۲ - صندلی ۵'],
    seatIds: ['R2-S5'],
    totalPrice: 280000,
    buyerName: 'سارا محمدی',
    buyerPhone: '09351112233',
    purchaseDate: '۱۴۰۵/۰۷/۰۱ - ۰۹:۱۵',
    status: 'used',
    validatedAt: '۱۴۰۵/۰۷/۰۲ - ۱۸:۴۵',
    inspectorName: 'مسئول گیت ورودی ۱',
  },
  {
    id: 'TT-613902',
    playId: 'rhinoceros-2026',
    playTitle: 'کرگدن',
    posterUrl: rhinoPoster,
    venueName: 'تماشاخانه ایرانشهر',
    hallName: 'سالن استاد سمندریان',
    sessionDate: 'پنج‌شنبه ۳ مهر',
    sessionTime: '۱۸:۳۰',
    seats: ['ردیف ۳ - صندلی ۲'],
    seatIds: ['R3-S2'],
    totalPrice: 250000,
    buyerName: 'امیر صادقی',
    buyerPhone: '09121112233',
    purchaseDate: '۱۴۰۵/۰۷/۰۱ - ۱۶:۲۰',
    status: 'valid',
  },
];

export const PREDEFINED_USERS: UserAccount[] = [
  {
    id: 'u-customer-1',
    name: 'امیر صادقی',
    phone: '09121112233',
    role: 'customer',
    email: 'amir.sadeghi@example.com',
    password: '123',
  },
  {
    id: 'u-seller-1',
    name: 'مریم رجبی (متصدی گیت و فروشنده)',
    phone: '09129998877',
    role: 'seller',
    email: 'maryam.seller@theaterticket.ir',
    password: '123',
  },
];

const STORAGE_KEYS = {
  PLAYS: 'theaterticket_plays_v1',
  TICKETS: 'theaterticket_tickets_v1',
  CURRENT_USER: 'theaterticket_auth_user_v3',
  USERS_LIST: 'theaterticket_users_list_v3',
};

// Safe LocalStorage helpers
function readStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    return JSON.parse(data) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function writeStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Dispatch local custom event for cross-component reactive sync
    window.dispatchEvent(new CustomEvent('theaterticket_db_updated', { detail: { key } }));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const theaterDb = {
  // Plays
  getPlays(): Play[] {
    const stored = readStorage<Play[]>(STORAGE_KEYS.PLAYS, []);
    if (!stored || stored.length === 0) {
      writeStorage(STORAGE_KEYS.PLAYS, INITIAL_PLAYS);
      return INITIAL_PLAYS;
    }
    return stored;
  },

  getPlayById(id: string): Play | undefined {
    const plays = this.getPlays();
    return plays.find((p) => p.id === id);
  },

  // Tickets
  getAllTickets(): Ticket[] {
    const stored = readStorage<Ticket[]>(STORAGE_KEYS.TICKETS, []);
    if (!stored || stored.length === 0) {
      writeStorage(STORAGE_KEYS.TICKETS, INITIAL_TICKETS);
      return INITIAL_TICKETS;
    }
    return stored;
  },

  getUserTickets(userPhone: string): Ticket[] {
    const tickets = this.getAllTickets();
    // Return tickets matching user phone, or return all test tickets if phone matches default
    return tickets.filter((t) => t.buyerPhone.replace(/\s+/g, '') === userPhone.replace(/\s+/g, ''));
  },

  getTicketsByPhone(phone: string): Ticket[] {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone) return [];
    const tickets = this.getAllTickets();
    return tickets.filter((t) => {
      const cleanBuyer = t.buyerPhone.replace(/[\s\-\(\)]/g, '');
      return cleanBuyer === cleanPhone || (cleanPhone.length >= 7 && cleanBuyer.endsWith(cleanPhone.slice(-7)));
    });
  },

  getTicketByCode(code: string): Ticket | undefined {
    const clean = code.trim().toUpperCase();
    const tickets = this.getAllTickets();
    return tickets.find(
      (t) =>
        t.id.toUpperCase() === clean ||
        t.id.replace('TT-', '').toUpperCase() === clean.replace('TT-', '')
    );
  },

  createTicket(params: {
    play: Play;
    session: PlaySession;
    seats: { id: string; label: string; price: number }[];
    buyerName: string;
    buyerPhone: string;
  }): Ticket {
    const tickets = this.getAllTickets();
    const plays = this.getPlays();

    // Generate unique Tracking Code TT-XXXXXX
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `TT-${randomNum}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(
      now.getDate()
    ).padStart(2, '0')} - ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const seatIds = params.seats.map((s) => s.id);
    const totalPrice = params.seats.reduce((sum, s) => sum + s.price, 0);

    const newTicket: Ticket = {
      id: ticketId,
      playId: params.play.id,
      playTitle: params.play.title,
      posterUrl: params.play.posterUrl,
      venueName: params.play.venueName,
      hallName: params.session.hallName,
      sessionDate: params.session.dateStr,
      sessionTime: params.session.timeStr,
      seats: params.seats.map((s) => s.label),
      seatIds,
      totalPrice,
      buyerName: params.buyerName.trim(),
      buyerPhone: params.buyerPhone.trim(),
      purchaseDate: formattedDate,
      status: 'valid',
    };

    // 1. Add ticket to ticket list
    tickets.unshift(newTicket);
    writeStorage(STORAGE_KEYS.TICKETS, tickets);

    // 2. Mark seats as taken in the play session
    const playIdx = plays.findIndex((p) => p.id === params.play.id);
    if (playIdx !== -1) {
      const sessIdx = plays[playIdx].sessions.findIndex((s) => s.id === params.session.id);
      if (sessIdx !== -1) {
        plays[playIdx].sessions[sessIdx].seatsTaken = Array.from(
          new Set([...plays[playIdx].sessions[sessIdx].seatsTaken, ...seatIds])
        );
        writeStorage(STORAGE_KEYS.PLAYS, plays);
      }
    }

    return newTicket;
  },

  validateTicket(
    code: string,
    inspectorName: string = 'مسئول گیت ورودی'
  ): { success: boolean; message: string; ticket?: Ticket } {
    const tickets = this.getAllTickets();
    const clean = code.trim().toUpperCase();
    const ticketIdx = tickets.findIndex(
      (t) =>
        t.id.toUpperCase() === clean ||
        t.id.replace('TT-', '').toUpperCase() === clean.replace('TT-', '')
    );

    if (ticketIdx === -1) {
      return { success: false, message: 'بلیطی با این کد پیگیری در سیستم یافت نشد.' };
    }

    const ticket = tickets[ticketIdx];

    if (ticket.status === 'used') {
      return {
        success: false,
        message: `این بلیط قبلاً در تاریخ ${ticket.validatedAt || 'ثبت شده'} توسط ${
          ticket.inspectorName || 'گیت ورودی'
        } استفاده و باطل شده است.`,
        ticket,
      };
    }

    if (ticket.status === 'cancelled') {
      return {
        success: false,
        message: 'این بلیط توسط خریدار یا پشتیبانی لغو شده است.',
        ticket,
      };
    }

    // Mark as used
    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(
      now.getDate()
    ).padStart(2, '0')} - ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    ticket.status = 'used';
    ticket.validatedAt = formattedDate;
    ticket.inspectorName = inspectorName;

    tickets[ticketIdx] = ticket;
    writeStorage(STORAGE_KEYS.TICKETS, tickets);

    return {
      success: true,
      message: 'بلیط با موفقیت استعلام و تایید شد. مجوز ورود صادر گردید.',
      ticket,
    };
  },

  // Users & Authentication
  getUsers(): UserAccount[] {
    const customUsers = readStorage<UserAccount[]>(STORAGE_KEYS.USERS_LIST, []);
    const merged = [...PREDEFINED_USERS];
    customUsers.forEach((cu) => {
      if (!merged.some((u) => u.phone === cu.phone)) {
        merged.push(cu);
      }
    });
    return merged;
  },

  getCurrentUser(): UserAccount | null {
    return readStorage<UserAccount | null>(STORAGE_KEYS.CURRENT_USER, PREDEFINED_USERS[0]);
  },

  setCurrentUser(user: UserAccount | null): void {
    writeStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  login(phone: string): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedPhone = phone.trim();
    const all = this.getUsers();
    const found = all.find((u) => u.phone === trimmedPhone || u.phone.endsWith(trimmedPhone.slice(-7)));
    if (!found) {
      return {
        success: false,
        error: 'کاربری با این شماره موبایل یافت نشد. لطفاً ثبت‌نام کنید یا از کاربران تستی استفاده نمایید.',
      };
    }
    this.setCurrentUser(found);
    return { success: true, user: found };
  },

  register(name: string, phone: string, role: UserRole): { success: boolean; user?: UserAccount; error?: string } {
    const trimmedPhone = phone.trim();
    const trimmedName = name.trim();
    if (!trimmedPhone || !trimmedName) {
      return { success: false, error: 'نام و شماره تماس الزامی هستند.' };
    }
    const all = this.getUsers();
    if (all.some((u) => u.phone === trimmedPhone)) {
      return { success: false, error: 'این شماره موبایل قبلاً ثبت شده است. لطفاً وارد شوید.' };
    }
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: trimmedName,
      phone: trimmedPhone,
      role,
      email: `${trimmedPhone}@theaterticket.ir`,
    };
    const customUsers = readStorage<UserAccount[]>(STORAGE_KEYS.USERS_LIST, []);
    customUsers.push(newUser);
    writeStorage(STORAGE_KEYS.USERS_LIST, customUsers);
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  logout(): void {
    this.setCurrentUser(null);
  },

  switchUser(userId: string): UserAccount | null {
    const all = this.getUsers();
    const found = all.find((u) => u.id === userId);
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    return null;
  },

  // Box office analytics
  getStats() {
    const tickets = this.getAllTickets();
    const plays = this.getPlays();

    let totalSoldTickets = 0;
    let totalRevenue = 0;
    let totalAdmitted = 0;

    tickets.forEach((t) => {
      totalSoldTickets += t.seats.length;
      totalRevenue += t.totalPrice;
      if (t.status === 'used') {
        totalAdmitted += t.seats.length;
      }
    });

    return {
      totalSoldTickets,
      totalRevenue,
      totalAdmitted,
      activePlaysCount: plays.length,
      allTicketsCount: tickets.length,
    };
  },
};
