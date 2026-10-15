"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

const PREFIX = "openbon:key:";

/** Paste an edit key to open its Manage page, or pick a campaign created on this device. */
export default function ManageFinder() {
	const { t } = useI18n();
	const router = useRouter();
	const [key, setKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [saved, setSaved] = useState<string[]>([]);

	useEffect(() => {
		try {
			const slugs: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (k?.startsWith(PREFIX)) slugs.push(k.slice(PREFIX.length));
			}
			setSaved(slugs);
		} catch {}
	}, []);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const value = key.trim();
		if (!value) return;
		setBusy(true);
		setError(null);
		try {
			const res = await fetch("/api/manage/lookup", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ key: value }),
			});
			const data = (await res.json().catch(() => ({}))) as { slug?: string };
			if (!res.ok || !data.slug) {
				setError(t("manage.finderNotFound"));
				return;
			}
			try {
				localStorage.setItem(`${PREFIX}${data.slug}`, value);
			} catch {}
			router.push(`/manage/${data.slug}`);
		} catch {
			setError(t("manage.errNet"));
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="flex flex-col gap-8">
			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<label htmlFor="finder-key" className="text-sm font-extrabold">
					{t("manage.key")}
				</label>
				<input
					id="finder-key"
					value={key}
					onChange={(e) => setKey(e.target.value)}
					className="field font-mono"
					placeholder={t("manage.keyPh")}
					autoComplete="off"
					spellCheck={false}
				/>
				{error ? <p className="text-sm text-danger">{error}</p> : null}
				<div>
					<button type="submit" disabled={busy || !key.trim()} className="btn btn-lime">
						{busy ? t("manage.finderBusy") : t("manage.finderBtn")}
					</button>
				</div>
			</form>

			{saved.length > 0 ? (
				<div>
					<h2 className="mb-3 text-sm font-extrabold">{t("manage.saved")}</h2>
					<ul className="flex flex-col gap-3">
						{saved.map((slug) => (
							<li key={slug}>
								<Link href={`/manage/${slug}`} className="card card-ink flex items-center justify-between gap-3 px-4 py-3">
									<span className="truncate font-bold">/c/{slug}</span>
									<span className="shrink-0 text-sm font-bold text-accent-ink">{t("create.manage")}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}
