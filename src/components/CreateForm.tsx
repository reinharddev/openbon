"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { confettiBurst } from "@/lib/fx";
import { useI18n } from "./I18nProvider";
import FramePreview from "./FramePreview";
import { makeTemplateBlob, SIZE_PRESETS } from "@/lib/presets";
import Sticker from "./Sticker";
import FilePicker from "./FilePicker";

const MAX_FRAMES = 10;
const MAX_BYTES = 2 * 1024 * 1024;

type Created = { slug: string; editKey: string };

const inputClass = "field";

function Choice({
	checked,
	onSelect,
	title,
	body,
}: {
	checked: boolean;
	onSelect: () => void;
	title: string;
	body: string;
}) {
	return (
		<label className="choice" data-on={checked}>
			<input type="radio" name="visibility" checked={checked} onChange={onSelect} className="sr-only" />
			<span
				aria-hidden="true"
				className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-border"
			>
				{checked ? <span className="h-2 w-2 rounded-full bg-border" /> : null}
			</span>
			<span>
				<span className="block font-extrabold">{title}</span>
				<span className="block text-muted">{body}</span>
			</span>
		</label>
	);
}

export default function CreateForm() {
	const { t, locale } = useI18n();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [caption, setCaption] = useState("");
	const [visibility, setVisibility] = useState<"unlisted" | "public">("unlisted");
	const [slug, setSlug] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [presetId, setPresetId] = useState("square");
	const preset = SIZE_PRESETS.find((x) => x.id === presetId) ?? SIZE_PRESETS[0];

	async function downloadTemplate() {
		const blob = await makeTemplateBlob(preset);
		if (!blob) return;
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `openbon-template-${preset.w}x${preset.h}.png`;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 10_000);
	}
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [created, setCreated] = useState<Created | null>(null);
	const doneRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!created || !doneRef.current) return;
		const r = doneRef.current.getBoundingClientRect();
		confettiBurst(r.left + r.width / 2, r.top + 40, 44);
	}, [created]);

	function onFiles(list: FileList | null) {
		const next = Array.from(list ?? []);
		if (next.length > MAX_FRAMES) {
			setError(t("create.errMax", { n: MAX_FRAMES }));
			return;
		}
		if (next.some((f) => f.type !== "image/png")) {
			setError(t("create.errPng"));
			return;
		}
		if (next.some((f) => f.size > MAX_BYTES)) {
			setError(t("create.errSize"));
			return;
		}
		setError(null);
		setFiles(next);
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (files.length === 0) {
			setError(t("create.errNone"));
			return;
		}
		setBusy(true);
		setError(null);

		const body = new FormData();
		body.set("title", title);
		body.set("description", description);
		body.set("caption", caption);
		body.set("visibility", visibility);
		if (slug.trim()) body.set("slug", slug.trim().toLowerCase());
		for (const f of files) body.append("frames", f);

		try {
			const res = await fetch("/api/campaigns", { method: "POST", body });
			const data = (await res.json()) as Created & { error?: string };
			if (!res.ok) {
				setError(data.error ?? t("create.errFail"));
				return;
			}
			try {
				localStorage.setItem(`openbon:key:${data.slug}`, data.editKey);
			} catch {}
			setCreated({ slug: data.slug, editKey: data.editKey });
		} catch {
			setError(t("create.errNet"));
		} finally {
			setBusy(false);
		}
	}

	if (created) {
		const shareUrl = `${window.location.origin}/c/${created.slug}`;
		return (
			<div ref={doneRef} className="card card-lime done-pop flex flex-col gap-5 p-5">
				<div className="flex items-center gap-3">
					<svg viewBox="0 0 48 48" className="done-check h-12 w-12 shrink-0" aria-hidden="true">
						<circle cx="24" cy="24" r="21" fill="var(--accent)" stroke="var(--border)" strokeWidth="3" />
						<path
							pathLength={1}
							d="m14 25 7 7 14-16"
							fill="none"
							stroke="#0c0c0d"
							strokeWidth="4.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div>
						<h2 className="text-xl font-extrabold">{t("create.liveTitle")}</h2>
						<p className="text-sm text-muted">{t("create.liveBody")}</p>
					</div>
					<Sticker name="free" tilt={10} className="sticker-in ml-auto hidden w-16 shrink-0 sm:block" />
				</div>
				<div>
					<p className="mb-1 text-sm font-extrabold">{t("create.shareLink")}</p>
					<input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} className={inputClass} />
				</div>
				<div>
					<p className="mb-1 text-sm font-extrabold">{t("create.editKey")}</p>
					<input
						readOnly
						value={created.editKey}
						onFocus={(e) => e.currentTarget.select()}
						className={`${inputClass} font-mono`}
					/>
					<p className="mt-1 text-xs text-muted">
						{t("create.editKeyHint")}
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/c/${created.slug}`}
						className="btn btn-lime"
					>
						{t("create.open")}
					</Link>
					<Link
						href={`/manage/${created.slug}`}
						className="btn btn-ghost"
					>
						{t("create.manage")}
					</Link>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-5">
			<div>
				<label htmlFor="title" className="mb-1 block text-sm font-extrabold">
					{t("create.fTitle")}
				</label>
				<input
					id="title"
					required
					maxLength={80}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className={inputClass}
					placeholder={t("create.fTitlePh")}
				/>
			</div>

			<div>
				<label htmlFor="description" className="mb-1 block text-sm font-extrabold">
					{t("create.fDesc")} <span className="font-normal text-muted">{t("create.optional")}</span>
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
				<label htmlFor="caption" className="mb-1 block text-sm font-extrabold">
					{t("create.fCaption")} <span className="font-normal text-muted">{t("create.optional")}</span>
				</label>
				<textarea
					id="caption"
					maxLength={1000}
					rows={4}
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
					className={inputClass}
					placeholder={t("create.fCaptionPh")}
				/>
				<p className="mt-1 text-xs text-muted">
					{t("create.fCaptionHint")}
				</p>
			</div>

			<fieldset>
				<legend className="mb-1 text-sm font-extrabold">{t("create.sizeTitle")}</legend>
				<p className="mb-3 text-xs text-muted">{t("create.sizeSub")}</p>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{SIZE_PRESETS.map((p) => {
						const on = p.id === presetId;
						const max = 36;
						const bw = p.w >= p.h ? max : Math.round((max * p.w) / p.h);
						const bh = p.h >= p.w ? max : Math.round((max * p.h) / p.w);
						return (
							<button
								key={p.id}
								type="button"
								aria-pressed={on}
								onClick={() => setPresetId(p.id)}
								className="choice flex-col items-start"
								data-on={on}
							>
								<span className="flex h-10 items-center">
									<span
										aria-hidden="true"
										className="block rounded-[4px] border-2 border-border bg-accent"
										style={{ width: bw, height: Math.max(bh, 10) }}
									/>
								</span>
								<span className="block text-left text-sm font-extrabold">
									{p.ratio} · {p.w}×{p.h}
								</span>
								<span className="block text-left text-xs text-muted">{t(p.labelKey as never)}</span>
							</button>
						);
					})}
				</div>
				<div className="mt-3 flex flex-wrap items-center gap-3">
					<button type="button" onClick={downloadTemplate} className="btn btn-ghost btn-sm">
						{t("create.templateBtn", { size: `${preset.w}×${preset.h}` })}
					</button>
					<span className="text-xs text-muted">{t("create.templateHint")}</span>
				</div>
			</fieldset>

			<div>
				<label htmlFor="frames" className="mb-1 block text-sm font-extrabold">
					{t("create.fFrames", { n: MAX_FRAMES })}
				</label>
				<FilePicker
					id="frames"
					accept="image/png"
					multiple
					buttonLabel={t("create.chooseFrames")}
					status={files.length > 0 ? t("create.filesSelected", { n: files.length }) : t("create.noFile")}
					onFiles={onFiles}
				/>
				<p className="mt-1 text-xs text-muted">{t("create.sizeHint")}</p>
				<FramePreview files={files} presetW={preset.w} presetH={preset.h} />
			</div>

			<fieldset>
				<legend className="mb-2 text-sm font-extrabold">{t("create.visibility")}</legend>
				<div className="grid gap-3 sm:grid-cols-2">
					<Choice
						checked={visibility === "unlisted"}
						onSelect={() => setVisibility("unlisted")}
						title={t("create.vUnlisted")}
						body={t("create.vUnlistedBody")}
					/>
					<Choice
						checked={visibility === "public"}
						onSelect={() => setVisibility("public")}
						title={t("create.vPublic")}
						body={t("create.vPublicBody")}
					/>
				</div>
			</fieldset>

			<div>
				<label htmlFor="slug" className="mb-1 block text-sm font-extrabold">
					{t("create.fSlug")} <span className="font-normal text-muted">{t("create.optional")}</span>
				</label>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted">/c/</span>
					<input
						id="slug"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						pattern="[a-z0-9][a-z0-9\-]{1,38}[a-z0-9]"
						className={inputClass}
						placeholder="community-cleanup-day"
					/>
				</div>
			</div>

			{error ? <p className="text-sm text-danger">{error}</p> : null}

			<button
				type="submit"
				disabled={busy}
				className="btn btn-lime w-full"
			>
				{busy ? t("create.saving") : t("create.submit")}
			</button>
		</form>
	);
}
