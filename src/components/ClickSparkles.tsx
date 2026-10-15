"use client";

import { useEffect } from "react";
import { sparkleBurst } from "@/lib/fx";

/** Adds a small sparkle burst when a button or link is pressed. */
export default function ClickSparkles() {
	useEffect(() => {
		function onPointerDown(e: PointerEvent) {
			if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
			const target = e.target as Element | null;
			// Only on controls people intentionally press; plain text and empty areas stay calm.
			if (!target?.closest("button, a[href], [role='button'], summary, label[for]")) return;
			sparkleBurst(e.clientX, e.clientY);
		}
		document.addEventListener("pointerdown", onPointerDown, { passive: true });
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, []);

	return null;
}
