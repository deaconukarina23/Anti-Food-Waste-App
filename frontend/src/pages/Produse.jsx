import { useEffect, useState } from "react";
import "../styles/produs.css";

const categorii=[
    "Legume",
    "Fructe",
    "Lactate",
    "Carne",
    "Paine",
    "Dulciuri",
    "Bauturi",
    "Altele"
]

function Produse() {
  const [produse, setProduse] = useState([]);
  const [categorieSelectata, setCategorieSelectata] = useState("Toate"); //reține categoria aleasă în filtru

  useEffect(() => {
    fetch("https://devoted-harmony-production.up.railway.app/api/produse", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProduse(data)); //salvăm produsele în starea componentei
  }, []);

  //functia decide ce produse apar pe ecran în funcție de dropdown
  const filtreazaProduse = () => {
    if (categorieSelectata === "Toate") {
      return produse; // Dacă nu am ales o categorie, le arătăm pe toate
    } else {
      //returnam doar produsele care au categoria egală cu cea selectată
      return produse.filter(p => p.categorie === categorieSelectata);
    } 
  };

  //rezultatul filtrării care va fi parcurs în partea de return (HTML)
  const produseFiltrate = filtreazaProduse();


  const handleClaim = async (idProdus) => {
    const res = await fetch(`https://devoted-harmony-production.up.railway.app/api/claims/${idProdus}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      alert("Claim trimis!");
      //dupa ce am revendicat produsul, il ștergem din lista afișată
      //folosim .filter pentru a pastra doar produsele care nu au id-ul celui revendicat
      setProduse(prev => prev.filter(p => p.id !== idProdus));
    }
    else {
      const data = await res.json();
      alert(data.message || "Eroare la trimiterea claim-ului");
    }
  };

  return (
    <div>
      <h1>Produse disponibile</h1>

      <label>Filtreaza dupa categorie:</label>
      <select id="selectCategorie" value={categorieSelectata} onChange={(e) => setCategorieSelectata(e.target.value)}>
        <option value="Toate">Toate</option>
        {categorii.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <hr />

      {/* Lista de produse */}
      <div className="containerProduse">
        {produseFiltrate.map((p) => (
          <div className="produs" key={p.id}>
            <h3>{p.nume}</h3>
            <p>Cantitate: {p.cantitate}</p>  
            <p>Categorie: {p.categorie}</p>
            <p>Expiră: {new Date(p.dataExpirare).toLocaleDateString()}</p>
            <hr />
            <p>Adăugat de: {p.user.nume}</p>  {/* p.user.nume vine din "include" de la backend */}
            <hr />
            
            <button id="btnClaim" onClick={ () => handleClaim(p.id) }>Claim</button>
          </div>
      ))}
    </div>
    </div>
  );
}

export default Produse;
