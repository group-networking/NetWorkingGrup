import "./Modal.css";

type Props = {
  onClose: () => void;
};

export default function RegisterModal({ onClose }: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Registro enviado (front-end)");
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Registrar</h2>

        <input placeholder="Nome" required />
        <input placeholder="Email" required />
        <input placeholder="Senha" type="password" required />

        <button className="submit" type="submit">
          Criar conta
        </button>
        <button type="button" className="close" onClick={onClose}>
          Fechar
        </button>
      </form>
    </div>
  );
}
