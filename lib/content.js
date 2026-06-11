// ---------------------------------------------------------------------------
// Content layer.
// Today: reads structured seed files from /content (works fully offline).
// Later: when NEXT_PUBLIC_SANITY_PROJECT_ID is set, swap the readers below
// for Sanity GROQ fetches — page components need no changes.
// ---------------------------------------------------------------------------
import site from "@/content/site.json";
import home from "@/content/home.json";
import capabilities from "@/content/capabilities.json";
import markets from "@/content/markets.json";
import products from "@/content/products.json";
import work from "@/content/work.json";
import sustainability from "@/content/sustainability.json";
import company from "@/content/company.json";
import careers from "@/content/careers.json";
import locations from "@/content/locations.json";

export const getSite = () => site;
export const getHome = () => home;
export const getCapabilities = () => capabilities;
export const getMarkets = () => markets;
export const getMarket = (slug) => markets.items.find((m) => m.slug === slug);
export const getProducts = () => products;
export const getProduct = (slug) => products.items.find((p) => p.slug === slug);
export const getWork = () => work;
export const getCase = (slug) => work.items.find((w) => w.slug === slug);
export const getSustainability = () => sustainability;
export const getCompany = () => company;
export const getCareers = () => careers;
export const getLocations = () => locations;

// Split "before |accent| after" into renderable parts
export const accentSplit = (s) => s.split("|");
