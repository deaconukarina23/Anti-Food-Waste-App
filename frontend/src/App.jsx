import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

//importam paginile componente ale aplicatiei
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Produse from "./pages/Produse";
import ProduseleMele from "./pages/ProduseleMele";
import Prieteni from "./pages/Prieteni";
import AdaugaProdus from "./pages/AdaugaProdus";

function AppContent() {
  //ne oferă informații despre URL-ul curent (ex: unde se află utilizatorul)
  const location = useLocation();

  //verificăm dacă suntem pe pagina de Login sau SignUp. 
  //dacă da, variabila hideNavbar va fi 'true' pentru a nu afișa meniul de navigare acolo.
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
    {/*afișăm Navbar-ul doar dacă NU suntem pe paginile de login/signup */}
      {!hideNavbar && <Navbar />}

      {/*containerul pentru toate rutele (paginile) aplicației */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/produsele-mele" element={<ProduseleMele />} />
        <Route path="/produse" element={<Produse />} />
        <Route path="/adauga-produs" element={<AdaugaProdus />} />
        <Route path="/prieteni" element={<Prieteni />} />

        {/*dacă utilizatorul scrie un URL care nu există, este redirecționat automat la pagina de Login */}
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
