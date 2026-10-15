const PATHS = {
	image: (
		<>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
		</>
	),
	ban: (
		<>
			<circle cx="12" cy="12" r="10" />
			<path d="m4.9 4.9 14.2 14.2" />
		</>
	),
	shield: (
		<path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
	),
	layers: (
		<>
			<path d="m12 2 10 5-10 5L2 7z" />
			<path d="m2 12 10 5 10-5" />
			<path d="m2 17 10 5 10-5" />
		</>
	),
	link: (
		<>
			<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
			<path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
		</>
	),
	code: (
		<>
			<path d="m16 18 6-6-6-6" />
			<path d="m8 6-6 6 6 6" />
		</>
	),
	user: (
		<>
			<circle cx="9" cy="7" r="4" />
			<path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
			<path d="m17 8 5 5" />
			<path d="m22 8-5 5" />
		</>
	),
	arrow: (
		<>
			<path d="M5 12h14" />
			<path d="m12 5 7 7-7 7" />
		</>
	),
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			{PATHS[name]}
		</svg>
	);
}
