import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import "../styles/auth.css";

function Login() {
  //folosim useState pentru a reține ce scrie utilizatorul în input-uri în timp real
  const [email, setEmail]=useState('');  //retine textul de la email
  const [parola, setParola]=useState('');  //retine textul de la parola
  const [error, setError]=useState(''); //reține mesajele de eroare venite de la server
  const navigate=useNavigate(); //inițializăm funcția de navigare 

  //funcția care se execută când utilizatorul apasă butonul de Login
  const handleLogin=async(e)=>{
    e.preventDefault();  //oprește reîncărcarea paginii la trimiterea formularului

    //cerere către backend (API) pentru autentificare
    const res=await fetch('https://devoted-harmony-production.up.railway.app/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },  //specificam ca trimitem date de tip json
      credentials: 'include',  //permite trimiterea și primirea de cookie-uri/sesiuni
      body: JSON.stringify({ email, parola })
    });

    if(res.ok){
      navigate('/produsele-mele');  //dacă e ok, ne mută pe pagina cu produsele mele
    }
    else{
      //dacă a apărut o eroare (date greșite), citim mesajul trimis de backend
      const data=await res.json();
      setError(data.message || 'Eroare la autentificare'); //afisam eroarea
    }

  };

  return (
    <div className="paginaAuth">
      <div className="authCard">
        <h2>Login</h2>

        {/* afisare conditionata: dacă există eroare, umple paragraful cu mesajul respectiv */}
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          {/* tipul 'password' ascunde caracterele pe ecran */}
          <input type="password" placeholder="Password" value={parola} onChange={(e) => setParola(e.target.value)} />
          <br />
          <button type="submit">Login</button>
          
          {/* Link către pagina de înregistrare dacă utilizatorul nu are cont */}
          <p>
            Nu ai cont? <Link to="/signup">Creează un cont</Link>
          </p>
        </form>
      </div> 
    </div>
    )
}
export default Login;