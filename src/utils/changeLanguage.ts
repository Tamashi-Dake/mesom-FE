import i18n from "i18next";

export const changeLanguage = (language: string): void => {
  i18n.changeLanguage(language);
  localStorage.setItem("i18nextLng", language);
};
