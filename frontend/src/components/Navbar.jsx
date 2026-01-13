//importăm componenta Link din react-router-dom pentru navigare internă
// ink previne reîncărcarea paginii (refresh), făcând aplicația mult mai rapidă
import { Link } from 'react-router-dom';
import "../styles/navbar.css";

function Navbar() {
    return (
        <nav className='navbar'>
            <h3>Anti Food Waste</h3>
            <div className="navLinks"> {/* Containerul care grupează toate link-urile de navigare */}
                <Link to="/produse">Produse</Link> | {" "}
                <Link to="/produsele-mele">Produsele Mele</Link> | {" "}
                <Link to="/adauga-produs">Adaugă Produs</Link> | {" "}  
                <Link to="/prieteni">Prieteni</Link>
            </div>
        </nav>
    );
}
export default Navbar; 