"use client";

import { useState } from "react";

export default function ReportButton({ slug }: { slug: string }) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setState("sending");
		try {
			const res = await fetch(`/api/campaigns/${slug}/report`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ reason }),
			});
			setState(res.ok ? "done" : "error");
		} catch {
			setState("error");
		}
	}

	if (state === "done") {
		return <p className="text-sm text-muted">Thanks, your report has been received.</p>;
	}

	if (!open) {
		return (
			<button type="button" onClick={() => setOpen(true)} className="tap text-sm font-bold text-muted underline hover:text-foreground">
				Report this campaign
			</button>
		);
	}

	return (
		<form onSubmit={submit} className="flex max-w-md flex-col gap-2">
			<label htmlFor="reason" className="text-sm font-extrabold">
				Why should this campaign be reviewed?
			</label>
			<textarea
				id="reason"
				value={reason}
				onChange={(e) => setReason(e.target.value)}
				maxLength={300}
				rows={3}
				className="field"
			/>
			<div className="flex flex-wrap items-center gap-3">
				<button type="submit" disabled={state === "sending"} className="btn btn-danger btn-sm">
					Submit report
				</button>
				<button type="button" onClick={() => setOpen(false)} className="tap text-sm font-bold text-muted underline">
					Cancel
				</button>
				{state === "error" ? <span className="text-sm text-danger">Failed to send, please try again.</span> : null}
			</div>
		</form>
	);
}
