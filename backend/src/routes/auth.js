const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const router = express.Router();

// Inregistrare utilizator
router.post("/signup", async (req, res) => {
    const { email, parola, nume } = req.body;
    if (!email || !parola || !nume) {
        return res.status(400).json({ message: "Toate campurile sunt obligatorii." });
    }
    const existent=await prisma.user.findUnique({ where: { email } });
    if (existent) {
        return res.status(400).json({ message: "Emailul este deja folosit." });
    }
    const parolaHash = await bcrypt.hash(parola, 10);
    const user = await prisma.user.create({
        data: { email, parola: parolaHash, nume }
    });
    req.session.idUser = user.id;
    res.status(201).json({ message: "Utilizator creat cu succes.", userId: user.id });
});

//login utilizator
router.post("/login", async (req, res) => {
    const { email, parola } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "Email sau parola incorecte." });
    }
    const ok = await bcrypt.compare(parola, user.parola);
    if (!ok) {
        return res.status(400).json({ message: "Email sau parola incorecte." });
    }
    req.session.idUser = user.id;
    res.json({id: user.id, email: user.email, nume: user.nume});
});

//logout utilizator
router.post("/logout", (req, res) => {
    req.session.destroy();
    res.json({ message: "Deconectat cu succes." });
});


router.get('/me', async (req, res) => {
  if (!req.session.idUser) {
    return res.status(401).json({ message: 'Neautentificat' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.session.idUser },
    select: {
      id: true,
      email: true,
      nume: true
    }
  });

  res.json(user);
});


module.exports = router;