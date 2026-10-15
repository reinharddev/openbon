"use client";

import Link from "next/link";
import { useState } from "react";
import FilePicker from "./FilePicker";

const MAX_FRAMES = 10;
const MAX_BYTES = 2 * 1024 * 1024;

type Created = { slug: string; editKey: string };

const inputClass = "w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm";

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
		<label
			className={`flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
				checked ? "border-accent" : "border-border hover:border-muted"
			}`}
		>
			<input type="radio" name="visibility" checked={checked} onChange={onSelect} className="sr-only" />
			<span
				aria-hidden="true"
				className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
					checked ? "border-accent" : "border-muted"
				}`}
			>
				{checked ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
			</span>
			<span>
				<span className="block font-medium">{title}</span>
				<span className="block text-muted">{body}</span>
			</span>
		</label>
	);
}

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
			setError(`Up to ${MAX_FRAMES} frames per campaign.`);
			return;
		}
		if (next.some((f) => f.type !== "image/png")) {
			setError("Frames must be PNG files.");
			return;
		}
		if (next.some((f) => f.size > MAX_BYTES)) {
			setError("Each frame must be 2 MB or smaller.");
			return;
		}
		setError(null);
		setFiles(next);
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (files.length === 0) {
			setError("Upload at least one PNG frame.");
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
				setError(data.error ?? "Failed to create the campaign.");
				return;
			}
			try {
				localStorage.setItem(`openbon:key:${data.slug}`, data.editKey);
			} catch {}
			setCreated({ slug: data.slug, editKey: data.editKey });
		} catch {
			setError("Could not reach the server. Please try again.");
		} finally {
			setBusy(false);
		}
	}

	if (created) {
		const shareUrl = `${window.location.origin}/c/${created.slug}`;
		return (
			<div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5">
				<h2 className="text-lg font-semibold">Campaign created</h2>
				<div>
					<p className="mb-1 text-sm font-medium">Share link</p>
					<input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} className={inputClass} />
				</div>
				<div>
					<p className="mb-1 text-sm font-medium">Edit key (keep it safe)</p>
					<input
						readOnly
						value={created.editKey}
						onFocus={(e) => e.currentTarget.select()}
						className={`${inputClass} font-mono`}
					/>
					<p className="mt-1 text-xs text-muted">
						This key is needed to delete the campaign and cannot be recovered if lost.
					</p>
				</div>
				<div className="flex flex-wrap gap-3">
					<Link
						href={`/c/${created.slug}`}
						className="rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground hover:opacity-90"
					>
						Open campaign
					</Link>
					<Link
						href={`/manage/${created.slug}`}
						className="rounded-md border border-border px-4 py-2 font-medium hover:bg-background"
					>
						Manage
					</Link>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-5">
			<div>
				<label htmlFor="title" className="mb-1 block text-sm font-medium">
					Title
				</label>
				<input
					id="title"
					required
					maxLength={80}
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className={inputClass}
					placeholder="e.g. Community Cleanup Day"
				/>
			</div>

			<div>
				<label htmlFor="description" className="mb-1 block text-sm font-medium">
					Description <span className="font-normal text-muted">(optional)</span>
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
					Frames (transparent PNG, up to {MAX_FRAMES} files, 2 MB each)
				</label>
				<FilePicker
					id="frames"
					accept="image/png"
					multiple
					buttonLabel="Choose frames"
					status={files.length > 0 ? `${files.length} file(s) selected` : "No file chosen"}
					onFiles={onFiles}
				/>
				<p className="mt-1 text-xs text-muted">Size 200 to 2048 px. Square (1:1) works best.</p>
			</div>

			<fieldset>
				<legend className="mb-2 text-sm font-medium">Visibility</legend>
				<div className="grid gap-3 sm:grid-cols-2">
					<Choice
						checked={visibility === "unlisted"}
						onSelect={() => setVisibility("unlisted")}
						title="Anyone with the link"
						body="Not listed on Explore or in search engines."
					/>
					<Choice
						checked={visibility === "public"}
						onSelect={() => setVisibility("public")}
						title="Public"
						body="Listed on the Explore page."
					/>
				</div>
			</fieldset>

			<div>
				<label htmlFor="slug" className="mb-1 block text-sm font-medium">
					Custom link <span className="font-normal text-muted">(optional)</span>
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
				className="rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:opacity-50"
			>
				{busy ? "Saving..." : "Create campaign"}
			</button>
		</form>
	);
}
