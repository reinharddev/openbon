export type SizePreset = { id: string; w: number; h: number; ratio: string; labelKey: `size.${string}` };

/** Popular social formats. All fit OpenBon's 200 to 2048 px limits. */
export const SIZE_PRESETS: SizePreset[] = [
	{ id: "square", w: 1080, h: 1080, ratio: "1:1", labelKey: "size.square" },
	{ id: "portrait", w: 1080, h: 1350, ratio: "4:5", labelKey: "size.portrait" },
	{ id: "story", w: 1080, h: 1920, ratio: "9:16", labelKey: "size.story" },
	{ id: "landscape", w: 1600, h: 900, ratio: "16:9", labelKey: "size.landscape" },
	{ id: "banner", w: 1500, h: 500, ratio: "3:1", labelKey: "size.banner" },
	{ id: "cover", w: 1640, h: 624, ratio: "2.63:1", labelKey: "size.cover" },
];

/** Draws a transparent PNG with dashed guides so creators know where the edges and face area are. */
export function makeTemplateBlob(p: { w: number; h: number }): Promise<Blob | null> {
	const c = document.createElement("canvas");
	c.width = p.w;
	c.height = p.h;
	const x = c.getContext("2d");
	if (!x) return Promise.resolve(null);
	const unit = Math.min(p.w, p.h);
	const lw = Math.max(4, unit / 160);
	x.setLineDash([lw * 4, lw * 3]);
	x.lineWidth = lw;
	x.strokeStyle = "#6d28d9";
	x.strokeRect(lw / 2, lw / 2, p.w - lw, p.h - lw);
	x.strokeStyle = "#16a34a";
	x.beginPath();
	x.arc(p.w / 2, p.h / 2, unit * 0.36, 0, Math.PI * 2);
	x.stroke();
	x.setLineDash([]);
	x.beginPath();
	x.moveTo(p.w / 2 - unit * 0.03, p.h / 2);
	x.lineTo(p.w / 2 + unit * 0.03, p.h / 2);
	x.moveTo(p.w / 2, p.h / 2 - unit * 0.03);
	x.lineTo(p.w / 2, p.h / 2 + unit * 0.03);
	x.stroke();
	x.font = `800 ${Math.round(unit / 20)}px system-ui, sans-serif`;
	x.fillStyle = "#6d28d9";
	x.fillText(`${p.w} x ${p.h}`, lw * 6, lw * 6 + unit / 20);
	return new Promise((resolve) => c.toBlob(resolve, "image/png"));
}
