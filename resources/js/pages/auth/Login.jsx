import { Head, Link, useForm } from '@inertiajs/react';

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4C83AD]';
const inputClass =
    'w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-1';

const fieldClass = (hasError) =>
    `${inputClass} ${hasError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-[#4C83AD] focus:ring-[#4C83AD]'}`;

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk - Jelajah Lampung">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-white px-6 py-6 text-slate-800 antialiased sm:px-10" style={{ fontFamily }}>
                <header className="mx-auto w-full max-w-sm text-sm">
                    <Link href="/" className={`flex w-fit items-center gap-2 rounded-sm font-medium text-slate-900 ${focusRing}`}>
                        <span className="h-2 w-2 rounded-full bg-[#4C83AD]" aria-hidden="true" />
                        Jelajah Lampung
                    </Link>
                </header>

                <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Selamat datang kembali</h1>
                    <p className="mt-2 text-slate-600">Masuk ke akun Jelajah Lampung Anda.</p>

                    {status && (
                        <p role="status" className="mt-6 text-sm font-medium text-green-700">
                            {status}
                        </p>
                    )}

                    <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-900">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                autoComplete="username"
                                value={data.email}
                                placeholder="nama@email.com"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                className={fieldClass(!!errors.email)}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && (
                                <p id="email-error" role="alert" className="text-sm text-rose-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-900">
                                Kata sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                required
                                autoComplete="current-password"
                                value={data.password}
                                placeholder="Kata sandi"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className={fieldClass(!!errors.password)}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && (
                                <p id="password-error" role="alert" className="text-sm text-rose-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-4 text-sm">
                            <label htmlFor="remember" className="flex cursor-pointer items-center gap-2 text-slate-600">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded-sm border-slate-300 accent-[#4C83AD]"
                                />
                                Ingat saya
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className={`rounded-sm text-slate-500 underline underline-offset-4 transition hover:text-slate-900 ${focusRing}`}
                                >
                                    Lupa kata sandi?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`mt-2 w-full rounded-md bg-[#4C83AD] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3f7099] disabled:opacity-60 ${focusRing}`}
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-slate-600">
                        Belum punya akun?{' '}
                        <Link
                            href={route('registrasi.select')}
                            className={`rounded-sm font-medium text-slate-900 underline underline-offset-4 transition hover:text-[#4C83AD] ${focusRing}`}
                        >
                            Daftar
                        </Link>
                    </p>
                </main>
            </div>
        </>
    );
}