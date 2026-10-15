"use client";

import Link from "next/link";
import { useState } from "react";

const MAX_FRAMES = 10;
const MAX_BYTES = 2 * 1024 * 1024;

type Created = { slug: string; editKey: string };

const inputClass = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm";

export default function CreateForm() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState<"unlisted" | "public">("unlisted");
	const [slug, setSlug] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [created, setCreated] = useState<Created | null>(null);

	function onFiles(list: FileList | null) {
		const next = Array.from(list ?? []);
		if (next.length > MAX_FRAMES) {
			setError(`Maksimal ${MAX_FRAMES} frame per kampanye.`);
			return;
		}
		if (next.some((f) => f.type !== "image/png")) {
			setError("Frame harus berupa file PNG.");
			return;
		}
		if (next.some((f) => f.size > MAX_BYTES)) {
			setError("Setiap frame maksimal 2 MB.");
			return;
		}
		setError(null);
		setFiles(next);
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (files.length === 0) {
			setError("Unggah minimal satu frame PNG.");
			return;
		}
		setBusy(true);
		setError(null);

		const body = new FormData();
		body.set("title", title);
		body.set("description", description);
		body.set("visibility", visibility);
		if (slug.trim()) body.set("slug", slug.trim().toLowerCase());
		for (const f of files) body.append("frames", f);

		try {
			const res = await fetch("/api/campaigns", { method: "POST", body });
			const data = (await res.json()) as Created & { error?: string };
			if (!res.ok) {
				setError(data.error ?? "Gagal membuat kampanye.");
				return;
			}
			try {
				localStorage.setItem(`openbon:key:${data.slug}`, data.editKey);
			} catch {}
			setCreated({ slug: data.slug, editKey: data.editKey });
		} catch {
			setError("Tidak bisa terhubung ke server. Coba lagi.");
		} finally {
			setBusy(false);
		}
	}

	if (created) {
		const shareUrl = `${window.location.origin}/c/${created.slug}`;
		return (
			<div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5">
				<h2 className="text-lg font-semibold">Kampanye berhasil dibuat</h2>
				<div>
					<p className="mb-1 text-sm font-medium">Link untuk dibagikan</p>
					<input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} className={inputClass} />
				</div>
				<div>
					<p className="mb-1 text-sm font-medium">Kunci edit (simpan baik-baik)</p>
					<input
						readOnly
						value={created.editKey}
						onFocus={(e) => e.currentTarget.select()}
						className={`${inputClass} font-mono`}
					/>
					<p className="mt-1 text-xs text-muted">
						Kunci ini dipakai untuk menghapus kampanye dan tidak bisa dipulihkan kalau hilang.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/c/${created.slug}`}
						className="rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground hover:opacity-90"
					>
						Buka kampanye
					</Link>
					<Link
						href={`/manage/${created.slug}`}
						className="rounded-md border border-border px-4 py-2 font-medium hover:bg-background"
					>
						Kelola
					</Link>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-5">
			<div>
				<label htmlFor="title" className="mb-1 block text-sm font-medium">
					Judul
				</label>
				<input
					id="title"
					required
					maxLength={80}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className={inputClass}
					placeholder="Contoh: Dies Natalis SMA Citra Berkat"
				/>
			</div>

			<div>
				<label htmlFor="description" className="mb-1 block text-sm font-medium">
					Deskripsi <span className="font-normal text-muted">(opsional)</span>
				</label>
				<textarea
					id="description"
					maxLength={300}
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className={inputClass}
				/>
			</div>

			<div>
				<label htmlFor="frames" className="mb-1 block text-sm font-medium">
					Frame (PNG transparan, maks. {MAX_FRAMES} file, 2 MB per file)
				</label>
				<input
					id="frames"
					type="file"
					accept="image/png"
					multiple
					onChange={(e) => onFiles(e.target.files)}
					className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-medium file:text-accent-foreground"
				/>
				{files.length > 0 ? <p className="mt-1 text-xs text-muted">{files.length} file dipilih</p> : null}
				<p className="mt-1 text-xs text-muted">Ukuran 200 sampai 2048 piksel. Rasio persegi (1:1) paling cocok.</p>
			</div>

			<fieldset>
				<legend className="mb-1 text-sm font-medium">Visibilitas</legend>
				<div className="flex flex-col gap-2 text-sm">
					<label className="flex items-start gap-2">
						<input
							type="radio"
							name="visibility"
							checked={visibility === "unlisted"}
							onChange={() => setVisibility("unlisted")}
							className="mt-1"
						/>
						<span>
							<span className="font-medium">Hanya yang punya link</span>
							<span className="block text-muted">Tidak muncul di halaman Jelajahi dan mesin pencari.</span>
						</span>
					</label>
					<label className="flex items-start gap-2">
						<input
							type="radio"
							name="visibility"
							checked={visibility === "public"}
							onChange={() => setVisibility("public")}
							className="mt-1"
						/>
						<span>
							<span className="font-medium">Publik</span>
							<span className="block text-muted">Tampil di halaman Jelajahi.</span>
						</span>
					</label>
				</div>
			</fieldset>

			<div>
				<label htmlFor="slug" className="mb-1 block text-sm font-medium">
					Link khusus <span className="font-normal text-muted">(opsional)</span>
				</label>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted">/c/</span>
					<input
						id="slug"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						pattern="[a-z0-9][a-z0-9\-]{1,38}[a-z0-9]"
						className={inputClass}
						placeholder="dies-natalis-2026"
					/>
				</div>
			</div>

			{error ? <p className="text-sm text-danger">{error}</p> : null}

			<button
				type="submit"
				disabled={busy}
				className="rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
			>
				{busy ? "Menyimpan..." : "Buat kampanye"}
			</button>
		</form>
	);
}
