import Link from "next/link";
import Sticker from "@/components/Sticker";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
	const { t } = await getT();
	return (
		<div className="flex flex-col items-start gap-4 py-10">
			<div className="flex items-center gap-3">
				<span className="chip chip-pink -rotate-3">404</span>
				<Sticker name="sad" tilt={-8} className="sticker-in w-16" />
			</div>
			<h1 className="text-3xl font-extrabold tracking-tight">{t("nf.title")}</h1>
			<p className="text-muted">{t("nf.body")}</p>
			<Link href="/" className="btn btn-lime">
				{t("nf.home")}
			</Link>
		</div>
	);
}
