"use client";

import { useEffect, useRef } from "react";
import { smokePuff } from "@/lib/fx";

type Props = {
	as?: "div" | "li" | "section";
	/** Milliseconds to wait after entering the viewport; handy for staggering siblings. */
	delay?: number;
	className?: string;
	children: React.ReactNode;
};

/** Pops its children in the first time they scroll into view, with a few small smoke puffs behind. */
export default function Reveal({ as = "div", delay = 0, className = "", children }: Props) {
	const ref = useRef<HTMLElement>(null);
	const Tag = as as React.ElementType;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		(window as unknown as { __hydrated?: boolean }).__hydrated = true;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
			el.classList.add("is-in");
			return;
		}
		let timer: ReturnType<typeof setTimeout> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				timer = setTimeout(() => {
					el.classList.add("is-in");
					smokePuff(el);
				}, delay);
			},
			{ threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			clearTimeout(timer);
		};
	}, [delay]);

	return (
		<Tag ref={ref} className={`reveal ${className}`}>
			{children}
		</Tag>
	);
}
