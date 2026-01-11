import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/produseleMele.css";

function ProduseleMele() {
  const [user, setUser] = useState(null);
  const [produse, setProduse] = useState([]);
  const [alerta, setAlerta]=useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    //vericare user autentificat
    fetch("http://localhost:3000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUser(data);
      });

      //afisare produse ale userului
      fetch("http://localhost:3000/api/produse/me", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setProduse(data));
},[]);

  if (!user) return <p>Loading...</p>;

  const logout = async () => {
    await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  }
  
  return (
    <div>
        <button id="btnLogout" onClick={logout}>Logout</button> 
        <h3 className="titlu">Salut, {user.nume}!</h3>
        <hr />
        <h2>Produsele Mele</h2>

        <div className="containerProduse">
        {produse.length===0 && <p>Nu ai produse adaugate.</p>}
        {produse.map((p) => (
            <div className="produs" key={p.id}>
                <h3>{p.nume}</h3>
                <p>Cantitate: {p.cantitate}</p>
                <p>Categorie: {p.categorie}</p>
                <p>Expiră: {new Date(p.dataExpirare).toLocaleDateString()}</p>
                <hr />

                <button disabled={p.disponibil}
                onClick={ () => {
                fetch(`http://localhost:3000/api/produse/${p.id}/disponibil`, {
                  method: "PATCH",
                  credentials: "include",
                })
                .then( res => res.json())
                .then(() => {
                  setProduse(prev => prev.map( x => 
                    x.id === p.id ? { ...x, disponibil: true } : x
                    )  
                  );
                });
              }}>
                {p.disponibil ? "Disponibil" : "Marcheaza disponibil"}
              </button>
            </div>
            
          )

        )

      }
    </div>
    </div>
  )

}

export default ProduseleMele;