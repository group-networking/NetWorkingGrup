import "./Modal.css";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  onClose: () => void;
  onOpenRegister?: () => void;
};

export default function LoginModal({ onClose, onOpenRegister }: Props) {
  const { t } = useLanguage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Login enviado (front-end)");
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>{t.login.title}</h2>

        <input placeholder={t.login.email} required />
        <input placeholder={t.login.password} type="password" required />

        <button className="submit" type="submit">
          {t.login.submit}
        </button>
        <a
          href="#"
          className="modal-link"
          onClick={(e) => {
            e.preventDefault();
            onOpenRegister?.();
          }}
        >
          Não tem uma conta? Registre-se
        </a>
        <a href="#">Esqueceu a senha</a>
        <button type="button" className="close" onClick={onClose}>
          {t.login.close}
        </button>
      </form>
    </div>
  );
}
