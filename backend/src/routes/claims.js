const express = require("express");
const prisma = require("../lib/prisma");  //acces la BD
const requireAuth = require("../middleware/requireAuth"); //middleware care blocheaza utilizatorii neautentificati

const router = express.Router();  //defineste rutele

//claim produs
//folosim :idPRodus in URL pentru a identifica exact de produs vrea userul
router.post("/:idProdus", requireAuth, async (req, res) => {
    const idProdus = parseInt(req.params.idProdus);  //extrage id-ul din URL si il transformam in nr. intreg

    //cautam produseul in BD
    const produs = await prisma.produs.findUnique({
        where: { id: idProdus },
    });

    //verificam daca exista sau daca e marcat ca disponibil
    if (!produs || !produs.disponibil) {
        return res.status(400).json({ message: "Produs indisponibil" });
    }
    
    //verificam daca userul vrea sa dea claim la produsul lui
    if(produs.idUser === req.session.idUser){
        return res.status(400).json({ message: "Nu poti revendica propriul produs" });
    }

    //cream inregistrarea in tabelul Claim
    const claim=await prisma.claim.create({
        data: {
            idUser: req.session.idUser,  //id-ul celui bcare face cererea
            idProdus,   //id-ul produsului
        },
    });

    //scoatem produsul
    await prisma.produs.update({
        where: { id: idProdus },
        data: { 
            dat: true,  //marcam ca a fost dat
            disponibil: false  //nu mai e vizibil 
        },
    });

    res.status(201).json(claim);
});

//produsele revendicate de mine
router.get("/me", requireAuth, async(req, res) => {
    const claims=await prisma.claim.findMany({
        where: {
            idUser: req.session.idUser,
        },
        include: {
            produs: {
                include: {
                    user: {
                        select: { nume: true }
                    }
                }
            }
        }
    });
    res.json(claims);
});

//produsele date
router.get("/date", requireAuth, async(req, res) => {
    const produseDate=await prisma.claim.findMany({
        where: {
            produs: {
                idUser: req.session.idUser,
                dat: true,
            }
        },
        include: {
            user: { select: { nume: true } },
            produs: true,
        }
    });

    res.json(produseDate);
});


module.exports = router;
