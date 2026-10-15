"use client";

import { useEffect } from "react";
import { sparkleBurst } from "@/lib/fx";

/** Adds a small random sparkle burst wherever the pointer is pressed, on any element. */
export default function ClickSparkles() {
	useEffect(() => {
		function onPointerDown(e: PointerEvent) {
			if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
			sparkleBurst(e.clientX, e.clientY);
		}
		document.addEventListener("pointerdown", onPointerDown, { passive: true });
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, []);

	return null;
}
