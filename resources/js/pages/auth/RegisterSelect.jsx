import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black';

const accountTypes = [
    {
        type: 'user',
        title: 'Wisatawan',
        description: 'Jelajahi destinasi, beri ulasan, dan simpan favorit.',
    },
    {
        type: 'business_owner',
        title: 'Pemilik usaha',
        description: 'Daftarkan kuliner, penginapan, atau wisata Anda. Akun diverifikasi admin.',
    },
];

export default function RegisterSelect() {
    const { transform, post, processing } = useForm({ type: 'user' });
    const [selected, setSelected] = useState(null);

    const selectType = (selectedType) => {
        setSelected(selectedType);
        transform(() => ({ type: selectedType }));
        post(route('registrasi.generate'));
    };

    return (
        <AuthSplitLayout
            heading="Buat akun, lalu mulai perjalananmu."
            description="Pilih jenis akun sesuai kebutuhan Anda untuk mulai menjelajahi Lampung."
            cardClassName="bg-white"
        >
            <Head title="Pilih jenis akun - Jelajah Lampung">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div style={{ fontFamily }} className="antialiased">
                <h2 className="text-2xl font-medium tracking-tight text-black">Pilih jenis akun</h2>

                <ul className="mt-8 flex flex-col gap-3">
                    {accountTypes.map(({ type, title, description }) => (
                        <li key={type}>
                            <button
                                type="button"
                                disabled={processing}
                                onClick={() => selectType(type)}
                                className={`w-full rounded-md bg-black px-5 py-4 text-left text-white transition hover:bg-neutral-800 disabled:opacity-60 ${focusRing}`}
                            >
                                <span className="block text-base font-medium">
                                    {processing && selected === type ? 'Memproses...' : title}
                                </span>
                                <span className="mt-1 block text-sm text-neutral-300">{description}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <p className="mt-8 text-sm text-neutral-500">
                    Sudah punya akun?{' '}
                    <Link
                        href={route('login')}
                        className={`rounded-md font-medium text-black underline underline-offset-4 ${focusRing}`}
                    >
                        Masuk
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
}