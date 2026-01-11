const express = require("express");
const prisma = require("../lib/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Produsele mele
// router.get("/", requireAuth, async (req, res) => {
//   const produse = await prisma.produs.findMany({
//     where: { disponibil: true },
//     include: { categorie: true, user: true }
//   });
//   res.json(produse);
// });


// adaug produs
router.post("/", requireAuth, async (req, res) => {
  const { nume, cantitate, dataExpirare, categorie } = req.body;

  if(!req.session.idUser){
    return res.status(401).json({ message: 'Neautentificat' });
  }

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
            idUser: req.session.idUser,
            dat: false,
        },
        orderBy: {
            dataExpirare: "asc",
        },
    });
    res.json(produse);
});

//produsele disponibile
router.get("/", requireAuth, async (req, res) => {
    const prieteni = await prisma.prieten.findMany({
        where: {
            idUser: req.session.idUser,
            status: "Acceptat",
        },
        select: {
            idPrieten: true
        },
    });
    const prietenIds = prieteni.map(p => p.idPrieten);

    const produse = await prisma.produs.findMany({
        where: {
            idUser: { in: prietenIds },
            disponibil: true,
            dat: false,
        },
        include:{
            user: {
                select: { nume: true }
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
        disponibil: true 
    },
  });

  res.json(produs);
});
           
module.exports = router;