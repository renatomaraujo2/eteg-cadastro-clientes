import { useEffect, useState } from "react";
import type { ColorOption } from "./types";
import { fetchColors } from "./api";
import { ClientForm } from "./components/ClientForm";

export function App() {
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchColors()
      .then(setColors)
      .catch(() => setLoadError(true));
  }, []);

  return (
    <main className="container">
      <header className="header">
        <h1>Cadastro de clientes</h1>
        <p>Preencha os dados abaixo para registrar um novo cliente.</p>
      </header>

      {loadError && (
        <p className="alert alert--error" role="alert">
          Não foi possível carregar o formulário. Verifique se a API está no ar
          e recarregue a página.
        </p>
      )}

      {!loadError && done ? (
        <div className="card success" role="status">
          <h2>Cadastro concluído! 🎉</h2>
          <p>Os dados do cliente foram salvos com sucesso.</p>
          <button className="btn" onClick={() => setDone(false)}>
            Cadastrar outro cliente
          </button>
        </div>
      ) : (
        !loadError &&
        colors.length > 0 && (
          <ClientForm colors={colors} onSuccess={() => setDone(true)} />
        )
      )}
    </main>
  );
}
