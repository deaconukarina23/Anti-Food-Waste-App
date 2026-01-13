const express = require("express");
const prisma = require("../lib/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//adauga produs
router.post("/", requireAuth, async (req, res) => {
    const { nume, cantitate, dataExpirare, categorie } = req.body;
    
    if(!req.session.idUser){
        return res.status(401).json({ message: 'Neautentificat' });
    }

    //se creeaza un produs
    const produs = await prisma.produs.create({
        data: {
        nume,
        cantitate,
        dataExpirare: new Date(dataExpirare),
        categorie,
        idUser: req.session.idUser,
        },
    });

    res.status(201).json(produs);
});

//Produsele mele
router.get("/me", requireAuth, async (req, res) => {
    const produse = await prisma.produs.findMany({
        where: {
            idUser: req.session.idUser, //doar produsele utilizatorului curent
            dat: false,  //nu mai apar produsele la care alti useri au dat claim
        },
        orderBy: {
            dataExpirare: "asc",  //apar primele cele care exprira mai repede
        }
    });
    res.json(produse);
});

//produsele disponibile(ale prietenilor)
router.get("/", requireAuth, async (req, res) => {
    const prieteni = await prisma.prieten.findMany({
        where: {
            idUser: req.session.idUser, //doar produsele prietenii utilizatorului logat acum
            status: "Acceptat",
        },
        select: {
            idPrieten: true
        },
    });

    //extragem doar id-urile prietenilor
    const prietenIds = prieteni.map(p => p.idPrieten);

    //luam produsele disponibile
    const produse = await prisma.produs.findMany({
        where: {
            idUser: { in: prietenIds }, //id-ul userului care a postat produsul trebuie sa fie in lista de prieteni 
            disponibil: true,
            dat: false,
        },
        include:{
            user: {
                select: { nume: true }  //avem nevoie de numele utilizatorului
            }
        }
    });
    
    res.json(produse);
});


//marcare produs ca disponibil
router.patch("/:id/disponibil", requireAuth, async (req, res) => {
  const produs = await prisma.produs.update({
    where: { 
        id: Number(req.params.id), 
        idUser: req.session.idUser 
    },
    data: { 
        disponibil: true //il facem vizibil doar pentru prieteni
    },
  });

  res.json(produs);
});
           
module.exports = router;