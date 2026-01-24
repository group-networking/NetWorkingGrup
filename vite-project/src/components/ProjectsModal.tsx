import { useEffect, useState } from "react";
import "./Modal.css";
import { useLanguage } from "../contexts/LanguageContext";

type FileItem = {
  id: string;
  name: string;
  size?: number;
  preview?: string; // data-url para preview de imagem
  type?: string; // tipo MIME
};

type Project = {
  id: string;
  name: string;
  description?: string;
  files?: FileItem[];
};

export default function ProjectsModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Carregar projetos do localStorage
    try {
      const saved = localStorage.getItem("projects");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error("Erro ao carregar projetos do localStorage:", err);
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const { t } = useLanguage();

  // Salvar projetos no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem("projects", JSON.stringify(projects));
      console.log("Projetos salvos no localStorage:", projects);
    } catch (err) {
      console.error("Erro ao salvar projetos no localStorage:", err);
    }
  }, [projects]);

  useEffect(() => {
    // Tentar carregar projetos da API também
    setLoading(true);
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // Silenciosamente ignorar erro
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, projectId: string) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;

    // Converter para array e adicionar
    const newFiles = Array.from(files).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: undefined, // Sem preview por enquanto
    }));

    // Atualizar estado imediatamente
    setProjects(prevProjects => 
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              files: [...(project.files || []), ...newFiles],
            }
          : project
      )
    );

    // Mostrar alerta
    alert(`${files.length} arquivo(s) adicionado(s) com sucesso!`);
    
    // Limpar input
    e.target.value = "";
  };

  const handleDownloadFile = (file: FileItem) => {
    alert(`Download: ${file.name}\n(Função de download será integrada com backend)`);
    // TODO: Implementar download real quando tiver backend
  };

  const handleOpenFile = (file: FileItem) => {
    alert(`Abrir: ${file.name}\n(Função de abrir será integrada com backend)`);
    // TODO: Implementar abertura real quando tiver backend
  };

  const handleDeleteFile = (projectId: string, fileId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? {
              ...project,
              files: project.files?.filter(f => f.id !== fileId) || [],
            }
          : project
      )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      setProjects(prevProjects =>
        prevProjects.filter(p => p.id !== projectId)
      );
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id);
    setProjectName(project.name);
  };

  const handleSaveProject = (projectId: string) => {
    if (projectName.trim()) {
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, name: projectName }
            : project
        )
      );
    }
    setEditingProject(null);
    setProjectName("");
  };

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: newProjectName,
        description: "",
        files: undefined,
      };
      setProjects(prevProjects => [...prevProjects, newProject]);
      setNewProjectName("");
      setShowAddProject(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal projects-modal">
        <div className="projects-header">
          <h2>{t.projects.title}</h2>
          <button
            className="new-project-btn"
            onClick={() => setShowAddProject(!showAddProject)}
            title="Novo projeto"
          >
            +
          </button>
        </div>

        {showAddProject && (
          <div className="add-project-form">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nome do novo projeto"
              className="edit-input"
              onKeyPress={(e) => e.key === "Enter" && handleAddProject()}
            />
            <button className="btn-save" onClick={handleAddProject}>
              ✓
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowAddProject(false)}
            >
              ✕
            </button>
          </div>
        )}

        <div className="projects-list">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="project-item">
                {editingProject === project.id ? (
                  <div className="project-edit-mode">
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Nome do projeto"
                      className="edit-input"
                      autoFocus
                    />
                    <p className="edit-preview">{projectName || "Nome do projeto"}</p>
                    <div className="edit-actions">
                      <button
                        className="btn-save"
                        onClick={() => handleSaveProject(project.id)}
                      >
                        ✓ Salvar
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditingProject(null)}
                      >
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="project-header">
                      <div className="project-info">
                        <h3>{project.name}</h3>
                        {project.description && <p>{project.description}</p>}
                      </div>
                      
                      <div className="project-actions">
                        <button
                          className="add-files-btn"
                          onClick={() => document.getElementById(`file-input-${project.id}`)?.click()}
                          title="Adicionar arquivos"
                        >
                          +
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProject(project)}
                          title="Editar projeto"
                        >
                          ✎
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProject(project.id)}
                          title="Excluir projeto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <input
                      id={`file-input-${project.id}`}
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload(e, project.id)}
                      style={{ display: "none" }}
                      accept="*/*"
                    />
                  </>
                )}

                {project.files && project.files.length > 0 && (
                  <div className="project-files-list">
                    <div className="files-header">📁 Arquivos ({project.files.length})</div>
                    {project.files.map((file) => (
                      <div key={file.id} className="file-item">
                        <div className="file-preview">
                          {file.preview && file.preview.startsWith("data:image") ? (
                            <img src={file.preview} alt={file.name} />
                          ) : (
                            <div className="file-icon">📄</div>
                          )}
                        </div>
                        <div className="file-info">
                          <span className="file-name" title={file.name}>
                            {file.name}
                          </span>
                          {file.size ? (
                            <span className="file-size">
                              {(file.size / 1024).toFixed(2)} KB
                            </span>
                          ) : (
                            <span className="file-size">Tamanho desconhecido</span>
                          )}
                        </div>
                        <div className="file-actions">
                          <button
                            className="action-btn open-btn"
                            onClick={() => handleOpenFile(file)}
                            title="Abrir arquivo"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn download-btn"
                            onClick={() => handleDownloadFile(file)}
                            title="Download do arquivo"
                          >
                            ⬇️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDeleteFile(project.id, file.id)}
                            title="Excluir arquivo"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhum projeto encontrado</p>
          )}
        </div>

        <button className="close" onClick={onClose}>
          {t.projects.close}
        </button>
      </div>
    </div>
  );
}
