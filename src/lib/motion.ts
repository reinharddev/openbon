export const MOTION_KEY = "openbon-motion";

/** True when animations are switched off (by the toggle, or by the system "reduce motion" setting). */
export function motionOff(): boolean {
	if (typeof document === "undefined") return true;
	return document.documentElement.dataset.motion === "off";
}
