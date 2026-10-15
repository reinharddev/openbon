"use client";

import { useEffect } from "react";
import { sparkleBurst } from "@/lib/fx";

/** Adds a small random sparkle burst whenever a `.btn` is clicked, anywhere in the app. */
export default function ClickSparkles() {
	useEffect(() => {
		function onClick(e: MouseEvent) {
			const target = e.target as Element | null;
			const btn = target?.closest<HTMLElement>(".btn");
			if (!btn) return;
			if ((btn as HTMLButtonElement).disabled || btn.getAttribute("aria-disabled") === "true") return;

			let x = e.clientX;
			let y = e.clientY;
			if (!x && !y) {
				const r = btn.getBoundingClientRect();
				x = r.left + r.width / 2;
				y = r.top + r.height / 2;
			}
			sparkleBurst(x, y);
		}
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, []);

	return null;
}
