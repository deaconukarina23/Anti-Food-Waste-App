const express = require('express');
const bcrypt = require('bcrypt'); //pt criptarea parolelor
const prisma = require('../lib/prisma'); //acces la baza de date
const router = express.Router(); //creeaza un "mini-server" doar pentru /api/auth, grupeaza rutele de autentificare

//Inregistrare utilizator
router.post("/signup", async (req, res) => {
    const { email, parola, nume } = req.body; //citirea datelor din request (datele vin din frontend)

    //verificam ca nu lipsesc campuri
    if (!email || !parola || !nume) {
        return res.status(400).json({ message: "Toate campurile sunt obligatorii." });
    }
    const existent=await prisma.user.findUnique({ where: { email } }); //cautam utilizator cu acelasi email
    //verificam daca email e folosit
    if (existent) {
        return res.status(400).json({ message: "Emailul este deja folosit." });
    }
    const parolaHash = await bcrypt.hash(parola, 10); //transforma parola intr-un hasj securizat
    
    //creare user in BD
    const user = await prisma.user.create({
        data: { email, parola: parolaHash, nume }
    });
    req.session.idUser = user.id; //utilizatorul e logat imediat dupa signup
    res.status(201).json({ message: "Utilizator creat cu succes.", userId: user.id });
});

//login utilizator
router.post("/login", async (req, res) => {
    const { email, parola } = req.body;

    //cautare user
    const user = await prisma.user.findUnique({ where: { email } });  
    if (!user) {
        return res.status(400).json({ message: "Email sau parola incorecte." });
    }
    const ok = await bcrypt.compare(parola, user.parola); //compara parola introdusa cu hash-ul din BD
    if (!ok) {
        return res.status(400).json({ message: "Email sau parola incorecte." });
    }
    req.session.idUser = user.id;  //login reusit, sesiune activa
    res.json({id: user.id, email: user.email, nume: user.nume}); //returnam date usserului (fara parola) pt a putea fi utilizate in frontend
});

//logout utilizator
router.post("/logout", (req, res) => {
    req.session.destroy();  //sterge sesiunea din server
    res.json({ message: "Deconectat cu succes." });
});

//verifica daca userul e logat
router.get('/me', async (req, res) => {
    //daca in sesiune nu exista un idUser, atunci utilizatorul nu e logat
  if (!req.session.idUser) {
    return res.status(401).json({ message: 'Neautentificat' });
  }

  //cautam datele utilizatorului logat folosing id-ul salvat in sesiune
  const user = await prisma.user.findUnique({
    where: { id: req.session.idUser },
    select: { //select ne permite sa alegem campurile dorite
      id: true,
      email: true,
      nume: true
    }
  });

  res.json(user);
});

//exportam routerul pt a putea fi folosit in server.js
module.exports = router;