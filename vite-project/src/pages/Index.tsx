import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import "./Index.css";

export default function Index() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="p-10 text-center">
        {user ? (
          <>
            <h2 className="text-2xl font-bold text-purple-600">
              Bem-vindo, {user.name}
            </h2>
          </>
        ) : (
          <>
            <div className="center-content">
              <p className="mt-2 text-gray-600">
                Explore conexões e conversas em tempo real.
              </p>
            </div>
            <br></br>
            <br></br>
            <div className="plano flex justify-around">
              <fieldset className="w-1/3">
              <div className="cardfree">
                <h3 className="text-xl font-semibold mb-2">Plano Grátis</h3>
                <p className="text-gray-700 mb-4">
                  Acesso básico para começar sua jornada.
                </p>
                <p className="text-gray-900 font-bold text-2xl">R$0/mês</p>
                <ul className="mt-4 text-sm text-gray-600">
                  <li>✓ Seguidores básicos</li>
                  <li>✓ Suporte de segurança padrão</li>
                </ul>
                <button id="btn-plano-gratis" className="btn-plano-gratis mt-6">
                  Começar Agora
                </button>
              </div>
              </fieldset>

              <fieldset className="w-1/3">
              <div className="cardpremium">
                <h3 className="text-xl font-semibold mb-2">Plano Premium</h3>
                <p className="mb-4">
                  Recursos avançados para usuários dedicados.
                </p>
                <p className="font-bold text-2xl">R$19,99/mês</p>
                <ul className="mt-4 text-sm">
                  <li>✓ Seguidores de Confiança</li>
                  <li>✓ Sem anúncios no site</li>
                  <li>✓ Suporte de segurança avançado</li>
                </ul>
                <button id="btn-plano-premium" className="btn-plano-premium mt-6">
                  Assinar Agora
                </button>
                </div>
            </fieldset>
            </div>
          </>
        )}
      </main>
    </>
  );
}
