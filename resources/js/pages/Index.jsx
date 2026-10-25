import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import DestinationCard from '@/components/DestinationCard';
import PublicFooter from '@/components/PublicFooter';
import PublicNavbar from '@/components/PublicNavbar';
import TestimonialCard from '@/components/TestimonialCard';

const statistics = [
    { value: '47+', label: 'Destinasi wisata' },
    { value: '1,2 jt', label: 'Wisatawan per tahun' },
    { value: '9', label: 'Kategori wisata' },
    { value: '4,8', label: 'Rating rata-rata' },
];

const categories = ['Semua', 'Bahari', 'Alam', 'Pantai', 'Budaya'];

const destinationsData = [
    {
        id: 1,
        title: 'Pulau Pahawang',
        category: 'Bahari',
        location: 'Pesawaran',
        rating: 4.9,
        reviewCount: 342,
        description: 'Surga bawah laut terkenal dengan terumbu karang yang asri dan penangkaran anak penyu (tukik).',
        price: 'Rp 250.000 / orang',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 2,
        title: 'Taman Nasional Way Kambas',
        category: 'Alam',
        location: 'Lampung Timur',
        rating: 4.8,
        reviewCount: 215,
        description: 'Pusat konservasi Gajah Sumatera dan Badak Sumatera di tengah hutan dataran rendah yang rimbun.',
        price: 'Rp 100.000 / orang',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b19a55371?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 3,
        title: 'Pantai Gigi Hiu',
        category: 'Pantai',
        location: 'Tanggamus',
        rating: 4.7,
        reviewCount: 180,
        description: 'Formasi batuan karang tajam eksotis yang menjulang tinggi dihempas ombak Samudra Hindia.',
        price: 'Rp 50.000 / orang',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 4,
        title: 'Teluk Kiluan',
        category: 'Bahari',
        location: 'Tanggamus',
        rating: 4.9,
        reviewCount: 290,
        description: 'Saksikan atraksi ratusan lumba-lumba hidung botol berenang bebas di habitat aslinya.',
        price: 'Rp 300.000 / orang',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 5,
        title: 'Gunung Krakatau & Anak Krakatau',
        category: 'Alam',
        location: 'Lampung Selatan',
        rating: 4.9,
        reviewCount: 410,
        description: 'Petualangan vulkanik legendaris dunia dengan panorama matahari terbit yang luar biasa.',
        price: 'Rp 500.000 / orang',
        image: 'https://images.unsplash.com/photo-1608953154378-b19b808a974b?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: 6,
        title: 'Menara Siger',
        category: 'Budaya',
        location: 'Lampung Selatan',
        rating: 4.6,
        reviewCount: 155,
        description: 'Ikon budaya Lampung berupa mahkota pengantin wanita bersepuh emas menyambut di gerbang Sumatera.',
        price: 'Rp 25.000 / orang',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
    },
];

const cultureFeatures = [
    {
        title: 'Tari Siger',
        desc: 'Tarian penyambutan tamu kehormatan dengan mahkota Siger emas.',
    },
    {
        title: 'Kain Tapis',
        desc: 'Tenun tradisional bersulam benang emas dengan filosofi luhur leluhur.',
    },
    {
        title: 'Gamolan Pekhing',
        desc: 'Alat musik bilah bambu yang menghasilkan melodi syahdu.',
    },
    {
        title: 'Pesta Sekura',
        desc: 'Tradisi topeng khas masyarakat Lampung Barat pasca Idul Fitri.',
    },
];

const galleryImages = [
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1564760055775-d63b19a55371?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608953154378-b19b808a974b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
];

const testimonialsData = [
    {
        id: 1,
        quote: 'Keindahan bawah laut Pulau Pahawang dan keramahan warga lokal membuat liburan kami sangat berkesan. Recommended banget!',
        name: 'Rian Hidayat',
        role: 'Travel Vlogger',
        location: 'Jakarta',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
    {
        id: 2,
        quote: 'Menyaksikan lumba-lumba langsung di Teluk Kiluan saat matahari terbit adalah pengalaman yang tidak akan pernah saya lupakan.',
        name: 'Sarah Wijaya',
        role: 'Fotografer',
        location: 'Bandung',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
    {
        id: 3,
        quote: 'Kombinasi sempurna antara wisata alam liar Way Kambas dan kekayaan budaya Kain Tapis. Lampung luar biasa!',
        name: 'Dimas Prasetyo',
        role: 'Backpacker',
        location: 'Yogyakarta',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
];

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const container = 'mx-auto w-full max-w-6xl px-6 lg:px-8';
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4C83AD]';

function SectionHeader({ title, description }) {
        return (
        <div className="max-w-xl">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
            {description && <p className="mt-4 leading-relaxed text-slate-600">{description}</p>}
        </div>
    );
}

export default function Index({
    destinations: initialDestinations = [],
    categories: initialCategories = [],
    statistics: initialStatistics = [],
}) {
    const destinationsList = initialDestinations && initialDestinations.length > 0 ? initialDestinations : destinationsData;
    const categoriesList = initialCategories && initialCategories.length > 0 ? ['Semua', ...initialCategories] : categories;
    const statsList = initialStatistics && initialStatistics.length > 0 ? initialStatistics : statistics;

    const [activeCategory, setActiveCategory] = useState('Semua');

    const filteredDestinations =
        activeCategory === 'Semua' ? destinationsList : destinationsList.filter((d) => d.category === activeCategory);

    return (
        <>
            <Head title="Jelajah Lampung - Pariwisata & Budaya">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-white text-slate-800 antialiased" style={{ fontFamily }}>
                <PublicNavbar />

                <main className="flex-1">
                    {/* Hero */}
                    <section className="relative flex min-h-[85vh] items-end overflow-hidden pt-24">
                        <img
                            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=85"
                            alt="Pantai di Lampung"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/55" />

                        <div className={`${container} relative pb-16 sm:pb-24`}>
                            <h1 className="max-w-3xl text-5xl leading-[1.1] font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
                                Alam Luar, budaya kaya, Lampung.
                            </h1>
                            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                                Dari sabana Way Kambas hingga ombak Samudra Hindia, Lampung menyimpan alam dan tradisi yang menunggu dijelajahi.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center gap-6">
                                <a
                                    href="#destinations"
                                    className={`rounded-md bg-white px-6 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100 ${focusRing}`}
                                >
                                    Lihat destinasi
                                </a>
                                <a
                                    href="#budaya"
                                    className={`text-sm font-medium text-white/90 underline underline-offset-4 transition hover:text-white ${focusRing}`}
                                >
                                    Kenali budaya lokal
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Statistik */}
                    <section className="border-b border-slate-200">
                        <dl className={`${container} grid grid-cols-2 gap-x-6 gap-y-8 py-12 md:grid-cols-4`}>
                            {statsList.map((statistic) => (
                                <div key={statistic.label}>
                                    <dd className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{statistic.value}</dd>
                                    <dt className="mt-1 text-sm text-slate-500">{statistic.label}</dt>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {/* Destinasi */}
                    <section id="destinations" className="py-20 sm:py-28">
                        <div className={container}>
                            <SectionHeader
                                title="Tempat yang wajib dikunjungi"
                                description="Destinasi terbaik di Lampung, dari kepulauan tropis hingga taman nasional bersejarah."
                            />

                            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-slate-200">
                                {categoriesList.map((category) => (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => setActiveCategory(category)}
                                        aria-pressed={activeCategory === category}
                                        className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${focusRing} ${
                                            activeCategory === category
                                                ? 'border-[#4C83AD] text-slate-900'
                                                : 'border-transparent text-slate-500 hover:text-slate-900'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredDestinations.map((destination) => (
                                    <DestinationCard key={destination.id} {...destination} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Budaya */}
                    <section id="budaya" className="border-t border-slate-200 py-20 sm:py-28">
                        <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
                            <SectionHeader
                                title="Budaya Lampung yang abadi"
                                description="Adat, tarian, tenun, dan seni turun-temurun yang menjaga jiwa Sang Bumi Ruwa Jurai."
                            />
                            <ul className="divide-y divide-slate-200 border-y border-slate-200">
                                {cultureFeatures.map((feature) => (
                                    <li key={feature.title} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                                        <h3 className="font-medium text-slate-900">{feature.title}</h3>
                                        <p className="text-sm leading-relaxed text-slate-600">{feature.desc}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Galeri */}
                    <section id="galeri" className="border-t border-slate-200 py-20 sm:py-28">
                        <div className={container}>
                            <SectionHeader title="Galeri foto" />
                            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {galleryImages.map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Foto wisata Lampung ${index + 1}`}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full rounded-md bg-slate-100 object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Testimoni */}
                    <section id="testimoni" className="border-t border-slate-200 bg-slate-50 py-20 sm:py-28">
                        <div className={container}>
                            <SectionHeader title="Cerita dari mereka yang sudah berkunjung" />
                            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
                                {testimonialsData.map((item) => (
                                    <TestimonialCard key={item.id} {...item} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section id="rencanakan" className="py-20 sm:py-28">
                        <div className={container}>
                            <h2 className="max-w-2xl text-4xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-5xl">Lampung menunggu Anda.</h2>
                            <p className="mt-5 max-w-lg leading-relaxed text-slate-600">
                                Rencanakan liburan Anda sekarang dan rasakan langsung alam dan budaya Lampung.
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-6">
                                <Link
                                    href={route('registrasi.select')}
                                    className={`rounded-md bg-[#4C83AD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3f7099] ${focusRing}`}
                                >
                                    Daftar akun
                                </Link>
                                <a
                                    href="#destinations"
                                    className={`text-sm font-medium text-slate-700 underline underline-offset-4 transition hover:text-slate-900 ${focusRing}`}
                                >
                                    Jelajahi destinasi
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}