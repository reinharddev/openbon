import type { Locale } from "@/lib/i18n/dict";

export type LegalSection = { h: string; p: string[] };
export type LegalDoc = { title: string; intro: string; updated: string; sections: LegalSection[] };

/** Tokens: {email} is replaced with the contact address, {site} with the site URL. */
export const terms: Record<Locale, LegalDoc> = {
	en: {
		title: "Terms of use",
		intro: "OpenBon is a free, open source tool for making and using photo frames. By using it you agree to the points below.",
		updated: "Last updated: 15 October 2026",
		sections: [
			{
				h: "What OpenBon is",
				p: [
					"OpenBon lets people upload a transparent PNG frame, share one link, and let others place their own photo behind it. Photos are processed in the visitor's browser and are not uploaded to our servers.",
				],
			},
			{
				h: "What you may upload",
				p: [
					"You may only upload frames and text (title, description, caption) that you made or have the right to use.",
					"Do not upload anything that is illegal, infringes someone's copyright or trademark, impersonates a person or organisation, is hateful or harassing, sexually explicit, or that exposes private information.",
					"You are responsible for the campaigns you create.",
				],
			},
			{
				h: "Reports and removal",
				p: [
					"Anyone can report a campaign with the Report button. A campaign is hidden automatically after several reports and may be removed after review.",
					"We may hide or delete any campaign at any time, without notice, if it breaks these terms or the law.",
					"To report a problem or request removal (for example a copyright complaint), email {email} with the campaign link and what is wrong. Please include enough detail for us to verify your request.",
				],
			},
			{
				h: "Edit key",
				p: [
					"When you create a campaign you receive an edit key. We only store a hash of it and cannot recover it. Anyone holding the key can delete the campaign, so keep it private.",
				],
			},
			{
				h: "No warranty",
				p: [
					"OpenBon is provided \"as is\", free of charge, without any warranty. It may change, be unavailable, or be discontinued. Please keep your own copy of anything important.",
				],
			},
			{
				h: "Open source",
				p: [
					"The OpenBon source code is released under the AGPL-3.0 license. These terms apply to the hosted service at {site}, not to your own self-hosted copy.",
				],
			},
			{
				h: "Contact",
				p: ["Questions about these terms: {email}."],
			},
		],
	},
	id: {
		title: "Syarat penggunaan",
		intro: "OpenBon adalah alat gratis dan open source buat bikin dan memakai bingkai foto. Dengan memakainya, kamu setuju dengan poin-poin di bawah ini.",
		updated: "Terakhir diperbarui: 15 Oktober 2026",
		sections: [
			{
				h: "OpenBon itu apa",
				p: [
					"OpenBon memungkinkan orang mengunggah bingkai PNG transparan, membagikan satu link, lalu orang lain memasang fotonya sendiri di balik bingkai itu. Foto diproses di browser pengunjung dan tidak diunggah ke server kami.",
				],
			},
			{
				h: "Apa yang boleh diunggah",
				p: [
					"Kamu hanya boleh mengunggah bingkai dan teks (judul, deskripsi, caption) yang kamu buat sendiri atau yang kamu punya haknya.",
					"Jangan unggah sesuatu yang melanggar hukum, melanggar hak cipta atau merek orang lain, menyamar sebagai orang atau organisasi, berisi ujaran kebencian atau pelecehan, konten dewasa, atau membuka data pribadi orang.",
					"Kamu bertanggung jawab atas kampanye yang kamu buat.",
				],
			},
			{
				h: "Laporan dan penghapusan",
				p: [
					"Siapa pun bisa melaporkan kampanye lewat tombol Laporkan. Kampanye disembunyikan otomatis setelah beberapa laporan dan bisa dihapus setelah ditinjau.",
					"Kami bisa menyembunyikan atau menghapus kampanye kapan saja, tanpa pemberitahuan, kalau melanggar aturan ini atau hukum.",
					"Untuk melaporkan masalah atau meminta penghapusan (misalnya keluhan hak cipta), kirim email ke {email} dengan link kampanye dan apa masalahnya. Sertakan detail yang cukup supaya kami bisa memverifikasi permintaanmu.",
				],
			},
			{
				h: "Kunci edit",
				p: [
					"Saat membuat kampanye kamu mendapat kunci edit. Kami hanya menyimpan hash-nya dan tidak bisa memulihkannya. Siapa pun yang memegang kunci bisa menghapus kampanye, jadi jaga kerahasiaannya.",
				],
			},
			{
				h: "Tanpa jaminan",
				p: [
					"OpenBon disediakan apa adanya, gratis, tanpa jaminan apa pun. Layanan bisa berubah, tidak tersedia, atau dihentikan. Simpan salinan sendiri untuk hal yang penting.",
				],
			},
			{
				h: "Open source",
				p: [
					"Kode sumber OpenBon dirilis di bawah lisensi AGPL-3.0. Syarat ini berlaku untuk layanan di {site}, bukan untuk salinan yang kamu host sendiri.",
				],
			},
			{
				h: "Kontak",
				p: ["Pertanyaan soal syarat ini: {email}."],
			},
		],
	},
};

export const privacy: Record<Locale, LegalDoc> = {
	en: {
		title: "Privacy policy",
		intro: "Short version: your photo never leaves your device, and there is no tracking.",
		updated: "Last updated: 15 October 2026",
		sections: [
			{
				h: "What stays on your device",
				p: [
					"The photo you pick is placed on the frame by your browser and the finished image is saved straight to your device. It is not uploaded, stored, or seen by us.",
				],
			},
			{
				h: "What we store on the server",
				p: [
					"When a creator makes a campaign we store: the frame image files, the title, description and optional caption, the link (slug), whether it is public or link-only, a hash of the edit key, a creation time, and an anonymous usage counter.",
					"When someone reports a campaign we store the optional reason they typed and a timestamp, with no name or account.",
					"We do not collect names, accounts, email addresses, or photos of visitors.",
				],
			},
			{
				h: "What we do not do",
				p: [
					"No analytics, no advertising, no third-party trackers, and no profiling. The usage counter is a single number per campaign.",
				],
			},
			{
				h: "Your browser's storage",
				p: [
					"We save a few small preferences in your browser: theme, animations on/off, language (a cookie), and, on the device that created a campaign, its edit key so you can manage it later. You can clear these at any time in your browser settings.",
				],
			},
			{
				h: "Hosting",
				p: [
					"OpenBon runs on Cloudflare. Like any host, Cloudflare processes technical request data (such as IP address) to deliver and protect the site. See Cloudflare's own privacy policy for details.",
				],
			},
			{
				h: "Public campaigns",
				p: [
					"Anything you put in a campaign title, description, caption or frame can be seen by anyone who has the link, and by everyone if the campaign is public. Do not include private information.",
				],
			},
			{
				h: "Deleting your data",
				p: [
					"Use your edit key on the Manage page to delete a campaign and its frame files. To ask for removal without the key, email {email}.",
				],
			},
		],
	},
	id: {
		title: "Kebijakan privasi",
		intro: "Singkatnya: fotomu tidak pernah keluar dari perangkatmu, dan tidak ada pelacakan.",
		updated: "Terakhir diperbarui: 15 Oktober 2026",
		sections: [
			{
				h: "Yang tetap di perangkatmu",
				p: [
					"Foto yang kamu pilih ditempelkan ke bingkai oleh browser, dan hasil akhirnya langsung tersimpan di perangkatmu. Foto itu tidak diunggah, tidak disimpan, dan tidak dilihat oleh kami.",
				],
			},
			{
				h: "Yang kami simpan di server",
				p: [
					"Saat pembuat membuat kampanye, kami menyimpan: file gambar bingkai, judul, deskripsi dan caption (opsional), link (slug), status publik atau lewat link saja, hash kunci edit, waktu pembuatan, dan penghitung pemakaian anonim.",
					"Saat seseorang melaporkan kampanye, kami menyimpan alasan yang diketik (opsional) dan waktu, tanpa nama atau akun.",
					"Kami tidak mengumpulkan nama, akun, alamat email, atau foto pengunjung.",
				],
			},
			{
				h: "Yang tidak kami lakukan",
				p: [
					"Tanpa analitik, tanpa iklan, tanpa pelacak pihak ketiga, dan tanpa profiling. Penghitung pemakaian hanyalah satu angka per kampanye.",
				],
			},
			{
				h: "Penyimpanan di browsermu",
				p: [
					"Kami menyimpan beberapa preferensi kecil di browsermu: tema, animasi nyala atau mati, bahasa (cookie), dan, di perangkat yang membuat kampanye, kunci editnya supaya kamu bisa mengaturnya nanti. Kamu bisa menghapusnya kapan saja lewat pengaturan browser.",
				],
			},
			{
				h: "Hosting",
				p: [
					"OpenBon berjalan di Cloudflare. Seperti penyedia hosting lain, Cloudflare memproses data teknis permintaan (seperti alamat IP) untuk mengirim dan melindungi situs. Lihat kebijakan privasi Cloudflare untuk detailnya.",
				],
			},
			{
				h: "Kampanye publik",
				p: [
					"Apa pun yang kamu tulis di judul, deskripsi, caption, atau bingkai kampanye bisa dilihat siapa pun yang punya link, dan semua orang kalau kampanyenya publik. Jangan masukkan informasi pribadi.",
				],
			},
			{
				h: "Menghapus datamu",
				p: [
					"Pakai kunci edit di halaman Atur untuk menghapus kampanye beserta file bingkainya. Untuk meminta penghapusan tanpa kunci, kirim email ke {email}.",
				],
			},
		],
	},
};

export const contact: Record<Locale, LegalDoc> = {
	en: {
		title: "Contact",
		intro: "Questions, feedback, or something that needs to be taken down? Email us.",
		updated: "",
		sections: [
			{
				h: "Email",
				p: ["{email}"],
			},
			{
				h: "Reporting a campaign",
				p: [
					"The quickest way is the Report button on the campaign page. For copyright or legal requests, email us with: the campaign link, what is wrong, and (for copyright) who owns the work and how to reach you.",
				],
			},
			{
				h: "Bugs and ideas",
				p: ["OpenBon is open source. You are welcome to open an issue or pull request on the repository linked in the footer."],
			},
		],
	},
	id: {
		title: "Kontak",
		intro: "Ada pertanyaan, masukan, atau sesuatu yang perlu diturunkan? Kirim email aja.",
		updated: "",
		sections: [
			{
				h: "Email",
				p: ["{email}"],
			},
			{
				h: "Melaporkan kampanye",
				p: [
					"Cara tercepat adalah tombol Laporkan di halaman kampanye. Untuk permintaan hak cipta atau hukum, kirim email berisi: link kampanye, apa masalahnya, dan (untuk hak cipta) siapa pemilik karyanya serta cara menghubungimu.",
				],
			},
			{
				h: "Bug dan ide",
				p: ["OpenBon open source. Silakan buka issue atau pull request di repositori yang ditautkan di footer."],
			},
		],
	},
};
