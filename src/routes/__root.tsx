import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { ConvexClientProvider } from "../lib/convex";

import appCss from "../styles.css?url";

const STRUCTURED_DATA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Sip n' Dip Donuts",
  image: "/logo512.png",
  url: "https://sipndipdonutsfl.com",
  telephone: "+1-407-892-1252",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1001 13th St",
    addressLocality: "Saint Cloud",
    addressRegion: "FL",
    postalCode: "34769",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.2486,
    longitude: -81.2812,
  },
  servesCuisine: ["Donuts", "Coffee", "Boba Tea", "Breakfast"],
  priceRange: "$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "1715",
    bestRating: "5",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "06:00", closes: "14:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "06:00", closes: "15:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "07:00", closes: "13:00" },
  ],
});

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark')?stored:'light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(mode);root.setAttribute('data-theme',mode);root.style.colorScheme=mode;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Sip n' Dip Donuts | Fresh Handmade Donuts in Saint Cloud, FL" },
      {
        name: "description",
        content:
          "Sip n' Dip Donuts — a beloved family donut shop in Saint Cloud, FL. Handmade donuts, strong coffee, boba tea, and a whole lot of love. Open daily.",
      },
      // Open Graph
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Sip n' Dip Donuts | Fresh Handmade Donuts in Saint Cloud, FL" },
      { property: "og:description", content: "A beloved family donut shop in Saint Cloud, FL. Handmade donuts, strong coffee, boba tea, and a whole lot of love." },
      { property: "og:site_name", content: "Sip n' Dip Donuts" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "/logo512.png" },
      // Twitter Card
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Sip n' Dip Donuts | Saint Cloud, FL" },
      { name: "twitter:description", content: "Handmade donuts, strong coffee, boba tea, and a whole lot of love." },
      { name: "twitter:image", content: "/logo512.png" },
      // Additional SEO
      { name: "theme-color", content: "#e91e63" },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍩</text></svg>" },
      { rel: "apple-touch-icon", href: "/logo192.png" },
      { rel: "canonical", href: "https://sipndipdonutsfl.com" },
    ],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: STRUCTURED_DATA }}
        />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere]">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <ConvexClientProvider>
      <Header />
      <Outlet />
      <Footer />
    </ConvexClientProvider>
  );
}
