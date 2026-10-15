"use client";

import { useEffect, useState } from "react";
import { MOTION_KEY } from "@/lib/motion";
import { useI18n } from "./I18nProvider";

/** Turns animations on or off for the whole site. The choice is remembered in this browser. */
export default function MotionToggle({ className = "" }: { className?: string }) {
	const { t } = useI18n();
	const [off, setOff] = useState(false);

	useEffect(() => {
		setOff(document.documentElement.dataset.motion === "off");
	}, []);

	function toggle() {
		const next = off ? "on" : "off";
		document.documentElement.dataset.motion = next;
		try {
			localStorage.setItem(MOTION_KEY, next);
		} catch {}
		setOff(!off);
	}

	const label = off ? t("nav.motionOff") : t("nav.motionOn");

	return (
		<button type="button" onClick={toggle} className={`motion-btn ${className}`} aria-pressed={!off} aria-label={label} title={label}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<g className="sp">
					<path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6z" fill="currentColor" stroke="none" />
					<path d="M18 13l.8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8z" fill="currentColor" stroke="none" />
				</g>
				<path className="slash" pathLength={1} d="M4 20 20 4" />
			</svg>
		</button>
	);
}
