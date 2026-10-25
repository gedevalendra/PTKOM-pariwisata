import AuthSplitLayout from '@/layouts/AuthSplitLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black';

const inputClass = (hasError) =>
    `block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:ring-1 ${
        hasError
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
            : 'border-neutral-300 focus:border-black focus:ring-black'
    }`;

const businessTypes = [
    { value: 'kuliner', label: 'Kuliner / restoran' },
    { value: 'penginapan', label: 'Penginapan / hotel' },
    { value: 'souvenir', label: 'Oleh-oleh / souvenir' },
    { value: 'tour_guide', label: 'Pemandu wisata' },
    { value: 'transportasi', label: 'Transportasi / rental' },
    { value: 'atraksi_wisata', label: 'Atraksi / objek wisata' },
    { value: 'lainnya', label: 'Lainnya' },
];

function Field({ id, label, error, children }) {
    return (
        <div className="grid gap-1.5">
            <label htmlFor={id} className="text-sm text-neutral-500">
                {label}
            </label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-sm text-rose-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function RegisterBusiness({ token }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        name: '',
        email: '',
        phone_number: '',
        business_name: '',
        business_type: '',
        business_address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('registrasi.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const fieldProps = (key) => ({
        id: key,
        name: key,
        required: true,
        value: data[key],
        'aria-invalid': !!errors[key],
        'aria-describedby': errors[key] ? `${key}-error` : undefined,
        className: inputClass(!!errors[key]),
        onChange: (e) => setData(key, e.target.value),
    });

    return (
        <AuthSplitLayout
            heading="Daftarkan usaha Anda di Jelajah Lampung."
            description="Tampilkan kuliner, penginapan, atau wisata Anda kepada wisatawan yang menjelajahi Lampung."
            cardClassName="bg-white"
        >
            <Head title="Daftar mitra usaha - Jelajah Lampung">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div style={{ fontFamily }} className="antialiased">
                <h2 className="text-2xl font-medium tracking-tight text-black">Daftar sebagai pemilik usaha</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    Akun diverifikasi admin sebelum dapat mengelola konten. Pastikan data usaha Anda benar.
                </p>

                <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
                    <Field id="name" label="Nama pemilik" error={errors.name}>
                        <input {...fieldProps('name')} type="text" autoFocus autoComplete="name" />
                    </Field>

                    <Field id="email" label="Email bisnis" error={errors.email}>
                        <input {...fieldProps('email')} type="email" autoComplete="username" />
                    </Field>

                    <Field id="phone_number" label="Nomor WhatsApp aktif" error={errors.phone_number}>
                        <input {...fieldProps('phone_number')} type="tel" autoComplete="tel" placeholder="081234567890" />
                    </Field>

                    <div className="mt-3 flex flex-col gap-5 border-t border-neutral-200 pt-8">
                        <h3 className="text-base font-medium text-black">Informasi usaha</h3>

                        <Field id="business_name" label="Nama usaha / objek wisata" error={errors.business_name}>
                            <input
                                {...fieldProps('business_name')}
                                type="text"
                                autoComplete="organization"
                                placeholder="Contoh: Warung Kopi Lampung"
                            />
                        </Field>

                        <Field id="business_type" label="Kategori usaha" error={errors.business_type}>
                            <select {...fieldProps('business_type')}>
                                <option value="">Pilih kategori</option>
                                {businessTypes.map(({ value, label }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field id="business_address" label="Alamat lengkap usaha" error={errors.business_address}>
                            <textarea {...fieldProps('business_address')} rows={3} autoComplete="street-address" />
                        </Field>
                    </div>

                    <div className="mt-3 flex flex-col gap-5 border-t border-neutral-200 pt-8">
                        <h3 className="text-base font-medium text-black">Keamanan akun</h3>

                        <Field id="password" label="Kata sandi" error={errors.password}>
                            <input {...fieldProps('password')} type="password" autoComplete="new-password" />
                        </Field>

                        <Field id="password_confirmation" label="Konfirmasi kata sandi" error={errors.password_confirmation}>
                            <input {...fieldProps('password_confirmation')} type="password" autoComplete="new-password" />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`mt-3 w-full rounded-md bg-[#4C83AD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3f7099] disabled:opacity-60 ${focusRing}`}
                    >
                        {processing ? 'Memproses...' : 'Daftar sebagai mitra'}
                    </button>
                </form>

                <p className="mt-8 text-sm text-neutral-500">
                    <Link
                        href={route('registrasi.select')}
                        className={`rounded-md font-medium text-black underline underline-offset-4 ${focusRing}`}
                    >
                        Kembali ke pilihan jenis akun
                    </Link>
                </p>
            </div>
        </AuthSplitLayout>
    );
}