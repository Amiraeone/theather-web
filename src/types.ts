export type ThemeMode = 'light' | 'dark';

export interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface PlaySession {
  id: string;
  dateStr: string; // e.g. "پنج‌شنبه ۴ آبان"
  dateIso: string;
  timeStr: string; // e.g. "۱۹:۳۰"
  seatsTaken: string[]; // array of seat IDs like "R2-S5"
  hallName: string;
}

export interface Play {
  id: string;
  title: string;
  originalTitle: string;
  director: string;
  writer: string;
  producer: string;
  genre: string;
  durationMinutes: number;
  ageRating: string;
  venueName: string;
  hallName: string;
  venueAddress: string;
  basePrice: number;
  vipPrice: number;
  posterUrl: string;
  stageImageUrl: string;
  synopsis: string;
  cast: CastMember[];
  sessions: PlaySession[];
}

export interface Seat {
  id: string; // "R1-S1"
  row: number;
  number: number;
  type: 'regular' | 'vip' | 'balcony';
  price: number;
  status: 'available' | 'occupied' | 'selected';
}

export interface Ticket {
  id: string; // e.g. "TT-934812"
  playId: string;
  playTitle: string;
  posterUrl: string;
  venueName: string;
  hallName: string;
  sessionDate: string;
  sessionTime: string;
  seats: string[]; // e.g. ["ردیف ۲ - صندلی ۴", "ردیف ۲ - صندلی ۵"]
  seatIds: string[];
  totalPrice: number;
  buyerName: string;
  buyerPhone: string;
  purchaseDate: string;
  status: 'valid' | 'used' | 'cancelled';
  validatedAt?: string;
  inspectorName?: string;
}

export type UserRole = 'customer' | 'seller';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  role: UserRole; // 'customer' (کاربر معمولی/خریدار) or 'seller' (فروشنده/متصدی گیت)
  email?: string;
  password?: string;
}

export type UserProfileData = UserAccount;
