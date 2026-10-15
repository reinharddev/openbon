export type AnimatedIconName = "image" | "ban" | "shield" | "layers" | "link" | "user";

/** Confetti pieces: offset from the icon center, rotation, and color. */
const CONFETTI = [
	{ x: -20, y: -14, r: -40, c: "var(--accent)" },
	{ x: -6, y: -26, r: 25, c: "var(--pink)" },
	{ x: 12, y: -28, r: -15, c: "var(--violet)" },
	{ x: 24, y: -12, r: 60, c: "var(--accent)" },
	{ x: 28, y: 6, r: -30, c: "var(--pink)" },
	{ x: -26, y: 6, r: 45, c: "var(--violet)" },
	{ x: 2, y: -32, r: 80, c: "var(--accent)" },
];

const SHAPES: Record<AnimatedIconName, React.ReactNode> = {
	image: (
		<>
			<rect className="a-frame" x="3" y="3" width="18" height="18" rx="2" />
			<circle className="a-sun" cx="9" cy="9" r="2" />
			<path className="a-draw" pathLength={1} d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
		</>
	),
	ban: (
		<>
			<circle className="a-spin" cx="12" cy="12" r="10" />
			<path className="a-draw" pathLength={1} d="m4.9 4.9 14.2 14.2" />
		</>
	),
	shield: (
		<>
			<path
				className="a-bounce"
				d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"
			/>
			<path className="a-draw" pathLength={1} d="m9 12.5 2 2 4-4.5" />
		</>
	),
	layers: (
		<>
			<path className="a-layer-bottom" d="m2 17 10 5 10-5" />
			<path className="a-layer-mid" d="m2 12 10 5 10-5" />
			<path className="a-layer-top" d="m12 2 10 5-10 5L2 7z" />
		</>
	),
	link: (
		<>
			<path className="a-link-a" d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
			<path className="a-link-b" d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
		</>
	),
	user: (
		<>
			<circle className="a-head" cx="9" cy="7" r="4" />
			<path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
			<g className="a-x">
				<path d="m17 8 5 5" />
				<path d="m22 8-5 5" />
			</g>
		</>
	),
};

/** Feature icon that plays a small pop-and-confetti animation when its host card is hovered. */
export default function AnimatedIcon({ name }: { name: AnimatedIconName }) {
	return (
		<span className={`ico ico-${name}`} aria-hidden="true">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{SHAPES[name]}
			</svg>
			{CONFETTI.map((c, i) => (
				<i
					key={i}
					style={
						{
							"--x": `${c.x}px`,
							"--y": `${c.y}px`,
							"--r": `${c.r}deg`,
							background: c.c,
						} as React.CSSProperties
					}
				/>
			))}
		</span>
	);
}
