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
              <p>Faça login ou registre-se para começar.</p>
              <p className="mt-2 text-gray-600">
                Explore conexões e conversas em tempo real.
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
