# Panduan Bulk Upload & Optimize

## Fitur Baru ✨

Landing page sekarang dilengkapi dengan fitur **Bulk Upload & Optimize** yang memungkinkan Anda:

- ✅ Upload hingga **10 gambar sekaligus**
- ✅ Optimasi otomatis dengan target **400KB per gambar**
- ✅ Preview hasil optimasi dengan persentase penghematan
- ✅ Download individual atau **download semua** hasil sekaligus
- ✅ Format support: JPG, PNG, WebP (auto-convert ke JPEG)

## Cara Menggunakan

### 1. Akses Landing Page

```bash
npm run dev
```

Buka browser: `http://localhost:3000`

### 2. Upload Gambar

1. Klik tombol **"Pilih Gambar (Max 10)"**
2. Pilih 1-10 gambar dari komputer Anda
3. Preview akan muncul menampilkan nama dan ukuran file
4. Klik **"✨ Upload & Optimize"**

### 3. Lihat Hasil

Setelah proses selesai, Anda akan melihat:
- ✅ Status setiap gambar (berhasil/gagal)
- 📊 Ukuran original vs optimized
- 💾 Persentase penghematan
- 📥 Tombol download per gambar
- 📥 Tombol "Download Semua" untuk download bulk

### 4. Download Hasil

**Download Individual:**
- Klik tombol "📥 Download" pada gambar yang diinginkan

**Download Semua:**
- Klik tombol "📥 Download Semua" di bagian atas hasil

## Spesifikasi Teknis

### Batasan
- **Max files**: 10 gambar per upload
- **Max size**: 50MB per file
- **Format**: JPEG, JPG, PNG, WebP

### Optimasi
- **Target size**: 400KB per gambar
- **Max dimension**: 2000px (width/height)
- **Quality**: 70-95 (auto-adjusted)
- **Output format**: JPEG (mozjpeg)

### Lokasi File
- **Upload temp**: `./temp-uploads/`
- **Output**: `./public/images/optimized/`
- **Access URL**: `/images/optimized/[filename].jpg`

## API Endpoint

### POST `/api/bulk-optimize`

**Request:**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('images', file));

const response = await fetch('/api/bulk-optimize', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "message": "Processed 3 of 3 images",
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  },
  "results": [
    {
      "success": true,
      "originalName": "photo.jpg",
      "fileName": "1234567890-abc123.jpg",
      "downloadUrl": "/images/optimized/1234567890-abc123.jpg",
      "originalSize": 2048576,
      "optimizedSize": 335872,
      "savedBytes": 1712704,
      "savedPercent": 84
    }
  ]
}
```

## Troubleshooting

### Error: "Maximum 10 files allowed"
- Anda memilih lebih dari 10 gambar
- Solusi: Pilih maksimal 10 gambar

### Error: "File too large"
- Salah satu file melebihi 50MB
- Solusi: Kompres file terlebih dahulu atau pilih file yang lebih kecil

### Error: "Invalid file type"
- Format file tidak didukung
- Solusi: Gunakan format JPG, PNG, atau WebP

### Gambar tidak ter-download
- Pastikan browser mengizinkan multiple downloads
- Cek popup blocker di browser Anda

## Tips & Trik

### Untuk Hasil Terbaik:
1. **Upload gambar berkualitas tinggi** - sistem akan mengoptimalkan secara otomatis
2. **Gunakan format asli** - PNG/WebP akan dikonversi ke JPEG
3. **Batch processing** - upload 10 gambar sekaligus untuk efisiensi

### Performa:
- Proses optimasi: ~2-5 detik per gambar
- Total waktu untuk 10 gambar: ~20-50 detik
- Bergantung pada ukuran dan resolusi gambar

## Dokumentasi Lengkap

Lihat dokumentasi API lengkap di: `docs/API.md`

## Support

Jika ada masalah atau pertanyaan:
1. Cek console browser untuk error details
2. Lihat `logs/optimization.log` untuk server logs
3. Review `ARCHITECTURE.md` untuk system design
