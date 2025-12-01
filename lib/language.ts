import { cookies, headers as getHeaders } from "next/headers";
import type { PortableTextBlock } from "@portabletext/types";
import { LANG_COOKIE, LANGUAGES, type Language, normalizeLanguage } from "./locales";

export { LANG_COOKIE, LANGUAGES, normalizeLanguage };
export type { Language } from "./locales";

export type LocalizedString = Partial<Record<Language, string>>;
export type LocalizedBlocks = Partial<Record<Language, PortableTextBlock[]>>;

export async function getLanguage(): Promise<Language> {
  const headersList = await getHeaders();
  const headerLang = headersList.get("x-diverko-lang");
  if (headerLang) {
    return normalizeLanguage(headerLang);
  }

  const cookieStore = await cookies();
  const stored = cookieStore.get("NEXT_LOCALE")?.value ?? cookieStore.get(LANG_COOKIE)?.value;
  return normalizeLanguage(stored);
}

export function localizeString(value: LocalizedString | undefined, lang: Language): string | undefined {
  return value?.[lang] ?? value?.en ?? value?.nl ?? value?.fr;
}

export function localizeBlocks(value: LocalizedBlocks | undefined, lang: Language): PortableTextBlock[] | undefined {
  return value?.[lang] ?? value?.en ?? value?.nl ?? value?.fr;
}
