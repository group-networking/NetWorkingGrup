import "./Modal.css";
import { useLanguage } from "../contexts/LanguageContext";

type Props = {
  onClose: () => void;
};

export default function RegisterModal({ onClose }: Props) {
  const { t } = useLanguage();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>{t.register.title}</h2>

        <input placeholder={t.register.name} required />
        <input placeholder={t.register.email} required />
        <input placeholder={t.register.password} type="password" required />

        <button className="submit" type="submit">
          {t.register.submit}
        </button>
        <button type="button" className="close" onClick={onClose}>
          {t.register.close}
        </button>
      </form>
    </div>
  );
}
