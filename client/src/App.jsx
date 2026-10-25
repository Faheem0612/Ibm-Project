import { NavLink, Route, Routes } from "react-router-dom";
import Bikes from "./Bikes.jsx";
import Admin from "./Admin.jsx";

export default function App() {
  return (
    <>
      <header className="bar">
        <span className="logo">Spoke &amp; Chain</span>
        <nav>
          <NavLink to="/" end>Browse bikes</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Bikes />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </>
  );
}
