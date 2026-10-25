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

const fields = [
    {
        id: 'name',
        label: 'Nama',
        placeholder: 'Nama lengkap',
        autoComplete: 'name',
        required: true,
    },
    {
        id: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'nama@email.com',
        autoComplete: 'username',
        required: true,
    },
    {
        id: 'phone_number',
        label: 'Nomor kontak (opsional)',
        type: 'tel',
        placeholder: '+62 ...',
        autoComplete: 'tel',
    },
    {
        id: 'password',
        label: 'Kata sandi',
        type: 'password',
        autoComplete: 'new-password',
        required: true,
    },
    {
        id: 'password_confirmation',
        label: 'Konfirmasi kata sandi',
        type: 'password',
        autoComplete: 'new-password',
        required: true,
    },
];

export default function RegisterUser({ token }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('registrasi.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthSplitLayout
            heading="Buat akun, lalu mulai perjalananmu."
            description="Isi informasi dasar Anda untuk menyimpan rencana perjalanan dan melanjutkan reservasi."
            cardClassName="bg-white"
        >
            <Head title="Buat akun - Jelajah Lampung">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div style={{ fontFamily }} className="antialiased">
                <h2 className="text-2xl font-medium tracking-tight text-black">Buat akun</h2>
                <p className="mt-2 text-sm text-neutral-500">Lengkapi data berikut untuk melanjutkan reservasi.</p>

                <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
                    {fields.map((field, index) => (
                        <div key={field.id} className="grid gap-1.5">
                            <label htmlFor={field.id} className="text-sm text-neutral-500">
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                name={field.id}
                                type={field.type ?? 'text'}
                                value={data[field.id]}
                                placeholder={field.placeholder}
                                autoComplete={field.autoComplete}
                                autoFocus={index === 0}
                                required={field.required}
                                aria-invalid={!!errors[field.id]}
                                aria-describedby={errors[field.id] ? `${field.id}-error` : undefined}
                                className={inputClass(!!errors[field.id])}
                                onChange={(e) => setData(field.id, e.target.value)}
                            />
                            {errors[field.id] && (
                                <p id={`${field.id}-error`} role="alert" className="text-sm text-rose-600">
                                    {errors[field.id]}
                                </p>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        disabled={processing}
                        className={`mt-3 w-full rounded-md bg-[#4C83AD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3f7099] disabled:opacity-60 ${focusRing}`}
                    >
                        {processing ? 'Memproses...' : 'Daftar akun'}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-start gap-2 text-sm text-neutral-500">
                    <p>
                        Sudah punya akun?{' '}
                        <Link
                            href={route('login')}
                            className={`rounded-md font-medium text-black underline underline-offset-4 ${focusRing}`}
                        >
                            Masuk
                        </Link>
                    </p>
                    <Link
                        href={route('registrasi.select')}
                        className={`rounded-md font-medium underline underline-offset-4 hover:text-black ${focusRing}`}
                    >
                        Kembali ke pilihan jenis akun
                    </Link>
                </div>
            </div>
        </AuthSplitLayout>
    );
}