import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Produse from "./pages/Produse";
import ProduseleMele from "./pages/ProduseleMele";
import Prieteni from "./pages/Prieteni";
import AdaugaProdus from "./pages/AdaugaProdus";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/produsele-mele" element={<ProduseleMele />} />
        <Route path="/produse" element={<Produse />} />
        <Route path="/adauga-produs" element={<AdaugaProdus />} />
        <Route path="/prieteni" element={<Prieteni />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
