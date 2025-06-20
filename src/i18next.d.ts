import "i18next";
import { TRANSLATIONS_EN } from "./translations";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: {
      translation: typeof TRANSLATIONS_EN;
    };
  }
}
