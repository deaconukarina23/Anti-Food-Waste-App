import { useState } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/auth.css";

function SignUp() {
  const [email, setEmail] = useState('');  //retine textul de la email
  const [parola, setParola] = useState('');
  const [nume, setNume] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  //functia care gestioneaza trimiterea datelor la server
  const handleSignUp = async (e) => {
    e.preventDefault();
    //cerere de tip POST către ruta de signup din backend
    const res = await fetch('http://devoted-harmony-production.up.railway.app/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, //specificăm că datele sunt în format JSON
      credentials: 'include',
      body: JSON.stringify({ email, parola, nume }) 
    });

    if (res.ok) {
      navigate('/login');
    }
    else {
      const data = await res.json();
      alert(data.message || 'Eroare la inregistrare');
    }
  };

  return (
    <div className="paginaAuth">
      <div className="authCard">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input type="text" placeholder="Nume" value={nume} onChange={(e) => setNume(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={parola} onChange={(e) => setParola(e.target.value)} />
        <button type="submit">Creeaza cont</button>
        </form>
      </div>
    </div>
  );
}
export default SignUp;