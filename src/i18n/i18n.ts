/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { TRANSLATIONS_EN } from ".";
import { config } from "@/config";

const currentLangeage = localStorage.getItem("i18nextLng");

export const DEFAULT_LANGUAGE =
  currentLangeage || config.env.VITE_LANGUAGE || "en";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: {
      format: function (value: any, format: any) {
        if (value instanceof Date) return dayjs(value).format(format);
        return value;
      },
      escapeValue: false,
    },
    resources: {
      en: {
        translation: TRANSLATIONS_EN,
      },
    },
    fallbackLng: "en",
    lng: DEFAULT_LANGUAGE,
  });

document.documentElement.lang = i18n.language;

void i18n.changeLanguage(DEFAULT_LANGUAGE);
