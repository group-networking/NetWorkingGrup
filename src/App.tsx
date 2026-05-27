import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// Dados organizados para evitar repetição de código (DRY - Don't Repeat Yourself)
const DOC_LINKS = [
  {
    href: "https://vite.dev/",
    logo: viteLogo,
    alt: "Logo do Vite",
    text: "Explorar Vite",
  },
  {
    href: "https://react.dev/",
    logo: reactLogo,
    alt: "Logo do React",
    text: "Ler Mais",
  },
];

const SOCIAL_LINKS = [
  {
    href: "https://github.com/vitejs/vite",
    icon: "#github-icon",
    text: "GitHub",
  },
  { href: "https://chat.vite.dev/", icon: "#discord-icon", text: "Discord" },
  { href: "https://x.com/vite_js", icon: "#x-icon", text: "X.com" },
  {
    href: "https://bsky.app/profile/vite.dev",
    icon: "#bluesky-icon",
    text: "Bluesky",
  },
];

function App() {
  return (
    <main className="app-container">
      {/* Seção Hero */}
      <section id="center">
        <div className="hero">
          <img
            src={heroImg}
            className="base"
            width="170"
            height="179"
            alt="Imagem Hero de introdução"
          />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Começar no Vite + React</h1>
          <p>
            <code>Acesse um dos meus sistemas abaixo</code>
          </p>
        </div>
      </section>

      <hr className="ticks" />

      {/* Seção de Links e Próximos Passos */}
      <section id="next-steps">
        {/* Documentação */}
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Sobre o Vite</h2>
          <p>Clique em um deles para acessar a documentação</p>
          <ul>
            {DOC_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  <img className="logo" src={link.logo} alt={link.alt} />
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Redes Sociais */}
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Conecte-se com Vite + React</h2>
          <p>Junte-se à comunidade Vite</p>
          <ul>
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer noopener">
                  <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href={`/icons.svg${link.icon}`}></use>
                  </svg>
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="ticks" />
    </main>
  );
}

export default App;
