# Rencana Kerja Backend (Backend Improvement & Gap Resolution Plan)

Dokumen ini merangkum analisis lengkap mengenai kekurangan, celah keamanan, bug teknis, diskoneksi integrasi frontend, dan rencana perbaikan terstruktur untuk sisi **Backend** pada proyek **PTKOM Pariwisata (Provinsi Lampung)**.

---

## 📌 Ringkasan Status Backend Saat Ini

- **Framework:** Laravel 12 (PHP 8.2+)
- **Database Driver:** SQLite (Development) / PostgreSQL (Production)
- **Komponen Utama:** REST API v1 (`/api/v1`), Alur Registrasi Berbasis Token (`RegistrationFlowController`), Manajemen Validasi Mitra Usaha (`BusinessValidationController`).
- **Status Integrasi:** Backend API sudah berjalan, namun halaman publik frontend masih menggunakan data *mock* (hardcoded) karena belum diinjeksi dari controller backend.

---

## 🔍 Temuan Kekurangan & Masalah Mendalam

### 1. [P0 - Kritis] Bug Pencarian API Crash pada SQLite (`ilike` Operator)
- **Lokasi Berkas:** `app/Http/Controllers/Api/DestinationController.php` (Baris 24–26)
- **Permasalahan:** Operator `ilike` hanya didukung oleh PostgreSQL. Pada database development (SQLite) atau MySQL, pemanggilan `GET /api/v1/destinations?search=...` memicu fatal error:
  `SQLSTATE[HY000]: General error: 1 near "ilike": syntax error`.
- **Dampak:** Pengunjung web tidak dapat mencari destinasi wisata.
- **Solusi Teknis:**
  Gunakan deteksi driver database atau gunakan operator `LIKE` standar:
  ```php
  $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';
  $query->where(function ($q) use ($search, $operator) {
      $q->where('name', $operator, "%{$search}%")
        ->orWhere('description', $operator, "%{$search}%")
        ->orWhere('location', $operator, "%{$search}%");
  });
  ```

---

### 2. [P0 - Keamanan] Rute Admin Validasi Mitra Tanpa Proteksi Role (Broken Access Control)
- **Lokasi Berkas:** `routes/web.php` (Baris 31–34)
- **Permasalahan:** Rute `/admin/validasi-mitra` hanya dilindungi middleware `auth`. Pengguna biasa dengan `role = 'user'` atau mitra yang login dapat mengakses panel admin dan mengubah status persetujuan mitra usaha.
- **Dampak:** Celah eskalasi hak akses (*security privilege escalation*).
- **Solusi Teknis:**
  1. Buat middleware `app/Http/Middleware/EnsureUserIsAdmin.php`:
     ```php
     if ($request->user()?->role !== 'admin') {
         abort(403, 'Akses ditolak. Halaman ini hanya untuk Administrator.');
     }
     ```
  2. Lindungi rute admin di `routes/web.php` dengan middleware tersebut.

---

### 3. [P1 - Integrasi Frontend] Halaman Publik Masih Menggunakan Data Mock (Hardcoded)
- **Lokasi Berkas:** `routes/web.php` (Baris 9–21), `resources/js/pages/Index.jsx`, `resources/js/pages/Destinations/Index.jsx`
- **Permasalahan:** 
  - Rute `/` dan `/destinations` hanya merender komponen Inertia kosong tanpa mengirimkan data dari database (`destinations`, `categories`, `statistics`).
  - Frontend terpaksa menggunakan data statis/array tiruan (*"Data sementara sampai endpoint /api/v1/destinations dipakai"*).
  - Perubahan data di database tidak tercermin di tampilan website.
- **Solusi Teknis:**
  Buat `HomeController.php` atau oper data langsung dari `routes/web.php` ke Inertia props:
  ```php
  Route::get('/', function () {
      return Inertia::render('Index', [
          'destinations' => Destination::with(['category', 'images'])->latest()->take(6)->get(),
          'categories' => Category::all(),
          'metrics' => SiteMetric::latest('recorded_at')->first(),
      ]);
  });
  ```

---

### 4. [P1 - Endpoint API] Ketiadaan Endpoint Kategori Destinasi (`/api/v1/categories`)
- **Lokasi Berkas:** `routes/api.php`
- **Permasalahan:** Terdapat endpoint untuk destinasi, namun tidak ada endpoint REST untuk mengambil daftar kategori (`Category`). Klien web atau aplikasi mobile terpaksa meng-hardcode kategori pariwisata.
- **Solusi Teknis:**
  Tambahkan controller dan rute:
  ```php
  Route::get('/categories', [CategoryController::class, 'index']);
  ```
  Format respon:
  ```json
  {
    "status": "success",
    "message": "Categories retrieved successfully",
    "data": [ ... ]
  }
  ```

---

### 5. [P1 - Standar Kontrak API] Ketidaksesuaian Parameter Detail Destinasi (`api_spec.md`)
- **Lokasi Berkas:** `routes/api.php` & `app/Http/Controllers/Api/DestinationController.php`
- **Permasalahan:** Dokumen spesifikasi API menetapkan `/api/v1/destinations/:id` menerima UUID, sedangkan controller hanya mencari berdasarkan `slug`.
- **Solusi Teknis:**
  Dukung pencarian fleksibel berdasarkan `slug` ATAU `id` (UUID):
  ```php
  public function show(string $identifier)
  {
      $destination = Destination::with(['category', 'images'])
          ->where('slug', $identifier)
          ->orWhere('id', $identifier)
          ->firstOrFail();

      return (new DestinationResource($destination))->additional([
          'status' => 'success',
          'message' => 'Destination detail retrieved successfully'
      ]);
  }
  ```

---

### 6. [P1 - Data Awal] Tidak Ada Akun Admin Default di Database Seeder
- **Lokasi Berkas:** `database/seeders/DatabaseSeeder.php`
- **Permasalahan:** Hanya ada akun contoh biasa (`Test User`). Penguji/dosen penguji tidak memiliki kredensial admin untuk login dan menguji modul validasi mitra.
- **Solusi Teknis:**
  Suntikkan akun admin di seeder:
  ```php
  User::firstOrCreate(
      ['email' => 'admin@pariwisatalampung.go.id'],
      [
          'name' => 'Administrator Pariwisata',
          'role' => 'admin',
          'validation_status' => 'approved',
          'password' => bcrypt('admin123'),
          'email_verified_at' => now(),
      ]
  );
  ```

---

### 7. [P2 - Format Respon Error API] Standardisasi Respons 404 & Validasi Error
- **Lokasi Berkas:** `bootstrap/app.php` (`withExceptions`)
- **Permasalahan:** Jika destinasi tidak ditemukan (404) atau terjadi error di `/api/v1/*`, Laravel mengembalikan format default framework `{ "message": "..." }`, bukan standar kontrak `{ "status": "error", "message": "...", "data": null }`.
- **Solusi Teknis:**
  Kustomisasi penanganan exception untuk request berawalan `api/*` di `bootstrap/app.php`.

---

### 8. [P2 - Redundansi Kode] Duplikasi Middleware di `bootstrap/app.php`
- **Lokasi Berkas:** `bootstrap/app.php` (Baris 17–25)
- **Permasalahan:** Middleware `HandleInertiaRequests` dan `AddLinkHeadersForPreloadedAssets` didaftarkan dua kali dalam method `$middleware->web(append: [...])`.
- **Solusi Teknis:** Hapus blok duplikasi baris 22–25.

---

### 9. [P2 - Fitur Operasional Admin] Belum Ada CRUD Destinasi & Upload Gambar
- **Lokasi Berkas:** Belum ada controller CRUD destinasi untuk admin
- **Permasalahan:** Data destinasi saat ini murni statis dari seeder. Admin belum dapat menambah, mengedit, atau menghapus destinasi wisata serta mengunggah galeri foto (`multipart/form-data`) ke `storage/app/public`.

---

### 10. [P2 - Automated Testing] Belum Ada Feature Test untuk Logika Kustom
- **Lokasi Berkas:** `tests/Feature/`
- **Permasalahan:** Belum ada automated test untuk:
  - `DestinationApiTest` (index, pagination, search, category filter, show by slug & id).
  - `BusinessValidationTest` (hak akses admin, persetujuan dan penolakan mitra).
  - `RegistrationFlowTest` (validitas token 30 menit).

---

## 📋 Matriks Prioritas Perbaikan

| No | Kategori | Item Pekerjaan | File Target | Prioritas |
|:--:|:---|:---|:---|:---:|
| 1 | Bug Fix | Perbaiki operator pencarian `ilike` -> `like` di SQLite | `DestinationController.php` | **P0** |
| 2 | Keamanan | Buat Middleware `EnsureUserIsAdmin` untuk rute `/admin/*` | `EnsureUserIsAdmin.php`, `routes/web.php` | **P0** |
| 3 | Integrasi | Kirim data dinamis database ke halaman `/` dan `/destinations` | `routes/web.php`, `Index.jsx` | **P1** |
| 4 | API Feature | Buat endpoint `/api/v1/categories` | `CategoryController.php`, `routes/api.php` | **P1** |
| 5 | Standar API | Dukung pencarian Detail Destinasi via UUID & Slug | `DestinationController.php` | **P1** |
| 6 | Database | Tambahkan akun default Admin di seeder | `DatabaseSeeder.php` | **P1** |
| 7 | Refactor | Bersihkan duplikasi middleware Inertia | `bootstrap/app.php` | **P2** |
| 8 | Standar API | Format respons error JSON seragam (`status: error`) | `bootstrap/app.php` | **P2** |
| 9 | Fitur Baru | CRUD Destinasi + Upload Foto untuk Admin | `Admin/DestinationController.php` | **P2** |
| 10 | Quality Assurance | Buat automated test (Pest) untuk API & Admin | `tests/Feature/Api/`, `tests/Feature/Admin/` | **P2** |

---

## 🎯 Status Eksekusi

- [x] **1. Fix Query SQLite Compatibility:** Selesai (`DestinationController.php`, operator `LIKE` database-agnostic).
- [x] **2. Middleware Proteksi Admin:** Selesai (`EnsureUserIsAdmin.php`, rute `/admin/validasi-mitra` terlindungi dengan HTTP 403 Forbidden untuk non-admin).
- [x] **3. Akun Admin Default & Mitra di Seeder:** Selesai (`DatabaseSeeder.php`, `admin@pariwisatalampung.go.id` / `admin123` & `mitra@pariwisatalampung.go.id` / `mitra123`).
- [x] **4. Dukungan UUID & Slug di Detail Destinasi:** Selesai (`DestinationController.php`, mendukung lookup via UUID maupun slug).
- [x] **5. Endpoint Kategori REST API (`GET /api/v1/categories`):** Selesai (`CategoryController.php`, `routes/api.php`).
- [x] **6. Standardisasi Respon Error JSON 404:** Selesai (`bootstrap/app.php`, mengembalikan `{"status":"error","message":"...","data":null}`).
- [x] **7. Pembersihan Duplikasi Middleware:** Selesai (`bootstrap/app.php`).
- [x] **8. Feature Tests REST API:** Selesai (`DestinationApiTest.php`, 7 test skenario lulus).
- [x] **9. Feature Tests Admin Validation:** Selesai (`BusinessValidationTest.php`, 6 test skenario lulus).
- [x] **10. Integrasi Data Dinamis ke Halaman React:** Selesai (Rute `/` dan `/destinations` kini menyuplai data dinamis destinasi, kategori, dan statistik database ke `Index.jsx` & `Destinations/Index.jsx`).
- [x] **11. Notifikasi Email Validasi Mitra Usaha:** Selesai (`PartnerValidationNotification.php` otomatis mengirim email saat mitra disetujui atau ditolak dengan alasan penolakan).
- [ ] **12. CRUD Destinasi Admin & File Upload Storage:** Lanjutan operasional.

