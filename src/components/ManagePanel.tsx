"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "./I18nProvider";

export default function ManagePanel({ slug }: { slug: string }) {
	const { t } = useI18n();
	const [key, setKey] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem(`openbon:key:${slug}`);
			if (saved) setKey(saved);
		} catch {}
	}, [slug]);

	async function onDelete() {
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`/api/campaigns/${slug}`, { method: "DELETE", headers: { "x-edit-key": key } });
			if (!res.ok) {
				const data = (await res.json().catch(() => ({}))) as { error?: string };
				setError(data.error ?? t("manage.errFail"));
				return;
			}
			try {
				localStorage.removeItem(`openbon:key:${slug}`);
			} catch {}
			setDeleted(true);
		} catch {
			setError(t("manage.errNet"));
		} finally {
			setBusy(false);
		}
	}

	if (deleted) {
		return (
			<div className="flex flex-col items-start gap-3">
				<p>{t("manage.deleted")}</p>
				<Link href="/" className="btn btn-ghost">
					{t("nf.home")}
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-5">
			<div>
				<Link href={`/c/${slug}`} className="tap font-bold text-accent-ink underline">
					/c/{slug}
				</Link>
			</div>

			<div>
				<label htmlFor="key" className="mb-1 block text-sm font-extrabold">
					{t("manage.key")}
				</label>
				<input
					id="key"
					value={key}
					onChange={(e) => setKey(e.target.value)}
					className="field font-mono"
					placeholder={t("manage.keyPh")}
				/>
			</div>

			{error ? <p className="text-sm text-danger">{error}</p> : null}

			{confirming ? (
				<div className="card card-pink flex flex-col gap-3 p-4">
					<p className="text-sm">{t("manage.confirm")}</p>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={onDelete}
							disabled={busy}
							className="btn btn-danger btn-sm"
						>
							{busy ? t("manage.deleting") : t("manage.yes")}
						</button>
						<button
							type="button"
							onClick={() => setConfirming(false)}
							className="btn btn-ghost btn-sm"
						>
							{t("manage.cancel")}
						</button>
					</div>
				</div>
			) : (
				<div>
					<button
						type="button"
						onClick={() => setConfirming(true)}
						disabled={!key}
						className="btn btn-danger"
					>
						{t("manage.delete")}
					</button>
				</div>
			)}
		</div>
	);
}
