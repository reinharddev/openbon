"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

type Item = { name: string; url: string; w: number; h: number };

function gcdRatio(w: number, h: number) {
	const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
	const d = g(w, h);
	const a = w / d;
	const b = h / d;
	return a > 30 || b > 30 ? `${(w / h).toFixed(2)}:1` : `${a}:${b}`;
}

/** Shows each chosen frame over a sample portrait, so creators see what participants will see. */
export default function FramePreview({ files, presetRatio }: { files: File[]; presetRatio: number }) {
	const { t } = useI18n();
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => {
		let cancelled = false;
		const urls: string[] = [];
		Promise.all(
			files.map(
				(f) =>
					new Promise<Item | null>((resolve) => {
						const url = URL.createObjectURL(f);
						urls.push(url);
						const img = new Image();
						img.onload = () => resolve({ name: f.name, url, w: img.naturalWidth, h: img.naturalHeight });
						img.onerror = () => resolve(null);
						img.src = url;
					}),
			),
		).then((list) => {
			if (!cancelled) setItems(list.filter((x): x is Item => x !== null));
		});
		return () => {
			cancelled = true;
			urls.forEach((u) => URL.revokeObjectURL(u));
		};
	}, [files]);

	if (items.length === 0) return null;

	return (
		<div className="mt-4">
			<p className="mb-2 text-sm font-extrabold">{t("create.previewTitle")}</p>
			<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
				{items.map((it) => {
					const ratio = it.w / it.h;
					const off = Math.abs(ratio - presetRatio) / presetRatio > 0.03;
					const bad = Math.min(it.w, it.h) < 200 || Math.max(it.w, it.h) > 2048;
					return (
						<li key={it.url} className="min-w-0">
							<div
								className="checker relative mx-auto w-full max-w-[220px] overflow-hidden rounded-lg border-2 border-border"
								style={{ aspectRatio: `${it.w} / ${it.h}` }}
							>
								<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
									<rect width="100" height="100" fill="#d4d4d8" />
									<circle cx="50" cy="40" r="15" fill="#71717a" />
									<path d="M18 100a32 32 0 0 1 64 0z" fill="#71717a" />
								</svg>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={it.url} alt="" className="absolute inset-0 h-full w-full object-fill" />
							</div>
							<p className="mt-2 truncate text-xs font-bold" title={it.name}>
								{it.w}×{it.h} · {gcdRatio(it.w, it.h)}
							</p>
							{bad ? (
								<p className="text-xs text-danger">{t("create.previewBad")}</p>
							) : off ? (
								<p className="text-xs text-muted">{t("create.previewOff")}</p>
							) : (
								<p className="text-xs text-accent-ink">{t("create.previewOk")}</p>
							)}
						</li>
					);
				})}
			</ul>
			<p className="mt-3 text-xs text-muted">{t("create.previewNote")}</p>
		</div>
	);
}
