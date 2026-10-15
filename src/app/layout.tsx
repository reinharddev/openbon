import type { Metadata } from "next";
import Link from "next/link";
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
				<header className="border-b border-border">
					<nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
						<Link href="/" className="text-lg font-semibold tracking-tight">
							OpenBon
						</Link>
						<div className="flex items-center gap-5 text-sm">
							<Link href="/explore" className="text-muted hover:text-foreground">
								Explore
							</Link>
							<Link
								href="/create"
								className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-foreground hover:opacity-90"
							>
								Create campaign
							</Link>
						</div>
					</nav>
				</header>
				<main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
				<footer className="border-t border-border">
					<div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
						<p>Free, no watermark, no ads. Your photo is processed in your browser and never uploaded.</p>
						<div className="flex gap-4">
							<Link href="/thanks" className="hover:text-foreground">
								Special thanks
							</Link>
							{donateUrl ? (
								<a href={donateUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
									Support OpenBon
								</a>
							) : null}
							{repoUrl ? (
								<a href={repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
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
