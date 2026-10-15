"use client";

import { useEffect, useRef, useState } from "react";
import { motionOff } from "@/lib/motion";

type Tip = { id: number; text: string; tilt: number; color: string };

const COLORS = ["var(--accent)", "var(--pink)", "var(--violet)"];

type Props = {
	messages: string[];
	/** Chance (0-1) that a hover shows a tip at all. */
	chance?: number;
	children: React.ReactNode;
};

/**
 * Wraps a control and, on mouse hover only, sometimes pops up a small cheeky speech bubble
 * with a random message. Touch and pen input never trigger it.
 */
export default function FunTip({ messages, chance = 0.4, children }: Props) {
	const [tip, setTip] = useState<Tip | null>(null);
	const [leaving, setLeaving] = useState(false);
	const lastIndex = useRef(-1);
	const counter = useRef(0);
	const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const removeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(
		() => () => {
			clearTimeout(showTimer.current);
			clearTimeout(hideTimer.current);
			clearTimeout(removeTimer.current);
		},
		[],
	);

	function dismiss() {
		clearTimeout(showTimer.current);
		clearTimeout(hideTimer.current);
		setLeaving(true);
		removeTimer.current = setTimeout(() => {
			setTip(null);
			setLeaving(false);
		}, 200);
	}

	function onEnter(e: React.PointerEvent) {
		if (e.pointerType !== "mouse" || messages.length === 0 || motionOff()) return;
		clearTimeout(removeTimer.current);
		if (Math.random() > chance) return;

		let index = Math.floor(Math.random() * messages.length);
		if (messages.length > 1 && index === lastIndex.current) index = (index + 1) % messages.length;
		lastIndex.current = index;

		showTimer.current = setTimeout(
			() => {
				counter.current += 1;
				setLeaving(false);
				setTip({
					id: counter.current,
					text: messages[index],
					tilt: Math.round((Math.random() * 8 - 4) * 10) / 10,
					color: COLORS[Math.floor(Math.random() * COLORS.length)],
				});
				hideTimer.current = setTimeout(dismiss, 2600);
			},
			80 + Math.random() * 160,
		);
	}

	return (
		<span className="funtip-host" onPointerEnter={onEnter} onPointerLeave={dismiss}>
			{children}
			{tip ? (
				<span className="funtip" aria-hidden="true" key={tip.id}>
					<span
						className="funtip-bubble"
						data-leaving={leaving}
						style={{ "--tilt": `${tip.tilt}deg`, background: tip.color } as React.CSSProperties}
					>
						{tip.text}
					</span>
				</span>
			) : null}
		</span>
	);
}
