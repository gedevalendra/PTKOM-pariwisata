<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Destination;
use App\Models\DestinationImage;
use App\Models\SiteMetric;

class DestinationSeeder extends Seeder
{
    public function run(): void
    {
        // Kategori Pariwisata
        $catBahari = Category::firstOrCreate(['slug' => 'bahari'], [
            'name' => 'Bahari',
            'description' => 'Wisata pesona laut, terumbu karang, dan kepulauan eksotis.'
        ]);

        $catAlam = Category::firstOrCreate(['slug' => 'alam'], [
            'name' => 'Alam',
            'description' => 'Wisata pegunungan, hutan tropis, dan petualangan vulkanik.'
        ]);

        $catPantai = Category::firstOrCreate(['slug' => 'pantai'], [
            'name' => 'Pantai',
            'description' => 'Wisata pesisir pantai dengan pasir putih dan ombak berselancar.'
        ]);

        $catBudaya = Category::firstOrCreate(['slug' => 'budaya'], [
            'name' => 'Budaya',
            'description' => 'Wisata sejarah, tradisi lokal, kerajinan kain tapis, dan arsitektur Lampung.'
        ]);

        $catTaman = Category::firstOrCreate(['slug' => 'taman-nasional'], [
            'name' => 'Taman Nasional',
            'description' => 'Kawasan pelestarian alam dan konservasi satwa langka yang dilindungi.'
        ]);

        // 1. Way Kambas
        $wayKambas = Destination::firstOrCreate(['slug' => 'way-kambas'], [
            'category_id' => $catTaman->id,
            'name' => 'Taman Nasional Way Kambas',
            'description' => 'Pusat konservasi Gajah Sumatera dan Badak Sumatera di tengah hutan dataran rendah yang rimbun.',
            'price' => 50000.00,
            'location' => 'Lampung Timur',
            'rating' => 4.8
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $wayKambas->id, 'image_url' => 'https://images.unsplash.com/photo-1564760055775-d63b19a55371?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 2. Pantai Tanjung Setia
        $tanjungSetia = Destination::firstOrCreate(['slug' => 'pantai-tanjung-setia'], [
            'category_id' => $catPantai->id,
            'name' => 'Pantai Tanjung Setia',
            'description' => 'Salah satu pantai dengan ombak terbaik di dunia bagi para peselancar mancanegara.',
            'price' => 25000.00,
            'location' => 'Pesisir Barat, Lampung',
            'rating' => 4.9
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $tanjungSetia->id, 'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 3. Pulau Pahawang
        $pahawang = Destination::firstOrCreate(['slug' => 'pulau-pahawang'], [
            'category_id' => $catBahari->id,
            'name' => 'Pulau Pahawang',
            'description' => 'Surga bawah laut terkenal dengan terumbu karang yang asri dan penangkaran anak penyu (tukik).',
            'price' => 250000.00,
            'location' => 'Pesawaran',
            'rating' => 4.9
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $pahawang->id, 'image_url' => 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 4. Teluk Kiluan
        $kiluan = Destination::firstOrCreate(['slug' => 'teluk-kiluan'], [
            'category_id' => $catBahari->id,
            'name' => 'Teluk Kiluan',
            'description' => 'Saksikan atraksi ratusan lumba-lumba hidung botol berenang bebas di habitat aslinya.',
            'price' => 300000.00,
            'location' => 'Tanggamus',
            'rating' => 4.9
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $kiluan->id, 'image_url' => 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 5. Pantai Gigi Hiu
        $gigiHiu = Destination::firstOrCreate(['slug' => 'pantai-gigi-hiu'], [
            'category_id' => $catPantai->id,
            'name' => 'Pantai Gigi Hiu',
            'description' => 'Formasi batuan karang tajam eksotis yang menjulang tinggi dihempas ombak Samudra Hindia.',
            'price' => 50000.00,
            'location' => 'Tanggamus',
            'rating' => 4.7
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $gigiHiu->id, 'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 6. Menara Siger
        $menaraSiger = Destination::firstOrCreate(['slug' => 'menara-siger'], [
            'category_id' => $catBudaya->id,
            'name' => 'Menara Siger',
            'description' => 'Ikon budaya Lampung berupa mahkota pengantin wanita bersepuh emas menyambut di gerbang Sumatera.',
            'price' => 25000.00,
            'location' => 'Lampung Selatan',
            'rating' => 4.6
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $menaraSiger->id, 'image_url' => 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // 7. Gunung Anak Krakatau
        $krakatau = Destination::firstOrCreate(['slug' => 'gunung-anak-krakatau'], [
            'category_id' => $catAlam->id,
            'name' => 'Gunung Anak Krakatau',
            'description' => 'Petualangan vulkanik legendaris dunia dengan panorama matahari terbit yang luar biasa.',
            'price' => 500000.00,
            'location' => 'Lampung Selatan',
            'rating' => 4.9
        ]);
        DestinationImage::firstOrCreate(['destination_id' => $krakatau->id, 'image_url' => 'https://images.unsplash.com/photo-1608953154378-b19b808a974b?auto=format&fit=crop&w=800&q=80'], ['is_primary' => true]);

        // Site Metrics
        SiteMetric::firstOrCreate(
            ['recorded_at' => now()->toDateString()],
            [
                'total_visitors' => 1200000, // 1.2jt
                'active_users' => 47,        // 47+
                'total_bookings' => 9,       // 9
            ]
        );
    }
}
