import type { MetadataRoute } from "next";

const BASE_URL = "https://gig-tax-calculator.vercel.app";

const ROUTES = [
  "/",
  "/tools",
  "/tools/mileage-deduction",
  "/tools/1099-vs-w2",
  "/tools/quarterly-deadlines",
  "/guides/mileage-deduction",
  "/guides/1099-vs-w2",
  "/guides/quarterly-estimated-taxes",
  "/about",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
