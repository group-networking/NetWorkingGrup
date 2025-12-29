import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { ProfileContext } from "../contexts/ProfileContext";
import "./Modal.css";

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { photo, setPhoto } = useContext(ProfileContext);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Configurações</h2>

        <div className="color" style={{ marginBottom: "12px" }}>
          <strong>Tema:</strong> {theme === "light" ? "Claro" : "Escuro"}
        </div>

        <button className="submit" onClick={toggleTheme}>
          Alternar Tema
        </button>

        <button className="close" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
