import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { CadastroPage } from "./pages/CadastroPage";
import { ClientesPage } from "./pages/ClientesPage";

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav__link nav__link--active" : "nav__link";

export function App() {
  return (
    <BrowserRouter>
      <main className="container">
        <header className="header">
          <h1>Cadastro de clientes</h1>
          <nav className="nav">
            <NavLink to="/" end className={navClass}>
              Cadastrar
            </NavLink>
            <NavLink to="/clientes" className={navClass}>
              Clientes
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<CadastroPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
