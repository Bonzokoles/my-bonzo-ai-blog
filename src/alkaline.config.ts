import type { Author, Blog, NavEntry, Site, Socials } from "./types/types";

/**
 * @description This file contains the configuration for the Alkaline theme.
 * - There are quite a few settings, but they allow for a vast amount of automatization across the theme
 * @exports SITE - The site configuration object
 * @exports NAVIGATION - The navigation configuration object
 * @exports BLOG - The blog configuration object
 */

//  SITE socials - used for the site footer
// See: ./Types/types.ts for more info on author socials
export const socials: Socials[] = [
	{
		platform: "email",
		url: "JimBoZen@proton.me",
	},
	{
		platform: "web",
		url: "https://www.mybonzoaiblog.com",
	},
	{
		platform: "rss",
		url: "/feed.xml",
	}
];

export const AUTHORS: Author[] = [
	{
		id: 1,
		name: "Redakcja MyBonzo",
		socials: socials,
		email: 'JimBoZen@proton.me'
	}
]

export const SITE: Site = {
	title: "MyBonzo AI Blog",
	showTitleBackground: true,
	faviconSrc: "/apple-touch-icon.png", // in public directory
	url: "https://www.mybonzoaiblog.com",
	ogImage: "/og-image.webp", // in public directory
	author: "Redakcja MyBonzo", // Made with ❤️ by {your-name}
	description: "Blog o sztucznej inteligencji, narzędziach AI i technologiach przyszłości",
	keywords: ["AI", "sztuczna inteligencja", "blog", "technologia", "mybonzo"],
	disableIndexing: false, // true for no indexing
	socials: socials,
	locale: "pl_PL",
	postsPerPage: 5,
	shikiConfig: {
		// ctrl+space for theme suggestions
		theme: "night-owl",
	},
	// I provide  Types for many of the top Google Fonts, edit or remove ./Types/google-fonts.d.ts to add/remove font types
	fonts: [
		{
			typeface: "serif",
			fontFamily: "SUSE",
			fontWeights: ["100..800"],
		},
		{
			typeface: "sans",
			fontFamily: "Roboto",
			fontWeights: ["100..900"],
			includeItalic: true,
		},
		{
			typeface: "mono",
			fontFamily: "Fira Code",
			fontWeights: [400, 500, 700],
		},
	],
	// Trouble with the fonts? It's likely because a font family name isn't EXACTLY correct or the font weights you're trying to fetch are not supported for that font family. For example, setting Fira Code with fontWeights: ["400...700"] will not work because Fira Code only supports 400, 500, and 700.
};

// TODO: "slug" is the more appropriate term  here but would require more changes throughout the theme

export const NAVIGATION: NavEntry[] = [
	{
		href: "/",
		text: "Strona główna",
		icon: "home",
	},
	{
		href: "/blog",
		text: "Blog",
		icon: "article",
	},
	{
		href: "/r2-blog",
		text: "Artykuły",
		icon: "file-text",
	},
	{
		href: "#",
		text: "AI Tools",
		icon: "robot",
		submenu: [
			{
				href: "/system/ai-chat",
				text: "AI Chat",
				icon: "chat-1",
			},
			{
				href: "https://ee304a89.gemini-ai-generator.pages.dev",
				text: "Generator Grafiki",
				icon: "image",
				external: true,
			},
			{
				href: "/ai-tools",
				text: "Wszystkie narzędzia",
				icon: "grid",
			},
		]
	},
	{
		href: "/eksperymenty",
		text: "Eksperymenty",
		icon: "flask",
	},
	{
		href: "/poradniki",
		text: "Poradniki",
		icon: "book-open",
	},
	{
		href: "#",
		text: "System",
		icon: "settings",
		submenu: [
			{
				href: "/system",
				text: "Dashboard",
				icon: "dashboard",
			},
			{
				href: "/system/media",
				text: "Media",
				icon: "folder",
			},
		]
	},
	{
		href: "/o-nas",
		text: "O nas",
		icon: "info",
	},
	{
		href: "/pro",
		text: "MyBonzo Pro",
		icon: "star",
	},
	{
		href: "/search",
		text: "Search",
		icon: "search",
	},
	{
		href: "/newsletter",
		text: "Newsletter",
		icon: "mail",
	},
];

export const BLOG: Blog = {
	title: "MyBonzo AI Blog",
	author: "Redakcja MyBonzo",
	description: SITE.description || "",
	keywords: SITE.keywords,
	postsPerPage: SITE.postsPerPage,
};

// export the name(s) of the collections as a list - must match the name of the collection in the ./Types/types.ts file
export const COLLECTION_NAMES_LIST = ["blog"] as const;