# OpenBon

Alternatif open source untuk twibbon: bikin dan pakai frame foto kampanye secara gratis.

- Tanpa watermark, tanpa iklan, tanpa batasan fitur berbayar
- Foto peserta diproses 100% di browser dan tidak pernah diunggah
- Tanpa pelacakan (hanya satu angka anonim "dipakai N kali" per kampanye)
- Peserta tidak perlu akun; pembuat kampanye mendapat link dan kunci edit

## Stack

Next.js (App Router) di Cloudflare Workers via [OpenNext](https://opennext.js.org/cloudflare),
database Cloudflare D1, penyimpanan frame di Cloudflare R2.

## Menjalankan lokal

```bash
npm install
npx wrangler d1 migrations apply openbon --local
npm run dev
```

Buka http://localhost:3000.

## Deploy ke Cloudflare

```bash
npx wrangler d1 create openbon          # salin database_id ke wrangler.jsonc
npx wrangler r2 bucket create openbon-frames
npx wrangler d1 migrations apply openbon --remote
npm run deploy
```

Variabel opsional (set saat build, mis. di `.env.local` atau dashboard):

| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_DONATE_URL` | Link donasi (Saweria/Trakteer/Ko-fi). Tombol disembunyikan jika kosong. |
| `NEXT_PUBLIC_REPO_URL` | Link repo GitHub di footer. |

## Moderasi

- Setiap kampanye punya tombol **Laporkan**. Kampanye otomatis disembunyikan setelah 5 laporan.
- Pembuat bisa menghapus kampanyenya dengan kunci edit di `/manage/<slug>`.
- Untuk menyembunyikan manual: `npx wrangler d1 execute openbon --remote --command "UPDATE campaigns SET hidden = 1 WHERE slug = 'xxx'"`.
- Disarankan menambah aturan rate limit di dashboard Cloudflare (WAF) untuk `POST /api/campaigns`.

## Batasan

- Frame: PNG, 200-2048 px, maks 2 MB per file, maks 10 frame per kampanye.
- Visibilitas: publik (muncul di Jelajahi) atau hanya yang punya link.

## Lisensi

AGPL-3.0, lihat berkas `LICENSE`.
