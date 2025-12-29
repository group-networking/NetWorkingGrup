import "./Modal.css";

type Props = {
  onClose: () => void;
};

export default function AboutModal({ onClose }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sobre</h2>
        <p>
          NetWorking CodeFlow é uma plataforma para desenvolvedores se
          conectarem, trocarem ideias e colaborarem em tempo real.
        </p>

        <button className="close" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
