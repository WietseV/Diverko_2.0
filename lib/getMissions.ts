import { sanityClient } from "./sanity.client";
import { missionsQuery } from "./sanity.queries";
import type { Language } from "@/lib/language";
import type { Image as SanityImageSource } from "sanity";

export type Mission = {
  _id: string;
  title?: string;
  summary?: string;
  href?: string;
  image?: SanityImageSource;
  categories?: string[];
};

export async function getMissions(lang: Language): Promise<Mission[]> {
  try {
    const data = await sanityClient.fetch<Mission[] | null>(missionsQuery, { lang });
    return data ?? [];
  } catch (error) {
    console.warn("Failed to fetch missions", error);
    return [];
  }
}
