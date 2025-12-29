import "./Modal.css";

type Props = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Login enviado (front-end)");
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Entrar</h2>

        <input placeholder="Email" required />
        <input placeholder="Senha" type="password" required />

        <button className="submit" type="submit">
          Entrar
        </button>
        <button type="button" className="close" onClick={onClose}>
          Fechar
        </button>
      </form>
    </div>
  );
}
