import { useState } from "react";
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail]=useState('');
  const [parola, setParola]=useState(''); 
  const [error, setError]=useState('');
  const navigate=useNavigate();

  const handleLogin=async(e)=>{
    e.preventDefault();
    const res=await fetch('http://localhost:3000/api/auth/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, parola })
    });

    if(res.ok){
      navigate('/produsele-mele');
    }
    else{
      const data=await res.json();
      setError(data.message || 'Eroare la autentificare');
    }

  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <input type="password" placeholder="Password" value={parola} onChange={(e) => setParola(e.target.value)} />
          <br />
          <button type="submit">Login</button>
          <p>
            Nu ai cont? <Link to="/signup">Creează un cont</Link>
          </p>
        </form>
      </div> 
    </div>
    )
}
export default Login;