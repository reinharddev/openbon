"use client";

type Props = {
	id: string;
	accept: string;
	multiple?: boolean;
	buttonLabel: string;
	status: string;
	onFiles: (files: FileList | null) => void;
};

/** Styled replacement for the native file input. */
export default function FilePicker({ id, accept, multiple, buttonLabel, status, onFiles }: Props) {
	return (
		<div className="flex items-center gap-3">
			<input
				id={id}
				type="file"
				accept={accept}
				multiple={multiple}
				onChange={(e) => onFiles(e.target.files)}
				className="peer sr-only"
			/>
			<label
				htmlFor={id}
				className="cursor-pointer rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium hover:border-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
			>
				{buttonLabel}
			</label>
			<span className="min-w-0 truncate text-sm text-muted">{status}</span>
		</div>
	);
}
