import { Head, Link } from '@inertiajs/react';

const fontFamily = "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black';

export default function AuthSplitLayout({ heading, description, cardClassName = '', children }) {
    return (
        <div className="flex min-h-screen flex-col bg-white text-neutral-800 antialiased" style={{ fontFamily }}>
            <Head>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600" rel="stylesheet" />
            </Head>

            <header className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-8">
                <Link href="/" className={`w-fit rounded-md text-sm font-medium text-black ${focusRing}`}>
                    Jelajah Lampung
                </Link>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-12 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-8">
                <div className="max-w-md">
                    <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance text-black sm:text-4xl">
                        {heading}
                    </h1>
                    <p className="mt-4 max-w-sm leading-relaxed text-neutral-600">{description}</p>
                </div>

                <div className={`w-full lg:max-w-sm ${cardClassName}`}>{children}</div>
            </main>
        </div>
    );
}