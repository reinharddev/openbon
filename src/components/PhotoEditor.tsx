"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { confettiBurst } from "@/lib/fx";
import FilePicker from "./FilePicker";
import { useI18n } from "./I18nProvider";
import Sticker from "./Sticker";

type FrameInfo = { id: string; width: number; height: number };

type Props = {
	slug: string;
	frames: FrameInfo[];
};

type Transform = { scale: number; x: number; y: number };

const INITIAL: Transform = { scale: 1, x: 0, y: 0 };

export default function PhotoEditor({ slug, frames }: Props) {
	const { t } = useI18n();
	const [frameId, setFrameId] = useState(frames[0].id);
	const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
	const [transform, setTransform] = useState<Transform>(INITIAL);
	const [frameImages, setFrameImages] = useState<Record<string, HTMLImageElement>>({});
	const [busy, setBusy] = useState(false);
	const [fileName, setFileName] = useState("");
	const [saved, setSaved] = useState(false);
	const [dragging, setDragging] = useState(false);
	const downloadRef = useRef<HTMLButtonElement>(null);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pointers = useRef(new Map<number, { x: number; y: number }>());
	const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

	const frame = useMemo(() => frames.find((f) => f.id === frameId) ?? frames[0], [frames, frameId]);
	const frameImage = frameImages[frame.id];

	useEffect(() => {
		let cancelled = false;
		for (const f of frames) {
			const img = new Image();
			img.onload = () => {
				if (!cancelled) setFrameImages((prev) => ({ ...prev, [f.id]: img }));
			};
			img.src = `/api/frames/${f.id}`;
		}
		return () => {
			cancelled = true;
		};
	}, [frames]);

	const draw = useCallback(
		(canvas: HTMLCanvasElement) => {
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			const { width, height } = frame;
			if (canvas.width !== width) canvas.width = width;
			if (canvas.height !== height) canvas.height = height;

			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, width, height);

			if (photo) {
				const cover = Math.max(width / photo.naturalWidth, height / photo.naturalHeight);
				const drawW = photo.naturalWidth * cover * transform.scale;
				const drawH = photo.naturalHeight * cover * transform.scale;
				const dx = (width - drawW) / 2 + transform.x * width;
				const dy = (height - drawH) / 2 + transform.y * height;
				ctx.drawImage(photo, dx, dy, drawW, drawH);
			}
			if (frameImage) ctx.drawImage(frameImage, 0, 0, width, height);
		},
		[frame, photo, transform, frameImage],
	);

	useEffect(() => {
		if (canvasRef.current) draw(canvasRef.current);
	}, [draw]);

	function onPickPhoto(files: FileList | null) {
		const file = files?.[0];
		if (!file) return;
		setFileName(file.name);
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			setPhoto(img);
			setTransform(INITIAL);
			setSaved(false);
			requestAnimationFrame(() => {
				const r = canvasRef.current?.getBoundingClientRect();
				if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 38);
			});
		};
		img.src = url;
	}

	function clampScale(value: number) {
		return Math.min(4, Math.max(1, value));
	}

	function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
		if (!photo) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
		setDragging(true);
		if (pointers.current.size === 2) {
			const [a, b] = Array.from(pointers.current.values());
			pinchStart.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), scale: transform.scale };
		}
	}

	function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
		const prev = pointers.current.get(e.pointerId);
		if (!prev || !photo) return;
		const rect = e.currentTarget.getBoundingClientRect();
		pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

		if (pointers.current.size === 2 && pinchStart.current) {
			const [a, b] = Array.from(pointers.current.values());
			const distance = Math.hypot(a.x - b.x, a.y - b.y);
			const scale = clampScale((pinchStart.current.scale * distance) / pinchStart.current.distance);
			setTransform((t) => ({ ...t, scale }));
		} else if (pointers.current.size === 1) {
			const dx = (e.clientX - prev.x) / rect.width;
			const dy = (e.clientY - prev.y) / rect.height;
			setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
		}
	}

	function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
		pointers.current.delete(e.pointerId);
		if (pointers.current.size < 2) pinchStart.current = null;
		if (pointers.current.size === 0) setDragging(false);
	}

	async function onDownload() {
		const canvas = canvasRef.current;
		if (!canvas || !photo) return;
		setBusy(true);
		try {
			draw(canvas);
			const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `${slug}.png`;
			link.click();
			setTimeout(() => URL.revokeObjectURL(url), 10_000);
			fetch(`/api/campaigns/${slug}/use`, { method: "POST", keepalive: true }).catch(() => {});
			setSaved(true);
			const br = downloadRef.current?.getBoundingClientRect();
			if (br) confettiBurst(br.left + br.width / 2, br.top, 48);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px] md:items-start">
			<div className="flex flex-col gap-5 md:col-start-2 md:row-start-1">
				<div>
					<label className="mb-2 block text-sm font-extrabold" htmlFor="photo">
						{t("c.step1")}
					</label>
					<FilePicker
						id="photo"
						accept="image/*"
						buttonLabel={t("c.choosePhoto")}
						status={fileName || t("create.noFile")}
						onFiles={onPickPhoto}
					/>
					<p className="mt-2 text-xs text-muted">{t("c.photoNote")}</p>
				</div>

				{frames.length > 1 ? (
					<div>
						<p className="mb-2 text-sm font-extrabold">{t("c.chooseFrame")}</p>
						<div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-4">
							{frames.map((f) => (
								<button
									key={f.id}
									type="button"
									onClick={() => setFrameId(f.id)}
									aria-pressed={f.id === frame.id}
									className={`checker overflow-hidden rounded-md border-2 border-border ${
										f.id === frame.id ? "shadow-[3px_3px_0_var(--accent)]" : "opacity-70"
									}`}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={`/api/frames/${f.id}`} alt="" className="block h-auto w-full" />
								</button>
							))}
						</div>
					</div>
				) : null}
			</div>

			<div className="card card-violet checker mx-auto w-full max-w-[min(100%,70vh)] overflow-hidden md:col-start-1 md:row-span-2 md:row-start-1 md:max-w-none">
				<canvas
					ref={canvasRef}
					width={frame.width}
					height={frame.height}
					className="block h-auto w-full touch-none"
					style={{ cursor: photo ? (dragging ? "grabbing" : "grab") : "not-allowed", aspectRatio: `${frame.width} / ${frame.height}` }}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
				/>
			</div>

			<div className="flex flex-col gap-5 md:col-start-2 md:row-start-2">
				<div>
					<label className="mb-2 block text-sm font-extrabold" htmlFor="zoom">
						{t("c.step2")}
					</label>
					<input
						id="zoom"
						type="range"
						min={1}
						max={4}
						step={0.01}
						value={transform.scale}
						disabled={!photo}
						onChange={(e) => setTransform((t) => ({ ...t, scale: Number(e.target.value) }))}
						className="range"
					/>
					<div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
						<span>{t("c.dragHint")}</span>
						<button
							type="button"
							disabled={!photo}
							onClick={() => setTransform(INITIAL)}
							className="tap shrink-0 font-bold underline disabled:no-underline disabled:opacity-50"
						>
							{t("c.reset")}
						</button>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<button
						ref={downloadRef}
						type="button"
						onClick={onDownload}
						disabled={!photo || busy}
						className={`btn btn-lime w-full ${photo && !saved ? "ready-nudge" : ""}`}
					>
						{t("c.download")}
					</button>
					{!photo ? (
						<p className="text-xs text-muted">{t("c.pickToUnlock")}</p>
					) : saved ? (
						<p key="saved" className="ready-chip chip chip-pink self-start -rotate-1">
							{t("c.saved")}
						</p>
					) : (
						<p key="ready" className="ready-chip chip chip-lime self-start -rotate-1">
							{t("c.ready")}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
