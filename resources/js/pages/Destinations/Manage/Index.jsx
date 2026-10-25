import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/components/PrimaryButton';
import DangerButton from '@/components/DangerButton';
import { useState } from 'react';

export default function Index({ destinations, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('manage.destinations.index'), { search }, { preserveState: true });
    };

    const togglePublish = (id) => {
        router.patch(route('manage.destinations.toggle-publish', id));
    };

    const deleteDestination = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus destinasi ini?')) {
            router.delete(route('manage.destinations.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Destinasi</h2>}
        >
            <Head title="Kelola Destinasi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari destinasi..."
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <PrimaryButton type="submit">Cari</PrimaryButton>
                        </form>
                        <Link href={route('manage.destinations.create')}>
                            <PrimaryButton>Tambah Destinasi</PrimaryButton>
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Lokasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {destinations.data.map((dest) => (
                                    <tr key={dest.id}>
                                        <td className="whitespace-nowrap px-6 py-4">{dest.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4">{dest.location}</td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <button
                                                onClick={() => togglePublish(dest.id)}
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${dest.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                {dest.is_published ? 'Published' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 flex gap-2">
                                            <Link href={route('manage.destinations.edit', dest.id)} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                                            <button onClick={() => deleteDestination(dest.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
