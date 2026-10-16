import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    MapPin, 
    Star, 
    Search, 
    Image as ImageIcon,
    X,
    UploadCloud
} from 'lucide-react';

export default function Destinations({ auth, destinations, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDestination, setEditingDestination] = useState(null);

    const { data, setData, post, reset, processing, errors, clearErrors } = useForm({
        name: '',
        category_id: categories[0]?.id || '',
        price: '',
        location: '',
        rating: '4.8',
        description: '',
        image: null,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.destinations.index'), { search: searchTerm }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditingDestination(null);
        reset();
        clearErrors();
        setData({
            name: '',
            category_id: categories[0]?.id || '',
            price: '',
            location: '',
            rating: '4.8',
            description: '',
            image: null,
        });
        setModalOpen(true);
    };

    const openEditModal = (dest) => {
        setEditingDestination(dest);
        clearErrors();
        setData({
            name: dest.name,
            category_id: dest.category_id,
            price: dest.price,
            location: dest.location || '',
            rating: dest.rating || '4.8',
            description: dest.description || '',
            image: null,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDestination) {
            // Use post with _method=PUT to support multipart file upload
            router.post(route('admin.destinations.update', editingDestination.id), {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('admin.destinations.store'), {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (dest) => {
        if (confirm(`Apakah Anda yakin ingin menghapus destinasi "${dest.name}"?`)) {
            router.delete(route('admin.destinations.destroy', dest.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-bold leading-tight text-gray-900">
                        Manajemen Destinasi Wisata
                    </h2>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-[#4C83AD] hover:bg-[#3d6b8e] text-white text-sm font-medium rounded-xl shadow-sm transition-colors space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Destinasi Baru</span>
                    </button>
                </div>
            }
        >
            <Head title="Kelola Destinasi - Admin" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama atau lokasi destinasi..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#4C83AD] focus:border-transparent outline-none transition"
                            />
                        </form>
                        <span className="text-xs text-gray-500 font-medium">
                            Total {destinations.total} destinasi terdaftar
                        </span>
                    </div>

                    {/* Destinations Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="py-4 px-6">Destinasi</th>
                                        <th className="py-4 px-6">Kategori</th>
                                        <th className="py-4 px-6">Lokasi</th>
                                        <th className="py-4 px-6">Harga Tiket</th>
                                        <th className="py-4 px-6">Rating</th>
                                        <th className="py-4 px-6 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {destinations.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-gray-500">
                                                Belum ada data destinasi wisata ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        destinations.data.map((dest) => {
                                            const primaryImg = dest.images?.find((img) => img.is_primary) || dest.images?.[0];
                                            return (
                                                <tr key={dest.id} className="hover:bg-gray-50/60 transition">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                                {primaryImg ? (
                                                                    <img
                                                                        src={primaryImg.image_url}
                                                                        alt={dest.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                        <ImageIcon className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900">{dest.name}</h4>
                                                                <p className="text-xs text-gray-400 font-mono">/{dest.slug}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
                                                            {dest.category?.name || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-gray-600">
                                                        <div className="flex items-center space-x-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                            <span>{dest.location || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 font-medium text-gray-900">
                                                        Rp {Number(dest.price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center space-x-1 text-amber-500">
                                                            <Star className="w-4 h-4 fill-amber-400" />
                                                            <span className="font-semibold text-gray-800">{Number(dest.rating).toFixed(1)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-right space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(dest)}
                                                            className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-[#4C83AD] rounded-lg transition"
                                                            title="Edit Destinasi"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(dest)}
                                                            className="p-1.5 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-lg transition"
                                                            title="Hapus Destinasi"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {destinations.links && destinations.links.length > 3 && (
                            <div className="py-3 px-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex gap-1">
                                    {destinations.links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 text-xs rounded-lg transition ${
                                                link.active
                                                    ? 'bg-[#4C83AD] text-white font-bold'
                                                    : link.url
                                                    ? 'hover:bg-gray-100 text-gray-700'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form Tambah / Edit Destinasi */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingDestination ? 'Edit Destinasi Wisata' : 'Tambah Destinasi Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Nama Destinasi *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Pantai Marina Kalianda"
                                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        required
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none bg-white"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-rose-600 mt-1">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Lokasi (Kabupaten / Kota) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Contoh: Lampung Selatan"
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none"
                                    />
                                    {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Harga Tiket Masuk (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="Contoh: 25000"
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none"
                                    />
                                    {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Rating (0.0 - 5.0)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={data.rating}
                                        onChange={(e) => setData('rating', e.target.value)}
                                        placeholder="4.8"
                                        className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Deskripsi Destinasi
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Ceritakan daya tarik dan keunikan destinasi ini..."
                                    className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4C83AD] outline-none"
                                />
                            </div>

                            {/* Foto Destinasi */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Unggah Foto Destinasi (Maks. 2MB, JPG/PNG)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#4C83AD]/10 file:text-[#4C83AD] hover:file:bg-[#4C83AD]/20"
                                />
                                {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-[#4C83AD] hover:bg-[#3d6b8e] text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Destinasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
