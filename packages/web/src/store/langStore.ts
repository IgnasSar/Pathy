import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  createElement,
} from "react";

export const LANGUAGES = ["LT", "EN", "PL", "LV", "DE"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "pathy_language";

function loadFromStorage(): Language {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as Language;
    return LANGUAGES.includes(raw) ? raw : "LT";
  } catch {
    return "LT";
  }
}

export interface LangStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LangContext = createContext<LangStore | null>(null);

export function LangStoreProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  return createElement(
    LangContext.Provider,
    {
      value: {
        language,
        setLanguage,
      },
    },
    children,
  );
}

export function useLangStore(): LangStore {
  const ctx = useContext(LangContext);
  if (!ctx)
    throw new Error("useLangStore must be used inside LangStoreProvider");
  return ctx;
}
