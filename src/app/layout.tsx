import type { Metadata, Viewport } from "next";
import Link from "next/link";
import ClickSparkles from "@/components/ClickSparkles";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: { default: "OpenBon: free photo frames, no watermark", template: "%s · OpenBon" },
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	keywords: [
		"photo frame",
		"profile picture frame",
		"twibbon alternative",
		"campaign frame",
		"no watermark",
		"open source",
		"free",
	],
	authors: [{ name: "OpenBon" }],
	alternates: { canonical: "/" },
	icons: {
		icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
	},
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		title: "OpenBon: free photo frames, no watermark",
		description: SITE_DESCRIPTION,
		url: "/",
		locale: "en_US",
		images: [{ url: "/og.png", width: 1200, height: 630, alt: "OpenBon: frame your face, for free." }],
	},
	twitter: {
		card: "summary_large_image",
		title: "OpenBon: free photo frames, no watermark",
		description: SITE_DESCRIPTION,
		images: ["/og.png"],
	},
	robots: { index: true, follow: true },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
		{ media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
	],
};

const donateUrl = process.env.NEXT_PUBLIC_DONATE_URL;
const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `try{var t=localStorage.getItem("openbon-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}setTimeout(function(){if(!window.__hydrated)document.documentElement.classList.add("reveal-all")},4000)`,
					}}
				/>
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
							className="chip chip-lime nav-in -rotate-3 text-lg shadow-[3px_3px_0_var(--pink)] hover:rotate-0"
						>
							OpenBon
						</Link>
						<div className="nav-links flex items-center gap-4 text-sm font-bold">
							<ThemeToggle />
							<Link href="/explore" className="tap text-muted hover:text-foreground">
								Explore
							</Link>
							<Link href="/create" className="btn btn-lime btn-sm">
								Make a frame
							</Link>
						</div>
					</nav>
				</header>
				<main className="page-in mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
				<footer className="foot-in border-t-2 border-border">
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
