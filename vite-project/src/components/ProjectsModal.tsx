import { useEffect, useState } from "react";
import "./Modal.css";
import { useLanguage } from "../contexts/LanguageContext";

type Project = {
  id: string;
  name: string;
  description?: string;
};

export default function ProjectsModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(t.projects.error);
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [t.projects.error]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{t.projects.title}</h2>
        <button className="close" onClick={onClose}>
          {t.projects.close}
        </button>
      </div>
    </div>
  );
}
