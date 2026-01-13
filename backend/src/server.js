//import framework Express pentru crearea serverului HTTP
const express = require('express');
//importa middleware-ul pentru gestionarea sesiunilor utilizatorilor (login)
const session = require('express-session');
//importa CORS pentru a permite cererile de la alta origine
const cors = require('cors');

//importa rutele
const authRoutes= require('./routes/auth');
const produseRoutes= require('./routes/produse');
const claimsRoutes= require('./routes/claims');
const prieteniRoutes= require('./routes/prieteni');

//initializeaza aplicatia Express
const app = express();

//permite forntend-ului sa comunice cu backendul
app.use(cors({
    origin: 'http://localhost:5173',  //adresa serverului de Frontend
    credentials: true                 //permite transmitrea sesiunilor/cookies intre origini diferite
}));

//middleware pentru parsarea corpului cererilor in format JSON (req.body)
app.use(express.json());

// ruta de test sa vedem daca serverul ruleaza
app.get('/', (req, res) => {
    res.send('Backendul functioneaza!');
}
);

//configurare sesiune utilizator
app.use(session({
    secret: 'super-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 zi
}));

app.use("/api/auth", authRoutes);
app.use("/api/produse", produseRoutes);
app.use("/api/claims", claimsRoutes);
app.use("/api/prieteni", prieteniRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});