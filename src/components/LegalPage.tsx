import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import type { LegalDoc } from "@/content/legal";

function fill(text: string) {
	const parts = text.split(/(\{email\}|\{site\})/g);
	return parts.map((part, i) => {
		if (part === "{email}") {
			return (
				<a key={i} href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-accent-ink underline">
					{CONTACT_EMAIL}
				</a>
			);
		}
		if (part === "{site}") return <span key={i}>{SITE_URL.replace(/^https?:\/\//, "")}</span>;
		return <span key={i}>{part}</span>;
	});
}

export default function LegalPage({ doc }: { doc: LegalDoc }) {
	return (
		<article className="mx-auto flex max-w-2xl flex-col gap-8">
			<header>
				<h1 className="text-3xl font-extrabold tracking-tight">
					<span className="mark">{doc.title}</span>
				</h1>
				<p className="mt-3 text-muted">{doc.intro}</p>
				{doc.updated ? <p className="mt-2 text-xs text-muted">{doc.updated}</p> : null}
			</header>
			{doc.sections.map((s) => (
				<section key={s.h} className="card card-ink p-5">
					<h2 className="mb-2 text-lg font-extrabold">{s.h}</h2>
					<div className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
						{s.p.map((para, i) => (
							<p key={i}>{fill(para)}</p>
						))}
					</div>
				</section>
			))}
		</article>
	);
}
