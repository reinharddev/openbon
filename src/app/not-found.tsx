import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-start gap-4 py-10">
			<h1 className="text-2xl font-semibold tracking-tight">Halaman tidak ditemukan</h1>
			<p className="text-muted">Kampanye ini mungkin sudah dihapus, disembunyikan, atau linknya salah.</p>
			<Link href="/" className="rounded-md border border-border px-4 py-2 font-medium hover:bg-surface">
				Kembali ke beranda
			</Link>
		</div>
	);
}
