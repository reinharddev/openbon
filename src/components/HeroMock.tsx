import Sticker from "./Sticker";

/** Decorative mock: a profile photo placeholder wrapped by a campaign frame, plus a few stickers. */
export default function HeroMock({ joinLabel }: { joinLabel: string }) {
	return (
		<div className="relative mx-auto flex w-full max-w-xs justify-center p-6" aria-hidden="true">
			<div className="aspect-square w-full rotate-3 rounded-3xl border-2 border-border bg-white p-3 shadow-[8px_8px_0_var(--violet)]">
				<div className="flex h-full w-full items-center justify-center rounded-2xl border-2 border-black bg-zinc-100">
					<div className="relative h-3/4 w-3/4 overflow-hidden rounded-full border-[12px] border-accent bg-zinc-300">
						<div className="absolute left-1/2 top-[18%] h-[28%] w-[28%] -translate-x-1/2 rounded-full bg-zinc-500" />
						<div className="absolute left-1/2 top-[52%] h-[55%] w-[60%] -translate-x-1/2 rounded-t-full bg-zinc-500" />
					</div>
				</div>
			</div>
			<span className="chip chip-pink absolute bottom-2 left-0 -rotate-6 shadow-[3px_3px_0_var(--border)]">
				{joinLabel}
			</span>
			<Sticker name="nowm" tilt={10} className="sticker-in absolute -right-1 -top-1 hidden w-24 sm:block" />
			<Sticker
				name="free"
				tilt={-12}
				className="sticker-in absolute -left-1 top-0 hidden w-20 sm:block"
			/>
			<Sticker
				name="camera"
				tilt={8}
				className="sticker-in absolute -bottom-2 right-2 hidden w-20 sm:block"
			/>
		</div>
	);
}
