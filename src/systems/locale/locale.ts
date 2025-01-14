import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import en from "./translation/en-US.json";

export class Locale {
  public static async init() {
    await i18next.use(I18nextBrowserLanguageDetector).init({
      //supportedLngs: ["en-US"],
      fallbackLng: "en",
      //lowerCaseLng: true,
      //debug: true,
      resources: {
        en,
      },
    });
  }

  public static getLocaleCode() {
    return i18next.language;
  }

  public static t(key: string, options?: any) {
    return i18next.t(key, options);
  }
}
