import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageSelect from "./LanguageSelect";
import "./Modal.css";

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, updateAvatar } = useAuth();
  const { t } = useLanguage();

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{t.settings}</h2>

        <div style={{ marginBottom: "12px" }}>
          <strong>{t.settingsModal.themeLabel}</strong>{" "}
          {theme === "light"
            ? t.settingsModal.themeLight
            : t.settingsModal.themeDark}
        </div>

        <button className="submit" onClick={toggleTheme}>
          {t.settingsModal.toggleTheme}
        </button>

        <div style={{ marginTop: 16 }}>
          <strong>{t.settingsModal.languageLabel}</strong>
          <div style={{ marginTop: 8 }}>
            <LanguageSelect />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <strong>{t.settingsModal.profilePhoto}</strong>

          <div style={{ marginTop: 8 }} className="profile-row">
            <label className="text-sm cursor-pointer text-purple-600">
              {t.settingsModal.changePhoto}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>

            <img
              src={user?.avatar || "https://via.placeholder.com/80"}
              className="profile-image"
              alt="Avatar"
            />
          </div>
          <button type="button" id="logout" className="logout">
            Sair da conta
          </button>
        </div>

        <button className="close" onClick={onClose}>
          {t.settingsModal.close}
        </button>
      </div>
    </div>
  );
}
