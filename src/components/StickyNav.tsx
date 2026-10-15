"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "./I18nProvider";
import ThemeToggle from "./ThemeToggle";

/**
 * A compact navbar that pops in (with a bounce) once the real header has scrolled out of view,
 * and pops out again when the real header comes back.
 */
export default function StickyNav({ targetId = "site-header" }: { targetId?: string }) {
	const { t } = useI18n();
	const [shown, setShown] = useState(false);
	const [mounted, setMounted] = useState(false);
	const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		const target = document.getElementById(targetId);
		if (!target || !("IntersectionObserver" in window)) return;
		const io = new IntersectionObserver(
			([entry]) => {
				// Only react once the header is fully above the viewport, not when it merely moves below it.
				const gone = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
				setShown(gone);
			},
			{ threshold: 0 },
		);
		io.observe(target);
		return () => io.disconnect();
	}, [targetId]);

	useEffect(() => {
		clearTimeout(hideTimer.current);
		if (shown) {
			setMounted(true);
		} else {
			// Stay mounted long enough for the pop-out animation.
			hideTimer.current = setTimeout(() => setMounted(false), 260);
		}
		return () => clearTimeout(hideTimer.current);
	}, [shown]);

	if (!mounted) return null;

	return (
		<div className="snav-wrap" aria-live="off">
			<nav className="snav" data-state={shown ? "in" : "out"} aria-label={t("nav.quick")}>
				<Link href="/" className="chip chip-lime snav-logo -rotate-2 text-base">
					OpenBon
				</Link>
				<div className="flex items-center gap-2 text-sm font-bold sm:gap-3">
					<Link href="/explore" className="tap hidden text-muted hover:text-foreground sm:inline-flex">
						{t("nav.explore")}
					</Link>
					<ThemeToggle />
					<Link href="/create" className="btn btn-lime btn-sm">
						{t("nav.make")}
					</Link>
				</div>
			</nav>
		</div>
	);
}
