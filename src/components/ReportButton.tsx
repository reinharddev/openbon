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
			<button type="button" onClick={() => setOpen(true)} className="text-sm text-muted underline hover:text-foreground">
				Report this campaign
			</button>
		);
	}

	return (
		<form onSubmit={submit} className="flex max-w-md flex-col gap-2">
			<label htmlFor="reason" className="text-sm font-medium">
				Why should this campaign be reviewed?
			</label>
			<textarea
				id="reason"
				value={reason}
				onChange={(e) => setReason(e.target.value)}
				maxLength={300}
				rows={3}
				className="rounded-md border border-border bg-surface p-2 text-sm"
			/>
			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={state === "sending"}
					className="rounded-md bg-danger px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
				>
					Submit report
				</button>
				<button type="button" onClick={() => setOpen(false)} className="text-sm text-muted underline">
					Cancel
				</button>
				{state === "error" ? <span className="text-sm text-danger">Failed to send, please try again.</span> : null}
			</div>
		</form>
	);
}
