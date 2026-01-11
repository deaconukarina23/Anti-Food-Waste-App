import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adaugaProdus.css";

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

function AdaugaProdus(){
    const [nume, setNume]=useState("");
    const [cantitate, setCantitate]=useState(0);
    const [dataExpirare, setDataExpirare]=useState("");
    const [categorie, setCategorie]=useState("");

    const navigate=useNavigate();

    const handleSumbit=async(e)=>{
        e.preventDefault();
        const res=await fetch("http://localhost:3000/api/produse",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
                nume, 
                cantitate: Number(cantitate), 
                dataExpirare, 
                categorie
            }),
        });

        if(res.ok){
            navigate("/produsele-mele");
        }
        else{
            const data=await res.json();
            alert(data.message || "Eroare la adaugarea produsului");
        }
    };

    return (
        <div>
            <h2>Adauga Produs</h2>
            <div>
                <form onSubmit={handleSumbit}>
                    <input className="inputAdauga" type="text" placeholder="Nume Produs" value={nume} onChange={(e)=>setNume(e.target.value)}/><br />
                    <input className="inputAdauga" type="number" placeholder="Cantitate" value={cantitate} onChange={(e)=>setCantitate(e.target.value)}/><br />
                    <input className="inputAdauga" type="date" placeholder="Data Expirarii" value={dataExpirare} onChange={(e)=>setDataExpirare(e.target.value)}/><br />
                    <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
                        {categorii.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <br />
                    <button id="btnAdauga"type="submit">Adauga</button>
                </form>
            </div>
        </div>
    )
}
export default AdaugaProdus;