"use client";

import { flushSync } from "react-dom";
import { useEffect } from "react";
import { motionOff } from "@/lib/motion";
import { useI18n } from "./I18nProvider";

const KEY = "openbon-theme";
type Theme = "light" | "dark";

function current(): Theme {
	return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
	document.documentElement.dataset.theme = theme;
}

const SPARK_COLORS = ["#c7f542", "#ff7ab8", "#a78bfa", "#ffffff"];
const SPARK_CLIPS = [
	"polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)",
	"polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
	"polygon(35% 0, 65% 0, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0 65%, 0 35%, 35% 35%)",
];

/** Throws small twinkling shapes along the leading edge of the expanding circle. */
function edgeSparkles(layer: HTMLElement | null, anim: Animation, cx: number, cy: number, maxR: number) {
	if (!layer) return;
	let alive = 0;
	// A glowing rim that rides exactly on the boundary between the old and new colors.
	const ring = document.createElement("div");
	ring.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);border:3px solid rgba(255,255,255,0.9);box-shadow:0 0 14px 3px rgba(199,245,66,0.85),0 0 34px 8px rgba(167,139,250,0.55),inset 0 0 14px 2px rgba(255,122,184,0.6);box-sizing:border-box;`;
	layer.appendChild(ring);
	const tick = () => {
		if (!layer.isConnected) return;
		const progress = Number(anim.effect?.getComputedTiming().progress ?? 1);
		const r = progress * maxR;
		const ended = anim.playState === "finished" || progress >= 1;
		ring.style.width = ring.style.height = `${Math.max(0, r * 2)}px`;
		if (ended) {
			ring.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
		}
		if (!ended && r > 4) {
			for (let i = 0; i < 12 && alive < 240; i++) {
				const a = Math.random() * Math.PI * 2;
				const rr = r + (Math.random() * 28 - 14);
				const x = cx + Math.cos(a) * rr;
				const y = cy + Math.sin(a) * rr;
				if (x < -20 || y < -20 || x > innerWidth + 20 || y > innerHeight + 20) continue;
				const size = 6 + Math.random() * 12;
				const el = document.createElement("span");
				el.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;background:${
					SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
				};clip-path:${SPARK_CLIPS[Math.floor(Math.random() * SPARK_CLIPS.length)]};`;
				layer.appendChild(el);
				alive += 1;
				const drift = 6 + Math.random() * 22;
				const spin = (Math.random() * 2 - 1) * 140;
				const fx = Math.cos(a) * drift;
				const fy = Math.sin(a) * drift;
				const a2 = el.animate(
					[
						{ transform: "translate(0,0) scale(0.3) rotate(0deg)", opacity: 0 },
						{ transform: `translate(${fx * 0.4}px,${fy * 0.4}px) scale(1.1) rotate(${spin * 0.4}deg)`, opacity: 1, offset: 0.3 },
						{ transform: `translate(${fx}px,${fy}px) scale(0) rotate(${spin}deg)`, opacity: 0 },
					],
					{ duration: 420 + Math.random() * 380, easing: "ease-out", fill: "forwards" },
				);
				a2.onfinish = () => {
					el.remove();
					alive -= 1;
				};
			}
		}
		if (!ended) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
}

/** Sun and moon morph into each other; the page colors sweep out from the button in a circle. */
export default function ThemeToggle() {
	const { t } = useI18n();
	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			try {
				if (localStorage.getItem(KEY)) return;
			} catch {}
			apply(mq.matches ? "dark" : "light");
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);

	function toggle(e: React.MouseEvent<HTMLButtonElement>) {
		const next: Theme = current() === "dark" ? "light" : "dark";
		try {
			localStorage.setItem(KEY, next);
		} catch {}

		const reduced = motionOff();
		const root = document.documentElement;
		type VT = { ready: Promise<void>; finished: Promise<void> };
		const start = (document as Document & { startViewTransition?: (cb: () => void) => VT }).startViewTransition;

		if (reduced) {
			apply(next);
			return;
		}

		if (start) {
			const r = e.currentTarget.getBoundingClientRect();
			const x = r.left + r.width / 2;
			const y = r.top + r.height / 2;
			const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
			let layer: HTMLDivElement | null = null;
			const vt = start.call(document, () =>
				flushSync(() => {
					apply(next);
					// A named layer is captured as its own live group, so it paints above the reveal.
					layer = document.createElement("div");
					layer.setAttribute("aria-hidden", "true");
					layer.style.cssText =
						"position:fixed;inset:0;pointer-events:none;overflow:hidden;view-transition-name:theme-sparkles;";
					document.body.appendChild(layer);
				}),
			);
			vt.ready
				.then(() => {
					const anim = root.animate(
						{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
						{ duration: 650, easing: "cubic-bezier(0.5, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
					);
					edgeSparkles(layer, anim, x, y, radius);
				})
				.catch(() => {});
			vt.finished
				.catch(() => {})
				.finally(() => {
					(layer as HTMLDivElement | null)?.remove();
				});
			return;
		}

		root.classList.add("theme-fade");
		apply(next);
		window.setTimeout(() => root.classList.remove("theme-fade"), 600);
	}

	return (
		<button type="button" onClick={toggle} className="theme-btn" aria-label={t("nav.themeLabel")} title={t("nav.themeLabel")}>
			<svg viewBox="0 0 24 24" className="theme-icon" aria-hidden="true">
				<defs>
					<mask id="moon-cut">
						<rect width="24" height="24" fill="#fff" />
						<circle className="moon-cut" cx="12" cy="12" r="6.5" fill="#000" />
					</mask>
				</defs>
				<circle className="sun-core" cx="12" cy="12" r="5" mask="url(#moon-cut)" />
				<g className="sun-rays" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
					{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
						<line key={a} x1="12" y1="2.2" x2="12" y2="4.4" transform={`rotate(${a} 12 12)`} />
					))}
				</g>
				<g className="stars" fill="currentColor">
					<circle cx="19" cy="15.5" r="1.1" />
					<circle cx="16" cy="20" r="0.8" />
					<circle cx="21" cy="10" r="0.7" />
				</g>
			</svg>
		</button>
	);
}
