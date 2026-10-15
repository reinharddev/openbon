"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FilePicker from "./FilePicker";

type FrameInfo = { id: string; width: number; height: number };

type Props = {
	slug: string;
	frames: FrameInfo[];
};

type Transform = { scale: number; x: number; y: number };

const INITIAL: Transform = { scale: 1, x: 0, y: 0 };

export default function PhotoEditor({ slug, frames }: Props) {
	const [frameId, setFrameId] = useState(frames[0].id);
	const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
	const [transform, setTransform] = useState<Transform>(INITIAL);
	const [frameImages, setFrameImages] = useState<Record<string, HTMLImageElement>>({});
	const [busy, setBusy] = useState(false);
	const [fileName, setFileName] = useState("");

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
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
			<div className="checker overflow-hidden rounded-lg border border-border">
				<canvas
					ref={canvasRef}
					width={frame.width}
					height={frame.height}
					className="block h-auto w-full touch-none"
					style={{ cursor: photo ? "grab" : "default", aspectRatio: `${frame.width} / ${frame.height}` }}
					onPointerDown={onPointerDown}
					onPointerMove={onPointerMove}
					onPointerUp={onPointerUp}
					onPointerCancel={onPointerUp}
				/>
			</div>

			<div className="flex flex-col gap-5">
				<div>
					<label className="mb-2 block text-sm font-medium" htmlFor="photo">
						1. Choose a photo
					</label>
					<FilePicker
						id="photo"
						accept="image/*"
						buttonLabel="Choose photo"
						status={fileName || "No file chosen"}
						onFiles={onPickPhoto}
					/>
					<p className="mt-2 text-xs text-muted">Your photo is not uploaded. Everything is processed on your device.</p>
				</div>

				{frames.length > 1 ? (
					<div>
						<p className="mb-2 text-sm font-medium">Choose a frame</p>
						<div className="grid grid-cols-4 gap-2">
							{frames.map((f) => (
								<button
									key={f.id}
									type="button"
									onClick={() => setFrameId(f.id)}
									aria-pressed={f.id === frame.id}
									className={`checker overflow-hidden rounded-md border-2 ${
										f.id === frame.id ? "border-accent" : "border-border"
									}`}
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={`/api/frames/${f.id}`} alt="" className="block h-auto w-full" />
								</button>
							))}
						</div>
					</div>
				) : null}

				<div>
					<label className="mb-2 block text-sm font-medium" htmlFor="zoom">
						2. Adjust position
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
					<div className="mt-2 flex items-center justify-between text-xs text-muted">
						<span>Drag the photo in the preview, pinch to zoom.</span>
						<button
							type="button"
							disabled={!photo}
							onClick={() => setTransform(INITIAL)}
							className="underline disabled:no-underline disabled:opacity-50"
						>
							Reset
						</button>
					</div>
				</div>

				<div>
					<button
						type="button"
						onClick={onDownload}
						disabled={!photo || busy}
						className="w-full rounded-md bg-accent px-4 py-2.5 font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						3. Download
					</button>
				</div>
			</div>
		</div>
	);
}
