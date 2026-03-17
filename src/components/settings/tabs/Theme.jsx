import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/i18n";
import { setTheme as setUiTheme, setFont, setFontSize, setZoom } from "../../../redux/uiSlice";
import { setTheme as setBoolTheme } from "../../../redux/slices/themeSlice";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];

const Theme = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { theme = "light", font = "Arial", fontSize = "medium", zoom = 100 } = useSelector((s) => s.ui || {});

  // ✅ Use language CODE not display name
  const [language, setLanguage] = useState(
    (localStorage.getItem("app_language") || i18n.language || "en").substring(0, 2)
  );

  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isSyncingContact, setIsSyncingContact] = useState(false);

  // Keep language state in sync if changed from Profile tab
  useEffect(() => {
    const handleLangChange = (e) => {
      setLanguage(e.detail.language.substring(0, 2));
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  useEffect(() => {
    document.body.style.fontFamily = font;
  }, [font]);

  useEffect(() => {
    const scaleMap = { small: "0.875", medium: "1", large: "1.125", xlarge: "1.25" };
    const scale = scaleMap[fontSize] || "1";
    document.documentElement.style.setProperty("--font-scale", scale);
    document.documentElement.setAttribute("data-fontsize", fontSize);
  }, [fontSize]);

  const handleThemeChange = (e) => {
    const val = String(e.target.value).toLowerCase();
    dispatch(setUiTheme(val));
    dispatch(setBoolTheme(val === "dark"));
  };

  // ✅ This now actually changes the app language globally
  const handleLanguageChange = (e) => {
    const code = e.target.value;
    setLanguage(code);
    localStorage.setItem("app_language", code);
    i18n.changeLanguage(code);
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: code } }));
  };

  const handleFontChange = (e) => dispatch(setFont(e.target.value));

  const handleFontSizeChange = (e) => {
    const map = { Small: "small", Medium: "medium", Large: "large", "Extra Large": "xlarge" };
    dispatch(setFontSize(map[e.target.value] || String(e.target.value).toLowerCase()));
  };

  const handleZoomDecrease = () => dispatch(setZoom(Math.max(50, Number(zoom) - 10)));
  const handleZoomIncrease = () => dispatch(setZoom(Math.min(200, Number(zoom) + 10)));

  const handleSyncCalendar = () => {
    setIsSyncingCalendar(true);
    setTimeout(() => { setIsSyncingCalendar(false); alert(t("syncCalendar") + " ✓"); }, 1500);
  };

  const handleSyncContact = () => {
    setIsSyncingContact(true);
    setTimeout(() => { setIsSyncingContact(false); alert(t("syncContact") + " ✓"); }, 1500);
  };

  // Get display label for current language
  const currentLangLabel = LANGUAGES.find((l) => l.code === language)?.label || "English";

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[650px]">

        {/* Display Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-5">
            {t("display")}
          </h2>
          <SettingRow label={t("theme")} value={theme === "dark" ? t("dark") : t("light")}>
            <select
              value={theme === "dark" ? "Dark" : "Light"}
              onChange={handleThemeChange}
              className="w-full h-full px-4 py-3 rounded-xl border-0 bg-transparent
              focus:outline-none cursor-pointer opacity-0 absolute inset-0 z-10
              [&>option]:text-black [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-800"
            >
              <option value="Light">{t("light")}</option>
              <option value="Dark">{t("dark")}</option>
            </select>
          </SettingRow>
        </div>

        {/* General Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-5">
            {t("general")}
          </h2>

          <div className="space-y-4">

            {/* ✅ Language Dropdown - now changes app language */}
            <SettingRow label={t("language")} value={currentLangLabel}>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full h-full px-4 py-3 rounded-xl border-0 bg-transparent
                focus:outline-none cursor-pointer opacity-0 absolute inset-0 z-10
                [&>option]:text-black [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-800"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </SettingRow>

            <SettingRow label={t("font")} value={font}>
              <select
                value={font}
                onChange={handleFontChange}
                className="w-full h-full px-4 py-3 rounded-xl border-0 bg-transparent
                focus:outline-none cursor-pointer opacity-0 absolute inset-0 z-10
                [&>option]:text-black [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-800"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="'Courier New'">Courier New</option>
              </select>
            </SettingRow>

            <SettingRow label={t("fontSize")} value={
              fontSize === "small" ? "Small" : fontSize === "large" ? "Large" : fontSize === "xlarge" ? "Extra Large" : "Medium"
            }>
              <select
                value={fontSize === "small" ? "Small" : fontSize === "large" ? "Large" : fontSize === "xlarge" ? "Extra Large" : "Medium"}
                onChange={handleFontSizeChange}
                className="w-full h-full px-4 py-3 rounded-xl border-0 bg-transparent
                focus:outline-none cursor-pointer opacity-0 absolute inset-0 z-10
                [&>option]:text-black [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-gray-800"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </SettingRow>

            <SettingRow label={t("pageZoom")} value={`${zoom}%`}>
              <button onClick={handleZoomDecrease} disabled={zoom <= 50}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-lg transition disabled:opacity-30 disabled:cursor-not-allowed font-normal">
                -
              </button>
              <span className="text-black dark:text-white font-normal text-sm">{zoom}%</span>
              <button onClick={handleZoomIncrease} disabled={zoom >= 200}
                className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-lg transition disabled:opacity-30 disabled:cursor-not-allowed font-normal">
                +
              </button>
            </SettingRow>
          </div>
        </div>

        {/* Syncing Option Section */}
        <div>
          <h2 className="text-xl font-semibold text-black dark:text-white mb-5">
            {t("syncingOption")}
          </h2>
          <div className="space-y-4 mb-10">
            <SyncButton label={t("syncCalendar")} onClick={handleSyncCalendar} isSyncing={isSyncingCalendar} />
            <SyncButton label={t("syncContact")} onClick={handleSyncContact} isSyncing={isSyncingContact} />
          </div>
        </div>

      </div>
    </div>
  );
};

const SettingRow = ({ label, value, children }) => {
  const isSelect = children?.type === "select";

  if (isSelect) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-gray-200 bg-[#F9FAFB] dark:bg-[#1A1A1A] dark:border-gray-700 pointer-events-none">
          <label className="text-sm text-black dark:text-white font-normal">{label}</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-black dark:text-white font-normal">{value}</span>
            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute inset-0">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-gray-200 bg-[#F9FAFB] dark:bg-[#1A1A1A] dark:border-gray-700">
      <label className="text-sm text-black dark:text-white font-normal">{label}</label>
      <div className="flex items-center gap-4">{children}</div>
    </div>
  );
};

const SyncButton = ({ label, onClick, isSyncing }) => (
  <button
    onClick={onClick}
    disabled={isSyncing}
    className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-gray-200 bg-[#F9FAFB] text-black dark:bg-[#1A1A1A] dark:border-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:border-[#2461E6] dark:focus:border-[#73FBFD] transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="text-sm font-normal">{label}</span>
    <RefreshCw size={18} className={`text-gray-500 dark:text-gray-400 transition-transform ${isSyncing ? "animate-spin" : ""}`} />
  </button>
);

export default Theme;