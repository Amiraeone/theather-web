<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Play;
use App\Models\PlaySession;
use App\Models\CastMember;
use App\Models\Ticket;
use App\Models\TicketSeat;
use Illuminate\Support\Str;

class TheaterDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Hamlet Play
        $hamlet = Play::create([
            'title' => 'نمایش هملت',
            'original_title' => 'Hamlet by William Shakespeare',
            'slug' => 'hamlet-play',
            'director' => 'علی اصغر دشتی',
            'writer' => 'ویلیام شکسپیر',
            'producer' => 'کمپانی تئاتر ایران',
            'genre' => 'تراژدی و درام کلاسیک',
            'duration_minutes' => 110,
            'age_rating' => '۱۴+',
            'venue_name' => 'مجموعه تئاتر شهر تهران',
            'hall_name' => 'سالن اصلی',
            'venue_address' => 'چهارراه ولیعصر، تقاطع خیابان انقلاب و ولیعصر',
            'base_price' => 280000,
            'vip_price' => 420000,
            'poster_url' => 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop',
            'stage_image_url' => 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1200&auto=format&fit=crop',
            'synopsis' => 'بازخوانی مدرن از شاهکار شکسپیر، درامی پرکشش پیرامون شک، انتقام و کشمکش‌های روانی شاهزاده دانمارک در سرزمینی غرق در فساد و توطئه درباریان.',
            'is_active' => true,
        ]);

        // Hamlet Cast
        $hamletCast = [
            ['name' => 'نوید محمدزاده', 'role_title' => 'شاهزاده هملت', 'order' => 1],
            ['name' => 'پانته‌آ پناهی‌ها', 'role_title' => 'ملکه گرترود (مادر هملت)', 'order' => 2],
            ['name' => 'صابر ابر', 'role_title' => 'هوراشیو (یار وفادار)', 'order' => 3],
            ['name' => 'الهام کردا', 'role_title' => 'اوفلیا', 'order' => 4],
        ];
        foreach ($hamletCast as $cast) {
            CastMember::create([
                'play_id' => $hamlet->id,
                'name' => $cast['name'],
                'role_title' => $cast['role_title'],
                'display_order' => $cast['order'],
            ]);
        }

        // Hamlet Sessions
        $session1 = PlaySession::create([
            'play_id' => $hamlet->id,
            'hall_name' => 'سالن اصلی تئاتر شهر',
            'session_datetime' => now()->addDays(1)->setTime(19, 30),
            'doors_open_at' => now()->addDays(1)->setTime(19, 0),
            'is_booking_open' => true,
        ]);

        $session2 = PlaySession::create([
            'play_id' => $hamlet->id,
            'hall_name' => 'سالن اصلی تئاتر شهر',
            'session_datetime' => now()->addDays(2)->setTime(21, 15),
            'doors_open_at' => now()->addDays(2)->setTime(20, 45),
            'is_booking_open' => true,
        ]);

        // 2. Rhinoceros Play
        $rhino = Play::create([
            'title' => 'کرگدن',
            'original_title' => 'Rhinoceros by Eugène Ionesco',
            'slug' => 'rhinoceros-ionesco',
            'director' => 'فرهاد مهندسی‌پور',
            'writer' => 'اوژن یونسکو',
            'producer' => 'تماشاخانه ایرانشهر',
            'genre' => 'تئاتر ابزورد و کمدی سیاه',
            'duration_minutes' => 95,
            'age_rating' => '۱۲+',
            'venue_name' => 'تماشاخانه ایرانشهر',
            'hall_name' => 'سالن استاد سمندریان',
            'venue_address' => 'خیابان ایرانشهر، بوستان هنرمندان',
            'base_price' => 250000,
            'vip_price' => 380000,
            'poster_url' => 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop',
            'stage_image_url' => 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop',
            'synopsis' => 'در شهری آرام ناگهان اهالی تک تک به کرگدن تبدیل می‌شوند؛ روایتی عمیق و طنزآمیز از هم‌رنگی با جماعت و تلاش برانژه برای انسان ماندن.',
            'is_active' => true,
        ]);

        // Sample ticket for testing gate inspector
        $sampleTicket = Ticket::create([
            'tracking_code' => 'TT-782140',
            'qr_token' => hash('sha256', 'sample_test_token_hamlet_782140'),
            'play_id' => $hamlet->id,
            'play_session_id' => $session1->id,
            'buyer_name' => 'امیرحسین صادقی',
            'buyer_phone' => '09121234567',
            'total_amount' => 840000,
            'status' => Ticket::STATUS_VALID,
            'payment_ref_id' => 'BANK-99881122',
        ]);

        TicketSeat::create([
            'ticket_id' => $sampleTicket->id,
            'seat_code' => 'R1-S4',
            'row_number' => 1,
            'seat_number' => 4,
            'seat_type' => 'vip',
            'seat_label' => 'ردیف ۱ - صندلی ۴ (VIP)',
            'price' => 420000,
        ]);

        TicketSeat::create([
            'ticket_id' => $sampleTicket->id,
            'seat_code' => 'R1-S5',
            'row_number' => 1,
            'seat_number' => 5,
            'seat_type' => 'vip',
            'seat_label' => 'ردیف ۱ - صندلی ۵ (VIP)',
            'price' => 420000,
        ]);
    }
}
