const express = require("express");
const prisma = require("../lib/prisma");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

//claim produs
router.post("/:idProdus", requireAuth, async (req, res) => {
    const idProdus = parseInt(req.params.idProdus);

    const produs = await prisma.produs.findUnique({
        where: { id: idProdus },
    });
    if (!produs || !produs.disponibil) {
        return res.status(400).json({ message: "Produs indisponibil" });
    }
    if(produs.idUser === req.session.idUser){
        return res.status(400).json({ message: "Nu poti revendica propriul produs" });
    }

    const claim=await prisma.claim.create({
        data: {
            idUser: req.session.idUser,
            idProdus,
            status: "Trimis",
        },
    });

    //scoatem produsul
    await prisma.produs.update({
        where: { id: idProdus },
        data: { 
            dat: true,
            disponibil: false 
        },
    });

    res.status(201).json(claim);
});


// router.post("/", requireAuth, async (req, res) => {
//   const { idProdus } = req.body;

//   const produs = await prisma.produs.findUnique({
//     where: { id: idProdus },
//   });

//   if (!produs || !produs.disponibil) {
//     return res.status(400).json({ message: "Produs indisponibil" });
//   }

//   const claim = await prisma.claim.create({
//     data: {
//       idProdus,
//       idUser: req.session.idUser,
//     },
//   });

//   res.status(201).json(claim);
// });

module.exports = router;
