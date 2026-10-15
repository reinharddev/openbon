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
		type VT = { ready: Promise<void> };
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
			const vt = start.call(document, () => flushSync(() => apply(next)));
			vt.ready.then(() => {
				root.animate(
					{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
					{ duration: 650, easing: "cubic-bezier(0.5, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
				);
			}).catch(() => {});
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
