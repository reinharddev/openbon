import Link from "next/link";

const steps = [
	{ title: "Unggah frame", body: "Upload PNG transparan. Satu kampanye boleh punya sampai 10 frame." },
	{ title: "Bagikan link", body: "Kirim link ke teman, kelas, atau komunitas. Mereka tidak perlu akun." },
	{ title: "Pasang foto", body: "Peserta memilih foto, mengatur posisi, lalu mengunduh hasilnya." },
];

export default function Home() {
	return (
		<div className="flex flex-col gap-14">
			<section className="flex flex-col items-start gap-5 pt-6">
				<h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
					Twibbon gratis, tanpa watermark.
				</h1>
				<p className="max-w-xl text-lg text-muted">
					OpenBon adalah alternatif open source untuk bikin frame foto kampanye. Tanpa iklan, tanpa batasan
					fitur berbayar, dan foto pengguna tidak pernah meninggalkan browser.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/create"
						className="rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground hover:opacity-90"
					>
						Buat kampanye
					</Link>
					<Link href="/explore" className="rounded-md border border-border px-4 py-2.5 font-medium hover:bg-surface">
						Lihat kampanye publik
					</Link>
				</div>
			</section>

			<section>
				<h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-muted">Cara kerja</h2>
				<ol className="grid gap-4 sm:grid-cols-3">
					{steps.map((step, i) => (
						<li key={step.title} className="rounded-lg border border-border bg-surface p-5">
							<p className="mb-2 text-sm text-muted">Langkah {i + 1}</p>
							<h3 className="mb-1 font-semibold">{step.title}</h3>
							<p className="text-sm text-muted">{step.body}</p>
						</li>
					))}
				</ol>
			</section>
		</div>
	);
}
