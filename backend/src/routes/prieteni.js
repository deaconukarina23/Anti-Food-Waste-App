const express = require("express");
const prisma = require("../lib/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//Trimite cerere prietenie
router.post("/", requireAuth, async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ message: 'Email prieten obligatoriu' });
    }

    const prieten = await prisma.user.findUnique({
        where: { email },
    });

    if(!prieten){
        return res.status(404).json({ message: 'Utilizatorul nu exista' });
    }

    if(prieten.id === req.session.idUser){
        return res.status(400).json({ message: 'Nu te poti adauga pe tine ca prieten' });
    }

    const existaDeja=await prisma.prieten.findFirst({
        where: {
            idUser: req.session.idUser,
            idPrieten: prieten.id,
        },
    });
    if(existaDeja){
        return res.status(400).json({ message: 'Prieten deja adaugat' });
    }

    const cerere = await prisma.prieten.create({
        data: {
            idUser: req.session.idUser,
            idPrieten: prieten.id,
            status: "In asteptare",
        },
    });

    res.status(201).json(cerere);
});

//lista prieteni
router.get("/", requireAuth, async (req, res) => {
    const prieteni = await prisma.prieten.findMany({
        where: { 
            idUser: req.session.idUser,
            status: "Acceptat",
        },
    });

    const ids=prieteni.map(p => p.idPrieten);
    const useriPrieteni = await prisma.user.findMany({
        where: { id: { in: ids } },
        select: { id: true, nume: true, email: true },
    });

    res.json(useriPrieteni);
});

//lista cereri primite
router.get("/cereri", requireAuth, async (req, res) => {
    const cereri = await prisma.prieten.findMany({
        where: { 
            idPrieten: req.session.idUser,
            status: "In asteptare",
        },
    });
    const ids=cereri.map(c => c.idUser);
    const useriCereri = await prisma.user.findMany({
        where: { id: { in: ids } },
        select: { id: true, nume: true, email: true },
    });

    const rezultat = cereri.map(c => ({
        id: c.id,
        idUser: c.idUser,
        nume: useriCereri.find(u => u.id === c.idUser)?.nume,
        email: useriCereri.find(u => u.id === c.idUser)?.email,
    }));

    res.json(rezultat);
});

//accepta cerere prietenie
router.patch("/cereri/:id/accepta", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const cerere = await prisma.prieten.findUnique({ where: { id } });

    if(!cerere){
        return res.status(404).json({ message: 'Cerere prietenie inexistenta' });
    }
    if(cerere.idPrieten !== req.session.idUser){
        return res.status(403).json({ message: 'Nu ai permisiunea de a accepta aceasta cerere' });
    }

    const cerereAcceptata = await prisma.prieten.update({
        where: { id },
        data: { status: "Acceptat" },
    });

    //creez relatia inversa
    await prisma.prieten.create({
        data: {
            idUser: req.session.idUser,
            idPrieten: cerere.idUser,
            status: "Acceptat",
        },
    });
    res.json(cerereAcceptata);
});

//refuza cerere prietenie
router.patch("/cereri/:id/refuza", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const cerere = await prisma.prieten.findUnique({ where: { id } });

    if(!cerere){
        return res.status(404).json({ message: 'Cerere prietenie inexistenta' });
    }
    if(cerere.idPrieten !== req.session.idUser){
        return res.status(403).json({ message: 'Nu ai permisiunea de a refuza aceasta cerere' });
    }

    await prisma.prieten.update({
        where: { id },
        data: { status: "Refuzat" },
    });

    return res.json({message: 'Cerere refuzata'});
});

module.exports = router;

