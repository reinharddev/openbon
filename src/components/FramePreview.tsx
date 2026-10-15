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
export default function FramePreview({ files, presetW, presetH }: { files: File[]; presetW: number; presetH: number }) {
	const presetRatio = presetW / presetH;
	const u = Math.min(presetW, presetH);
	const stageMax = presetRatio >= 1 ? 320 : Math.round(300 * presetRatio);
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
			<ul className="flex flex-wrap gap-4">
				{items.map((it) => {
					const ratio = it.w / it.h;
					const off = Math.abs(ratio - presetRatio) / presetRatio > 0.03;
					const bad = Math.min(it.w, it.h) < 200 || Math.max(it.w, it.h) > 2048;
					return (
						<li key={it.url} className="min-w-0" style={{ width: `min(100%, ${stageMax}px)` }}>
							<div
								className="checker relative w-full overflow-hidden rounded-lg border-2 border-dashed border-border"
								style={{ aspectRatio: `${presetW} / ${presetH}` }}
							>
								<svg viewBox={`0 0 ${presetW} ${presetH}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
									<rect width={presetW} height={presetH} fill="#d4d4d8" />
									{/* Head sits on the exact center of the stage, where a face would go in most frames. */}
									<circle cx={presetW / 2} cy={presetH / 2 - u * 0.04} r={u * 0.15} fill="#71717a" />
									<path
										d={`M${presetW / 2 - u * 0.34} ${presetH / 2 + u * 0.46}a${u * 0.34} ${u * 0.34} 0 0 1 ${u * 0.68} 0z`}
										fill="#71717a"
									/>
								</svg>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={it.url} alt="" className="absolute inset-0 h-full w-full object-contain" />
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
