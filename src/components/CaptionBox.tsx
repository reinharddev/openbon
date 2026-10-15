"use client";

import { useMemo, useRef, useState } from "react";
import { fillCaption, placeholderKeys, splitCaption } from "@/lib/caption";
import { confettiBurst } from "@/lib/fx";

async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		const ta = document.createElement("textarea");
		ta.value = text;
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand("copy");
		ta.remove();
		return ok;
	}
}

/** Shows the creator's caption template; people fill in [placeholders] in a popup and copy the result. */
export default function CaptionBox({ template: creatorTemplate }: { template: string }) {
	const hasCreator = creatorTemplate.trim().length > 0;
	const [mode, setMode] = useState<"creator" | "paste">(hasCreator ? "creator" : "paste");
	const [custom, setCustom] = useState("");
	const template = mode === "creator" ? creatorTemplate : custom;
	const keys = useMemo(() => placeholderKeys(template), [template]);
	const parts = useMemo(() => splitCaption(template), [template]);
	const [values, setValues] = useState<Record<string, string>>({});
	const [copied, setCopied] = useState(false);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const copyRef = useRef<HTMLButtonElement>(null);

	const result = fillCaption(template, values);
	const missing = keys.filter((k) => !values[k]?.trim()).length;

	async function onCopy(source?: HTMLElement | null) {
		const ok = await copyText(result);
		if (!ok) return;
		setCopied(true);
		const r = (source ?? copyRef.current)?.getBoundingClientRect();
		if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 26);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<section aria-labelledby="caption-title" className="card card-pink flex flex-col gap-3 p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 id="caption-title" className="text-lg font-extrabold">
					Caption
				</h2>
				<div className="flex flex-wrap gap-2">
					{keys.length > 0 ? (
						<button type="button" className="btn btn-ghost btn-sm" onClick={() => dialogRef.current?.showModal()}>
							Edit
						</button>
					) : null}
					{template.trim() ? (
						<button ref={copyRef} type="button" className="btn btn-lime btn-sm" onClick={() => onCopy()}>
							{copied ? "Copied!" : "Copy"}
						</button>
					) : null}
				</div>
			</div>

			{hasCreator ? (
				<div className="flex flex-wrap gap-2" role="group" aria-label="Caption source">
					<button
						type="button"
						aria-pressed={mode === "creator"}
						onClick={() => setMode("creator")}
						className={`chip ${mode === "creator" ? "chip-lime" : ""}`}
					>
						From the creator
					</button>
					<button
						type="button"
						aria-pressed={mode === "paste"}
						onClick={() => setMode("paste")}
						className={`chip ${mode === "paste" ? "chip-lime" : ""}`}
					>
						Paste your own
					</button>
				</div>
			) : null}

			{mode === "paste" ? (
				<div>
					<label htmlFor="caption-paste" className="mb-1 block text-sm font-extrabold">
						Paste a caption template
					</label>
					<textarea
						id="caption-paste"
						rows={4}
						maxLength={1000}
						value={custom}
						onChange={(e) => setCustom(e.target.value)}
						className="field"
						placeholder={"Paste a caption that has blanks like [Name] or [Class]. We'll let you fill them in."}
					/>
				</div>
			) : null}

			{template.trim() ? (
			<p className="whitespace-pre-wrap break-words leading-relaxed">
				{parts.map((p, i) =>
					p.key ? (
						<span key={i} className="cap-ph" data-filled={Boolean(values[p.key]?.trim())}>
							{values[p.key]?.trim() || p.text}
						</span>
					) : (
						<span key={i}>{p.text}</span>
					),
				)}
			</p>
			) : null}
			{template.trim() && keys.length === 0 && mode === "paste" ? (
				<p className="text-xs text-muted">No [blanks] found. Wrap anything you want to change in square brackets.</p>
			) : null}
			{keys.length > 0 ? (
				<p className="text-xs text-muted">
					{missing === 0
						? "All filled in. Copy it and post away."
						: `Press Edit to fill in ${missing} blank${missing > 1 ? "s" : ""}, then copy.`}
				</p>
			) : null}

			<dialog
				ref={dialogRef}
				className="modal"
				aria-labelledby="caption-dialog-title"
				onClick={(e) => {
					if (e.target === dialogRef.current) dialogRef.current?.close();
				}}
			>
				<form
					method="dialog"
					className="flex flex-col gap-4 p-5"
					onSubmit={() => {
						/* values are already live; closing keeps them */
					}}
				>
					<div className="flex items-start justify-between gap-3">
						<h3 id="caption-dialog-title" className="text-xl font-extrabold">
							Fill in your caption
						</h3>
						<button type="submit" className="tap -mr-2 -mt-1 px-2 text-2xl font-extrabold leading-none" aria-label="Close">
							×
						</button>
					</div>

					<div className="flex flex-col gap-3">
						{keys.map((k, i) => (
							<div key={k}>
								<label htmlFor={`cap-${i}`} className="mb-1 block text-sm font-extrabold">
									{k}
								</label>
								<input
									id={`cap-${i}`}
									className="field"
									value={values[k] ?? ""}
									maxLength={120}
									autoFocus={i === 0}
									placeholder={k}
									onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
								/>
							</div>
						))}
					</div>

					<div>
						<p className="mb-1 text-sm font-extrabold">Preview</p>
						<p className="whitespace-pre-wrap break-words rounded-xl border-2 border-line p-3 text-sm">{result}</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							className="btn btn-lime"
							onClick={async (e) => {
								await onCopy(e.currentTarget);
								dialogRef.current?.close();
							}}
						>
							Copy caption
						</button>
						<button type="submit" className="btn btn-ghost">
							Done
						</button>
					</div>
				</form>
			</dialog>
		</section>
	);
}
