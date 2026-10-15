import type { CSSProperties } from "react";

export type StickerName = "free" | "nowm" | "camera" | "heart" | "check" | "sad" | "device";

type Props = {
	name: StickerName;
	/** Tailwind classes for position and size, e.g. "absolute -right-2 top-0 w-24". */
	className?: string;
	/** Rotation in degrees. */
	tilt?: number;
};

const INK = "#0c0c0d";
const LIME = "var(--accent)";
const PINK = "var(--pink)";
const VIOLET = "var(--violet)";

function burst(points: number, outer: number, inner: number) {
	const out: string[] = [];
	for (let i = 0; i < points * 2; i++) {
		const r = i % 2 === 0 ? outer : inner;
		const a = (Math.PI * i) / points - Math.PI / 2;
		out.push(`${(60 + r * Math.cos(a)).toFixed(1)},${(60 + r * Math.sin(a)).toFixed(1)}`);
	}
	return `M${out.join("L")}Z`;
}

const CIRCLE = "M60 8a52 52 0 1 0 0 104a52 52 0 1 0 0-104z";
const BURST = burst(14, 54, 42);
const CAMERA = "M16 38h20l6-10h36l6 10h20a8 8 0 0 1 8 8v50a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V46a8 8 0 0 1 8-8z";
const HEART = "M60 104C22 78 12 54 24 36c10-14 28-12 36 2c8-14 26-16 36-2c12 18 2 42-36 68z";
const PILL = "M30 8h160a22 22 0 0 1 0 44H30a22 22 0 0 1 0-44z";

type Shape = { d: string; fill: string };

const SHAPES: Record<StickerName, Shape> = {
	free: { d: BURST, fill: LIME },
	nowm: { d: CIRCLE, fill: VIOLET },
	camera: { d: CAMERA, fill: PINK },
	heart: { d: HEART, fill: PINK },
	check: { d: CIRCLE, fill: LIME },
	sad: { d: CIRCLE, fill: PINK },
	device: { d: PILL, fill: LIME },
};

function Face({ name }: { name: StickerName }) {
	const common = { fill: "none", stroke: INK, strokeLinecap: "round", strokeLinejoin: "round" } as const;
	switch (name) {
		case "free":
			return (
				<text x="60" y="68" textAnchor="middle" fontSize="27" fontWeight="900" fill={INK} letterSpacing="1">
					FREE
				</text>
			);
		case "nowm":
			return (
				<>
					<text x="60" y="62" textAnchor="middle" fontSize="30" fontWeight="900" fill={INK}>
						NO
					</text>
					<text x="60" y="80" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={INK} letterSpacing="0.5">
						WATERMARK
					</text>
				</>
			);
		case "camera":
			return (
				<>
					<circle cx="60" cy="70" r="22" fill="#fff" stroke={INK} strokeWidth="4" />
					<circle cx="60" cy="70" r="9" fill={INK} />
					<circle cx="94" cy="54" r="4" fill={INK} />
				</>
			);
		case "heart":
			return <path d="M38 48c2-6 8-8 13-5" {...common} strokeWidth="5" />;
		case "check":
			return <path d="m34 62 17 17 33-36" {...common} strokeWidth="11" />;
		case "sad":
			return (
				<>
					<path d="m38 44 14 14m0-14L38 58m30-14 14 14m0-14L68 58" {...common} strokeWidth="6" />
					<path d="M40 88c8-10 32-10 40 0" {...common} strokeWidth="6" />
				</>
			);
		case "device":
			return (
				<>
					<rect x="22" y="23" width="18" height="15" rx="3" fill={INK} />
					<path d="M26 23v-4a5 5 0 0 1 10 0v4" {...common} strokeWidth="3.5" />
					<text x="50" y="37" fontSize="16" fontWeight="900" fill={INK}>
						stays on your device
					</text>
				</>
			);
	}
}

/** Decorative die-cut sticker: white outline, ink border, hard shadow. Always aria-hidden. */
export default function Sticker({ name, className = "", tilt = 0 }: Props) {
	const { d, fill } = SHAPES[name];
	const viewBox = name === "device" ? "0 0 220 60" : "0 0 120 120";
	return (
		<svg
			viewBox={viewBox}
			aria-hidden="true"
			focusable="false"
			className={`sticker ${className}`}
			style={{ "--tilt": `${tilt}deg` } as CSSProperties}
		>
			<path d={d} fill="#fff" stroke="#fff" strokeWidth="14" strokeLinejoin="round" />
			<path d={d} fill={fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
			<Face name={name} />
		</svg>
	);
}
