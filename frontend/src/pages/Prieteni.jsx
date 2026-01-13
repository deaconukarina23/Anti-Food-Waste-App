import { useEffect, useState } from "react";
import "../styles/prieteni.css";

function Prieteni() {
  const [email, setEmail] = useState("");
  const [prieteni, setPrieteni] = useState([]);
  const [cereri, setCereri] = useState([]);

  const incarcaTot=async()=>{
    //prieteni accepati
    const r1=await fetch("https://devoted-harmony-production.up.railway.app/api/prieteni", {
      credentials: "include",
    });
    const d1=await r1.json();
    setPrieteni(Array.isArray(d1)?d1:[]);

    //cereri de prietenie
    const r2=await fetch("https://devoted-harmony-production.up.railway.app/api/prieteni/cereri", {
      credentials: "include",
    });
    const d2=await r2.json();
    setCereri(Array.isArray(d2)?d2:[]);
  }

  useEffect(() => {
    incarcaTot();
  }, []);


  //trimite cerere noua
  const trimiteCerere=async(e)=>{
    e.preventDefault();
    const res=await fetch("https://devoted-harmony-production.up.railway.app/api/prieteni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const data=await res.json();
    if(!res.ok){
      alert(data.message || "Eroare la trimiterea cererii");
      return;
    }
    alert("Cerere trimisă cu succes!");
    setEmail("");
    incarcaTot(); //reîncărcăm listele pentru a vedea schimbarea
  }

  const accepta=async(id)=>{
    const res=await fetch(`https://devoted-harmony-production.up.railway.app/api/prieteni/cereri/${id}/accepta`, {
      method: "PATCH",
      credentials: "include",
    });
    const data=await res.json();
    if(!res.ok){
      alert(data.message || "Eroare la acceptarea cererii");
      return;
    }
    alert("Cerere acceptată!");
    incarcaTot();
  }

  //respinge cerere
  const respinge=async(id)=>{
    const res=await fetch(`https://devoted-harmony-production.up.railway.app/api/prieteni/cereri/${id}/refuza`, {
      method: "PATCH",
      credentials: "include",
    });
    const data=await res.json();  
    if(!res.ok){
      alert(data.message || "Eroare la respingerea cererii");
      return;
    }
    alert("Cerere respinsă!");
    incarcaTot();
  }

  return (
    <div>
      <h1>Prieteni</h1>

      {/* sectiune trimitere cereri */}
      <h3 className="titlu">Adauga prieten</h3>
      <form onSubmit={trimiteCerere}>
        <input id="emailPrieten" type="email" placeholder="Email prieten" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button id="btnTrimiteCerere" type="submit">Trimite cerere</button>
      </form>

      <hr/>

      {/* Sectiune acceptare/refuzare cereri */}
      <h3 className="titlu">Cereri de prietenie</h3>
      {cereri.length === 0 ? (
        <p>Nu ai cereri de prietenie.</p>
      ) : (
        cereri.map((c) => (
          <div id="cererePrietenie" key={c.id}>
            <p>{c.nume} ({c.email})</p>
            <div>
              <button onClick={() => accepta(c.id)}>Accepta</button>
              <button onClick={() => respinge(c.id)}>Respinge</button>
            </div>
          </div>
        ))
      )}

      <hr/>

      {/* lista de prieteni */}
      <h3 className="titlu">Prieteni</h3>
      {prieteni.length === 0 && <p>Nu ai prieteni adăugați.</p>}
      {prieteni.map((p) => (
        <div id="prieteniCard" key={p.id}>
          <h3>{p.nume}</h3>
          <p>{p.email}</p>
        </div>
      ))}
    </div>
  );
}
export default Prieteni;