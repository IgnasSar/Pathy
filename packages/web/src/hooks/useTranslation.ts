import { useLangStore } from "../store/langStore";
import { translations } from "../i18n/translations";
import type { TranslationKey } from "../i18n/translations";

export function useTranslation() {
  const { language } = useLangStore();

  const t = (key: TranslationKey): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.LT;
  };

  return { t };
}
