import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';

export default function Form({ categories, destination }) {
    const { data, setData, post, put, processing, errors } = useForm({
        category_id: destination?.category_id || (categories[0]?.id ?? ''),
        name: destination?.name || '',
        description: destination?.description || '',
        content: destination?.content || '',
        price: destination?.price || '',
        discount_price: destination?.discount_price || '',
        location: destination?.location || '',
        opening_time: destination?.opening_time || '08:00',
        closing_time: destination?.closing_time || '17:00',
        is_published: destination ? destination.is_published : true,
        image_url: destination?.images?.[0]?.image_url || '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        if (destination) {
            put(route('manage.destinations.update', destination.id));
        } else {
            post(route('manage.destinations.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">{destination ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}</h2>}
        >
            <Head title={destination ? 'Edit Destinasi' : 'Tambah Destinasi'} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="category_id" value="Kategori" />
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category_id} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Nama Destinasi" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="location" value="Lokasi" />
                                <TextInput
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.location} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="opening_time" value="Jam Buka" />
                                    <TextInput
                                        id="opening_time"
                                        type="time"
                                        value={data.opening_time}
                                        onChange={(e) => setData('opening_time', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.opening_time} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="closing_time" value="Jam Tutup" />
                                    <TextInput
                                        id="closing_time"
                                        type="time"
                                        value={data.closing_time}
                                        onChange={(e) => setData('closing_time', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.closing_time} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="price" value="Harga Tiket Normal (Rp)" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="discount_price" value="Harga Diskon / Promo (Rp)" />
                                    <TextInput
                                        id="discount_price"
                                        type="number"
                                        value={data.discount_price}
                                        onChange={(e) => setData('discount_price', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.discount_price} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="description" value="Deskripsi Singkat" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                ></textarea>
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="content" value="Artikel / Konten Lengkap Destinasi" />
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="6"
                                    placeholder="Tulis artikel menarik tentang destinasi ini..."
                                ></textarea>
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="image" value="Upload Gambar Destinasi" />
                                <input
                                    id="image"
                                    type="file"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.image} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="image_url" value="Atau URL Gambar" />
                                <TextInput
                                    id="image_url"
                                    type="url"
                                    value={data.image_url}
                                    onChange={(e) => setData('image_url', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="https://example.com/image.jpg"
                                />
                                <InputError message={errors.image_url} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                />
                                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Publikasikan (Muncul di pencarian publik)</label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <PrimaryButton disabled={processing}>{destination ? 'Simpan Perubahan' : 'Tambah Destinasi'}</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
