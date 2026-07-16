import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Client, ColorOption } from "../types";
import { fetchClients, fetchColors } from "../api";
import { formatCpf } from "../validation";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    Promise.all([fetchClients(), fetchColors()])
      .then(([clientsData, colorsData]) => {
        setClients(clientsData);
        setColors(colorsData);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  // Mapa slug -> cor, para exibir rótulo e amostra a partir do valor salvo.
  const colorByValue = new Map(colors.map((color) => [color.value, color]));

  if (status === "loading") {
    return <p className="subtitle">Carregando clientes...</p>;
  }

  if (status === "error") {
    return (
      <p className="alert alert--error" role="alert">
        Não foi possível carregar os clientes. Verifique se a API está no ar e
        recarregue a página.
      </p>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="card empty">
        <p>Nenhum cliente cadastrado ainda.</p>
        <Link className="btn" to="/">
          Cadastrar o primeiro
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="subtitle">
        {clients.length} {clients.length === 1 ? "cliente" : "clientes"} cadastrado
        {clients.length === 1 ? "" : "s"}.
      </p>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>E-mail</th>
              <th>Cor</th>
              <th>Cadastrado em</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const color = colorByValue.get(client.favoriteColor);
              return (
                <tr key={client.id}>
                  <td>{client.fullName}</td>
                  <td>{formatCpf(client.cpf)}</td>
                  <td>{client.email}</td>
                  <td>
                    <span className="color-cell">
                      <span
                        className="color-dot"
                        style={{ background: color?.hex ?? "#ccc" }}
                        aria-hidden="true"
                      />
                      {color?.label ?? client.favoriteColor}
                    </span>
                  </td>
                  <td>{dateFormatter.format(new Date(client.createdAt))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
