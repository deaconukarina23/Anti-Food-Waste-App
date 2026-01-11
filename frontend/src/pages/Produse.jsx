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
  const [categorieSelectata, setCategorieSelectata] = useState("Toate");

  useEffect(() => {
    fetch("http://localhost:3000/api/produse", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProduse(data));
  }, []);

  const filtreazaProduse = () => {
    if (categorieSelectata === "Toate") {
      return produse;
    } else {
      return produse.filter(p => p.categorie === categorieSelectata);
    } 
  };

  const produseFiltrate = filtreazaProduse();

  const handleClaim = async (idProdus) => {
    const res = await fetch(`http://localhost:3000/api/claims/${idProdus}`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      alert("Claim trimis!");
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

      <div className="containerProduse">
        {produseFiltrate.map((p) => (
          <div className="produs" key={p.id}>
            <h3>{p.nume}</h3>
            <p>Cantitate: {p.cantitate}</p>
            <p>Categorie: {p.categorie}</p>
            <p>Expiră: {new Date(p.dataExpirare).toLocaleDateString()}</p>
            <hr />
            <p>Adăugat de: {p.user.nume}</p>
            <hr />
            <button id="btnClaim" onClick={ async () =>{
              const res = await fetch(`http://localhost:3000/api/claims/${p.id}`, 
              {
                method: "POST",
                credentials: "include",
              }
              );
              if(res.ok){
                alert("Claim trimis!");
                setProduse( prev => prev.filter(x => x.id !== p.id));
              } else {
                const data = await res.json();
                alert(data.message || "Eroare la trimiterea claim-ului");
              }
            }}>Claim</button>
          </div>
      ))}
    </div>
    </div>
  );
}

export default Produse;
