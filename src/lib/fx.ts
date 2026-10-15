type Shape = "star" | "plus" | "diamond" | "dot" | "square";

const COLORS = ["var(--accent)", "var(--pink)", "var(--violet)", "var(--foreground)"];

const CLIP: Partial<Record<Shape, string>> = {
	star: "polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)",
	plus: "polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%)",
	diamond: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
};

const SHAPES: Shape[] = ["star", "plus", "diamond", "dot", "square"];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)];

function reducedMotion(): boolean {
	return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function makePiece(x: number, y: number, w: number, h: number, shape: Shape, color: string): HTMLSpanElement {
	const el = document.createElement("span");
	el.setAttribute("aria-hidden", "true");
	el.style.cssText = `position:fixed;left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;background:${color};pointer-events:none;z-index:9999;will-change:transform,opacity;`;
	const clip = CLIP[shape];
	if (clip) el.style.clipPath = clip;
	if (shape === "dot") el.style.borderRadius = "50%";
	if (shape === "square") el.style.borderRadius = "2px";
	document.body.appendChild(el);
	return el;
}

function fly(
	el: HTMLElement,
	keyframes: Keyframe[],
	duration: number,
	delay = 0,
) {
	const anim = el.animate(keyframes, {
		duration,
		delay,
		easing: "cubic-bezier(0.2, 0.7, 0.3, 1)",
		fill: "both",
	});
	anim.onfinish = () => el.remove();
	anim.oncancel = () => el.remove();
}

/** Small, randomized sparkle burst for button clicks. A different pattern, shape mix, and palette each time. */
export function sparkleBurst(x: number, y: number) {
	if (reducedMotion()) return;
	const pattern = pick(["radial", "fountain", "ring"] as const);
	const palette = [...COLORS].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
	const shapes = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 2));
	const count = pattern === "ring" ? 8 : Math.round(rand(5, 9));

	for (let i = 0; i < count; i++) {
		const size = rand(6, 13);
		const el = makePiece(x, y, size, size, pick(shapes), pick(palette));
		let dx: number;
		let dy: number;
		if (pattern === "ring") {
			const a = (i / count) * Math.PI * 2;
			dx = Math.cos(a) * 34;
			dy = Math.sin(a) * 34;
		} else if (pattern === "fountain") {
			const a = rand(-150, -30) * (Math.PI / 180);
			const d = rand(26, 62);
			dx = Math.cos(a) * d;
			dy = Math.sin(a) * d;
		} else {
			const a = rand(0, Math.PI * 2);
			const d = rand(18, 48);
			dx = Math.cos(a) * d;
			dy = Math.sin(a) * d;
		}
		const spin = rand(-180, 180);
		const fall = pattern === "fountain" ? rand(14, 30) : 0;
		fly(
			el,
			[
				{ transform: "translate(0,0) scale(0.2) rotate(0deg)", opacity: 1 },
				{ transform: `translate(${dx}px,${dy}px) scale(1) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.55 },
				{ transform: `translate(${dx * 1.15}px,${dy + fall}px) scale(0) rotate(${spin}deg)`, opacity: 0 },
			],
			rand(450, 760),
			rand(0, 40),
		);
	}
}

/** Bigger confetti shower used for "it's done" moments. */
export function confettiBurst(x: number, y: number, count = 36) {
	if (reducedMotion()) return;
	for (let i = 0; i < count; i++) {
		const w = rand(6, 10);
		const h = Math.random() < 0.5 ? w : rand(10, 16);
		const el = makePiece(x, y, w, h, pick(["square", "dot", "star", "diamond"] as const), pick(COLORS.slice(0, 3)));
		const a = rand(-170, -10) * (Math.PI / 180);
		const speed = rand(60, 170);
		const dx = Math.cos(a) * speed;
		const peak = Math.sin(a) * speed;
		const spin = rand(-540, 540);
		fly(
			el,
			[
				{ transform: "translate(0,0) rotate(0deg) scale(0.6)", opacity: 1 },
				{ transform: `translate(${dx * 0.7}px,${peak}px) rotate(${spin * 0.5}deg) scale(1)`, opacity: 1, offset: 0.4 },
				{ transform: `translate(${dx}px,${peak + rand(110, 220)}px) rotate(${spin}deg) scale(0.8)`, opacity: 0 },
			],
			rand(900, 1500),
			rand(0, 120),
		);
	}
}
