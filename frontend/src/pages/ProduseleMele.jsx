import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/produseleMele.css";

function ProduseleMele() {
  const [user, setUser] = useState(null); //retine datele profilului logat
  const [produseActive, setProduseActive] = useState([]);
  const [produseDate, setProduseDate] = useState([]);
  const [produsePrimite, setProdusePrimite] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    //vericare user autentificat
    fetch("https://devoted-harmony-production.up.railway.app/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/login"); //daca serverul zice ca nu sunt logat, trimitem fortat userul la Login
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });

    //afisare produse ale userului
    fetch("https://devoted-harmony-production.up.railway.app/api/produse/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProduseActive(data));
      
    //afisare produse date
    fetch("https://devoted-harmony-production.up.railway.app/api/claims/date", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProduseDate(data));

    //produse revendicate de mine
    fetch("https://devoted-harmony-production.up.railway.app/api/claims/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setProdusePrimite(data));
},[]); // [] asigură rularea acestor fetch-uri doar o data, la incarcarea paginii

  if (!user) return <p>Loading...</p>;

  //logout
  const logout = async () => {
    await fetch("https://devoted-harmony-production.up.railway.app/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  }
  
  return (
    <div id="paginaProdMele">
      <br/>
      <div id="prodHeader">
        <h3 className="titlu">Salut, {user.nume}!</h3>
        <button id="btnLogout" onClick={logout}>Logout</button> 
      </div>

        {/* produse active */}
        <h2>Produsele Mele</h2>
        <div className="containerProduse">
        {produseActive.length===0 && <p>Nu ai produse adaugate.</p>}
        {produseActive.map((p) => (
            <div className="produs" key={p.id}>
                <h3>{p.nume}</h3>
                <p>Cantitate: {p.cantitate}</p>
                <p>Categorie: {p.categorie}</p>
                <p>Expiră: {new Date(p.dataExpirare).toLocaleDateString()}</p>
                <hr />

                {/* buton care schimba starea produsului în "Disponibil" pentru prieteni */}
                <button disabled={p.disponibil}
                onClick={ () => {
                fetch(`https://devoted-harmony-production.up.railway.app/api/produse/${p.id}/disponibil`, {
                  method: "PATCH",
                  credentials: "include",
                })
                .then( res => res.json())
                .then(() => {
                  //cautam produsul modificat și îi setăm disponibil pe true
                  setProduseActive(prev => prev.map( x => 
                    x.id === p.id ? { ...x, disponibil: true } : x
                  ));
                });
              }}>

                {/* textul butonului se schimba în functie de starea produsului */}
                {p.disponibil ? "Disponibil" : "Marcheaza disponibil"}
              </button>
            </div>            
          )
        )}
        </div>
        <hr/>

        {/* produse date */}
        <h2>Produse date</h2>
        <div className="containerProduse">
        {produseDate.length === 0 && <p>Nu ai produse date</p>}
        {produseDate.map((c) => (
          <div className="produs" key={c.id}>
            <h4>{c.produs.nume}</h4>
            <p>Cantitate: {c.produs.cantitate}</p>
            <p>Expira: {new Date(c.produs.dataExpirare).toLocaleDateString()}</p>
            {/* c.user.nume este persoana care a luat produsul */}
            <p>Luat de: {c.user.nume}</p>
          </div>
        ))}
        </div>
        <hr/>

        {/* produse primite */}
        <h2>Produsele Revendicate</h2>
        <div className="containerProduse">
        {produsePrimite.length === 0 && <p>Nu ai revendicat niciun produs</p>}
        {produsePrimite.map((p) => (
          <div className="produs" key={p.id}>
            <h4>{p.produs.nume}</h4>
            {/* p.produs.user.nume este persoana de la care ai primit produsul */}
            <p>De la: {p.produs.user.nume}</p>
            <p>Categorie: {p.produs.categorie}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProduseleMele;