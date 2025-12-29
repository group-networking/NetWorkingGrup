import { createContext, useContext, useState } from "react";

type Lang = "pt" | "en";

const texts = {
  pt: {
    welcome: "Bem-vindo",
    settings: "Configurações",
  },
  en: {
    welcome: "Welcome",
    settings: "Settings",
  },
};

const LanguageContext = createContext<{
  lang: Lang;
  t: typeof texts.pt;
  setLang: (l: Lang) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("pt");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: texts[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
