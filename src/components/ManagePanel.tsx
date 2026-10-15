"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { confettiBurst } from "@/lib/fx";
import FilePicker from "./FilePicker";
import { useI18n } from "./I18nProvider";

const MAX_FRAMES = 10;
const MAX_BYTES = 2 * 1024 * 1024;

type Details = {
	slug: string;
	title: string;
	description: string;
	caption: string;
	visibility: "public" | "unlisted";
	uses: number;
	frames: { id: string; width: number; height: number; position: number }[];
};

export default function ManagePanel({ slug }: { slug: string }) {
	const { t } = useI18n();
	const [key, setKey] = useState("");
	const [details, setDetails] = useState<Details | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [confirming, setConfirming] = useState(false);

	// Editable copies.
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [caption, setCaption] = useState("");
	const [visibility, setVisibility] = useState<"public" | "unlisted">("unlisted");
	const [removed, setRemoved] = useState<string[]>([]);
	const [added, setAdded] = useState<File[]>([]);
	const [addedUrls, setAddedUrls] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [savedAt, setSavedAt] = useState(0);
	const saveRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(`openbon:key:${slug}`);
			if (saved) {
				setKey(saved);
				void load(saved);
			}
		} catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug]);

	useEffect(() => {
		const urls = added.map((f) => URL.createObjectURL(f));
		setAddedUrls(urls);
		return () => urls.forEach((u) => URL.revokeObjectURL(u));
	}, [added]);

	async function load(k: string) {
		const value = k.trim();
		if (!value) return;
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/campaigns/${slug}/details`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ key: value }),
			});
			if (!res.ok) {
				setDetails(null);
				setError(t("manage.loadFail"));
				return;
			}
			const data = (await res.json()) as Details;
			setDetails(data);
			setTitle(data.title);
			setDescription(data.description);
			setCaption(data.caption);
			setVisibility(data.visibility);
			setRemoved([]);
			setAdded([]);
			try {
				localStorage.setItem(`openbon:key:${slug}`, value);
			} catch {}
		} catch {
			setError(t("manage.errNet"));
		} finally {
			setLoading(false);
		}
	}

	function onAddFiles(list: FileList | null) {
		const next = Array.from(list ?? []);
		if (next.length === 0) return;
		if (next.some((f) => f.type !== "image/png")) return setError(t("create.errPng"));
		if (next.some((f) => f.size > MAX_BYTES)) return setError(t("create.errSize"));
		setError(null);
		setAdded((prev) => [...prev, ...next].slice(0, MAX_FRAMES));
	}

	function toggleRemove(id: string) {
		setRemoved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	}

	const keptCount = details ? details.frames.length - removed.length : 0;
	const total = keptCount + added.length;

	async function onSave() {
		if (!details) return;
		if (total < 1) return setError(t("manage.errMin"));
		if (total > MAX_FRAMES) return setError(t("create.errMax", { n: MAX_FRAMES }));
		setSaving(true);
		setError(null);
		const body = new FormData();
		body.set("title", title);
		body.set("description", description);
		body.set("caption", caption);
		body.set("visibility", visibility);
		body.set("removeFrames", JSON.stringify(removed));
		for (const f of added) body.append("addFrames", f);
		try {
			const res = await fetch(`/api/campaigns/${slug}`, { method: "PATCH", headers: { "x-edit-key": key.trim() }, body });
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				setError(data.error ?? t("manage.saveFail"));
				return;
			}
			setSavedAt(Date.now());
			const r = saveRef.current?.getBoundingClientRect();
			if (r) confettiBurst(r.left + r.width / 2, r.top, 30);
			await load(key);
		} catch {
			setError(t("manage.errNet"));
		} finally {
			setSaving(false);
		}
	}

	async function onDelete() {
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`/api/campaigns/${slug}`, { method: "DELETE", headers: { "x-edit-key": key } });
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				setError(data.error ?? t("manage.errFail"));
				return;
			}
			try {
				localStorage.removeItem(`openbon:key:${slug}`);
			} catch {}
			setDeleted(true);
		} catch {
			setError(t("manage.errNet"));
		} finally {
			setBusy(false);
		}
	}

	if (deleted) {
		return (
			<div className="flex flex-col items-start gap-3">
				<p>{t("manage.deleted")}</p>
				<Link href="/" className="btn btn-ghost">
					{t("nf.home")}
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<Link href={`/c/${slug}`} className="tap font-bold text-accent-ink underline">
					/c/{slug}
				</Link>
			</div>

			<form
				className="flex flex-col gap-2"
				onSubmit={(e) => {
					e.preventDefault();
					void load(key);
				}}
			>
				<label htmlFor="key" className="block text-sm font-extrabold">
					{t("manage.key")}
				</label>
				<div className="flex flex-wrap gap-3">
					<input
						id="key"
						value={key}
						onChange={(e) => setKey(e.target.value)}
						className="field min-w-0 flex-1 font-mono"
						placeholder={t("manage.keyPh")}
						autoComplete="off"
						spellCheck={false}
					/>
					{!details ? (
						<button type="submit" disabled={loading || !key.trim()} className="btn btn-lime">
							{loading ? t("manage.finderBusy") : t("manage.load")}
						</button>
					) : null}
				</div>
			</form>

			{error ? <p className="text-sm text-danger">{error}</p> : null}

			{details ? (
				<section className="card card-lime flex flex-col gap-5 p-5" aria-labelledby="edit-title">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<h2 id="edit-title" className="text-xl font-extrabold">
							{t("manage.editTitle")}
						</h2>
						<span className="chip chip-violet -rotate-1">{t("c.used", { n: details.uses })}</span>
					</div>

					<div>
						<label htmlFor="e-title" className="mb-1 block text-sm font-extrabold">
							{t("create.fTitle")}
						</label>
						<input id="e-title" className="field" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} />
					</div>

					<div>
						<label htmlFor="e-desc" className="mb-1 block text-sm font-extrabold">
							{t("create.fDesc")} <span className="font-normal text-muted">{t("create.optional")}</span>
						</label>
						<textarea
							id="e-desc"
							className="field"
							rows={3}
							maxLength={300}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div>
						<label htmlFor="e-caption" className="mb-1 block text-sm font-extrabold">
							{t("create.fCaption")} <span className="font-normal text-muted">{t("create.optional")}</span>
						</label>
						<textarea
							id="e-caption"
							className="field"
							rows={4}
							maxLength={1000}
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder={t("create.fCaptionPh")}
						/>
						<p className="mt-1 text-xs text-muted">{t("create.fCaptionHint")}</p>
					</div>

					<fieldset>
						<legend className="mb-2 text-sm font-extrabold">{t("create.visibility")}</legend>
						<div className="grid gap-3 sm:grid-cols-2">
							{(
								[
									["unlisted", t("create.vUnlisted"), t("create.vUnlistedBody")],
									["public", t("create.vPublic"), t("create.vPublicBody")],
								] as const
							).map(([value, label, body]) => (
								<button
									key={value}
									type="button"
									aria-pressed={visibility === value}
									data-on={visibility === value}
									onClick={() => setVisibility(value)}
									className="choice flex-col items-start text-left"
								>
									<span className="block font-extrabold">{label}</span>
									<span className="block text-muted">{body}</span>
								</button>
							))}
						</div>
					</fieldset>

					<div>
						<p className="mb-2 text-sm font-extrabold">
							{t("manage.frames")} <span className="font-normal text-muted">({total}/{MAX_FRAMES})</span>
						</p>
						<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{details.frames.map((f) => {
								const off = removed.includes(f.id);
								return (
									<li key={f.id} className="min-w-0">
										<div
											className="checker relative overflow-hidden rounded-lg border-2 border-border"
											style={{ aspectRatio: `${f.width} / ${f.height}`, opacity: off ? 0.35 : 1 }}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={`/api/frames/${f.id}`} alt="" className="absolute inset-0 h-full w-full object-contain" />
										</div>
										<div className="mt-1 flex items-center justify-between gap-2 text-xs">
											<span className="truncate text-muted">
												{f.width}×{f.height}
											</span>
											<button type="button" onClick={() => toggleRemove(f.id)} className="tap font-bold underline">
												{off ? t("manage.undo") : t("manage.remove")}
											</button>
										</div>
									</li>
								);
							})}
							{added.map((f, i) => (
								<li key={`${f.name}-${i}`} className="min-w-0">
									<div className="checker relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-border">
										{addedUrls[i] ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img src={addedUrls[i]} alt="" className="absolute inset-0 h-full w-full object-contain" />
										) : null}
									</div>
									<div className="mt-1 flex items-center justify-between gap-2 text-xs">
										<span className="truncate text-accent-ink">{t("manage.newFrame")}</span>
										<button
											type="button"
											onClick={() => setAdded((prev) => prev.filter((_, j) => j !== i))}
											className="tap font-bold underline"
										>
											{t("manage.remove")}
										</button>
									</div>
								</li>
							))}
						</ul>
						<div className="mt-3">
							<FilePicker
								id="e-add"
								accept="image/png"
								multiple
								buttonLabel={t("manage.addFrames")}
								status={t("create.sizeHint")}
								onFiles={onAddFiles}
							/>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<button ref={saveRef} type="button" onClick={onSave} disabled={saving || !title.trim()} className="btn btn-lime">
							{saving ? t("create.saving") : t("manage.save")}
						</button>
						{savedAt > 0 && !saving ? <span className="chip chip-pink -rotate-1">{t("manage.savedOk")}</span> : null}
					</div>
				</section>
			) : null}

			{confirming ? (
				<div className="card card-pink flex flex-col gap-3 p-4">
					<p className="text-sm">{t("manage.confirm")}</p>
					<div className="flex gap-3">
						<button type="button" onClick={onDelete} disabled={busy} className="btn btn-danger btn-sm">
							{busy ? t("manage.deleting") : t("manage.yes")}
						</button>
						<button type="button" onClick={() => setConfirming(false)} className="btn btn-ghost btn-sm">
							{t("manage.cancel")}
						</button>
					</div>
				</div>
			) : (
				<div>
					<button type="button" onClick={() => setConfirming(true)} disabled={!key} className="btn btn-danger">
						{t("manage.delete")}
					</button>
				</div>
			)}
		</div>
	);
}
