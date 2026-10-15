import type { Metadata } from "next";
import Link from "next/link";
import ClickSparkles from "@/components/ClickSparkles";
import "./globals.css";

export const metadata: Metadata = {
	title: { default: "OpenBon", template: "%s · OpenBon" },
	description:
		"Create and use photo frames for campaigns, events, and communities. No watermark, no ads, no tracking. Open source.",
};

const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;
const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className="flex min-h-screen flex-col antialiased">
				<noscript>
					<style>{".reveal{opacity:1 !important}"}</style>
				</noscript>
				<ClickSparkles />
				<header>
					<nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
						<Link
							href="/"
							className="chip chip-lime -rotate-3 text-lg shadow-[3px_3px_0_var(--pink)] hover:rotate-0"
						>
							OpenBon
						</Link>
						<div className="flex items-center gap-4 text-sm font-bold">
							<Link href="/explore" className="tap text-muted hover:text-foreground">
								Explore
							</Link>
							<Link href="/create" className="btn btn-lime btn-sm">
								Make a frame
							</Link>
						</div>
					</nav>
				</header>
				<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
				<footer className="border-t-2 border-border">
					<div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
						<p className="md:max-w-md">Free, no watermark, no ads. Your photo is processed in your browser and never uploaded.</p>
						<div className="flex flex-wrap gap-x-5 whitespace-nowrap font-bold">
							<Link href="/thanks" className="tap hover:text-foreground">
								Special thanks
							</Link>
							{donateUrl ? (
								<a href={donateUrl} target="_blank" rel="noopener noreferrer" className="tap hover:text-foreground">
									Support OpenBon
								</a>
							) : null}
							{repoUrl ? (
								<a href={repoUrl} target="_blank" rel="noopener noreferrer" className="tap hover:text-foreground">
									GitHub
								</a>
							) : null}
						</div>
					</div>
				</footer>
			</body>
		</html>
	);
}
