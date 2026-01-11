const express = require('express');
const session = require('express-session');
const cors = require('cors');

const authRoutes= require('./routes/auth');
const produseRoutes= require('./routes/produse');
const claimsRoutes= require('./routes/claims');
const prieteniRoutes= require('./routes/prieteni');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backendul functioneaza!');
}
);

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