import { useTranslation } from "react-i18next";

export default function ComingSoon() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center gap-2 overflow-y-auto pt-20">
      <h1>{t("Coming soon!")}</h1>
      <p className="text-foreground2">
        {t("This feature is going to be Implemented in the future.")}
      </p>
      <img className="w-3/5" src="svg/commingSoon.svg" alt="Coming soon" />
    </div>
  );
}
