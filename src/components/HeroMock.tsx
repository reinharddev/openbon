/** Decorative illustration: a photo placeholder wrapped by a campaign frame. */
export default function HeroMock() {
	return (
		<svg viewBox="0 0 400 400" role="img" aria-label="Illustration of a profile photo inside a campaign frame" className="h-auto w-full">
			<rect x="8" y="8" width="384" height="384" rx="28" fill="var(--surface)" stroke="var(--border)" strokeWidth="2" />
			<circle cx="200" cy="178" r="128" fill="var(--border)" />
			<circle cx="200" cy="148" r="38" fill="var(--muted)" opacity="0.55" />
			<path d="M120 262c10-44 46-62 80-62s70 18 80 62a128 128 0 0 1-160 0z" fill="var(--muted)" opacity="0.55" />
			<circle cx="200" cy="178" r="128" fill="none" stroke="var(--accent)" strokeWidth="18" />
			<circle cx="200" cy="178" r="146" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" />
			<rect x="104" y="334" width="192" height="34" rx="17" fill="var(--accent)" />
			<text
				x="200"
				y="356"
				textAnchor="middle"
				fontSize="15"
				fontWeight="600"
				fill="var(--accent-foreground)"
				fontFamily="ui-sans-serif, system-ui, sans-serif"
			>
				Join the campaign
			</text>
		</svg>
	);
}
