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
				className="btn btn-ghost btn-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-violet"
			>
				{buttonLabel}
			</label>
			<span className="min-w-0 truncate text-sm text-muted">{status}</span>
		</div>
	);
}
