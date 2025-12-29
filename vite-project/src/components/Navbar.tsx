import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import AboutModal from "./AboutModal";
import SettingsModal from "./SettingsModal";
import "./Navbar.css";

export default function Navbar() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);
  const [about, setAbout] = useState(false);
  const [settings, setSettings] = useState(false);

  return (
    <>
      <nav className="navbar">
        <h1>NetWorking CodeFlow</h1>

        <div className="nav-buttons">
          <button className="sobre" onClick={() => setAbout(true)}>
            Sobre
          </button>
          <button onClick={() => setLogin(true)}>Entrar</button>
          <button className="primary" onClick={() => setRegister(true)}>
            Registrar
          </button>

          {/* Ícone de perfil */}
          <button
            className="profile-btn"
            onClick={() => setSettings(true)}
            title="Configurações"
          >
            👤
          </button>
        </div>
      </nav>

      {login && <LoginModal onClose={() => setLogin(false)} />}
      {register && <RegisterModal onClose={() => setRegister(false)} />}
      {about && <AboutModal onClose={() => setAbout(false)} />}
      {settings && <SettingsModal onClose={() => setSettings(false)} />}
    </>
  );
}
