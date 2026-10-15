import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import ClickSparkles from "@/components/ClickSparkles";
import GithubLink from "@/components/GithubLink";
import { I18nProvider } from "@/components/I18nProvider";
import LangToggle from "@/components/LangToggle";
import MotionToggle from "@/components/MotionToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { getT } from "@/lib/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
	const { locale, t } = await getT();
	const title = t("meta.title");
	const description = t("meta.description");
	return {
		metadataBase: new URL(SITE_URL),
		title: { default: title, template: "%s · OpenBon" },
		description,
		applicationName: SITE_NAME,
		keywords: [
			"photo frame",
			"profile picture frame",
			"bingkai foto",
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
			title,
			description,
			url: "/",
			locale: locale === "id" ? "id_ID" : "en_US",
			images: [{ url: "/og.png", width: 1200, height: 630, alt: "OpenBon" }],
		},
		twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
		robots: { index: true, follow: true },
	};
}

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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { locale, t } = await getT();
	return (
		<html lang={locale} suppressHydrationWarning>
			<body className="flex min-h-screen flex-col antialiased">
				<Script id="theme-init" strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `try{var t=localStorage.getItem("openbon-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t;var m=localStorage.getItem("openbon-motion");if(m!=="on"&&m!=="off")m=matchMedia("(prefers-reduced-motion: reduce)").matches?"off":"on";document.documentElement.dataset.motion=m}catch(e){}setTimeout(function(){if(!window.__hydrated)document.documentElement.classList.add("reveal-all")},4000)`,
					}}
				/>
				<noscript>
					<style>{".reveal{opacity:1 !important}"}</style>
				</noscript>
				<ClickSparkles />
				<I18nProvider locale={locale}>
				<header>
					<nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
						<Link
							href="/"
							className="chip chip-lime nav-in -rotate-3 text-lg shadow-[3px_3px_0_var(--pink)] hover:rotate-0"
						>
							OpenBon
						</Link>
						<div className="nav-links flex items-center gap-4 text-sm font-bold">
							<span className="hidden md:contents">
								<GithubLink />
							</span>
							<span className="hidden sm:contents">
								<LangToggle />
								<MotionToggle />
							</span>
							<ThemeToggle />
							<Link href="/explore" className="tap hidden text-muted hover:text-foreground sm:inline-flex">
								{t("nav.explore")}
							</Link>
							<Link href="/create" className="btn btn-lime btn-sm">
								{t("nav.make")}
							</Link>
						</div>
					</nav>
				</header>
				<main className="page-in mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
				<footer className="foot-in border-t-2 border-border">
					<div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
						<div className="flex flex-col gap-3 md:max-w-md">
							<div className="flex gap-3 sm:hidden">
								<LangToggle />
								<MotionToggle />
							</div>
							<p>{t("foot.tagline")}</p>
						</div>
						<div className="flex flex-wrap gap-x-5 whitespace-nowrap font-bold">
							<Link href="/thanks" className="tap hover:text-foreground">
								{t("foot.thanks")}
							</Link>
							<Link href="/manage" className="tap hover:text-foreground">
								{t("foot.manage")}
							</Link>
							<Link href="/terms" className="tap hover:text-foreground">
								{t("foot.terms")}
							</Link>
							<Link href="/privacy" className="tap hover:text-foreground">
								{t("foot.privacy")}
							</Link>
							<Link href="/contact" className="tap hover:text-foreground">
								{t("foot.contact")}
							</Link>
							<Link href="/explore" className="tap hover:text-foreground sm:hidden">
								{t("nav.explore")}
							</Link>
							{donateUrl ? (
								<a href={donateUrl} target="_blank" rel="noopener noreferrer" className="tap hover:text-foreground">
									{t("foot.support")}
								</a>
							) : null}
							<GithubLink className="gh-pill-foot" />
						</div>
					</div>
				</footer>
				</I18nProvider>
			</body>
		</html>
	);
}
