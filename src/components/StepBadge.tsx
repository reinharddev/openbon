/** Numbered badge that swaps to an animated icon while its parent `.step-host` is hovered. */
export default function StepBadge({ n }: { n: 1 | 2 | 3 }) {
	return (
		<span className="chip chip-lime step-badge h-9 w-9 shrink-0 p-0 text-lg">
			<span className="step-num">{n}</span>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="step-ico"
				aria-hidden="true"
			>
				{n === 1 ? (
					<>
						<path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
						<g className="su-arrow">
							<path d="M12 15V4" />
							<path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
						</g>
					</>
				) : n === 2 ? (
					<>
						<path className="sh-line" pathLength={1} d="M6 12 18 6" />
						<path className="sh-line sh-line-b" pathLength={1} d="M6 12 18 18" />
						<circle className="sh-node" cx="6" cy="12" r="2.6" fill="currentColor" />
						<circle className="sh-node sh-node-b" cx="18" cy="6" r="2.6" fill="currentColor" />
						<circle className="sh-node sh-node-c" cx="18" cy="18" r="2.6" fill="currentColor" />
					</>
				) : (
					<>
						<defs>
							<clipPath id="step-frame-clip">
								<rect x="4.2" y="4.2" width="15.6" height="15.6" rx="3" />
							</clipPath>
						</defs>
						<rect x="3" y="3" width="18" height="18" rx="4" />
						<g clipPath="url(#step-frame-clip)">
							<g className="sf-person" fill="currentColor" stroke="none">
								<circle cx="12" cy="10" r="3" />
								<path d="M5.5 22a6.5 6.5 0 0 1 13 0z" />
							</g>
						</g>
					</>
				)}
			</svg>
		</span>
	);
}
