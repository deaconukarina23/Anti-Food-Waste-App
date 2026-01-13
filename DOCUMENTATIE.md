# Anti Food Waste App

## Descriere generala
Anti Food Waste App este o aplicatie web care permite utilizatorilor sa isi
gestioneze produsele alimentare, sa le marcheze ca disponibile si sa le ofere
prietenilor, cu scopul de a reduce risipa alimentara.

Aplicatia este orientata pe comunitate si permite interactiunea intre utilizatori
printr-un sistem de prieteni si revendicarea (claim) produselor disponibile.

---

## Tehnologii utilizate

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- express-session
- bcrypt
- cors

### Frontend
- React
- React Router
- CSS

---

## Baza de date
Aplicatia foloseste o baza de date relationala MySQL, gestionata prin Prisma ORM.

### Tabele principale:
- User – utilizatori aplicatie
- Produs – produse alimentare
- Claim – produse revendicate
- Prieten – relatii de prietenie intre utilizatori

Structura bazei de date este definita in fisierul `schema.prisma`.

---

## Autentificare
Autentificarea se realizeaza folosind sesiuni (cookies) prin `express-session`.

Functionalitati:
- Inregistrare utilizator (Sign Up)
- Autentificare (Login)
- Logout
- Verificare utilizator autentificat (`/api/auth/me`)

---

## Functionalitati implementate

### Utilizator
- Creare cont
- Autentificare si deconectare

### Produse
- Adaugare produs
- Organizare produse pe categorii
- Vizualizare produse proprii
- Sortare produse dupa data expirarii
- Marcare produs ca disponibil
- Separare produse active si produse date

### Prieteni
- Trimitere cerere de prietenie
- Acceptare sau refuz cerere
- Lista prieteni acceptati

### Claim produse
- Vizualizare produse disponibile ale prietenilor
- Claim produs
- Produsele revendicate apar in profilul utilizatorului
- Produsele date raman vizibile in istoricul utilizatorului care le-a postat

---

## API REST
Aplicatia expune un API REST utilizat de frontend.

### Exemple endpoint-uri:
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- POST `/api/produse`
- GET `/api/produse`
- GET `/api/produse/me`
- PATCH `/api/produse/:id/disponibil`
- POST `/api/claims/:idProdus`
- GET `/api/claims/me`
- POST `/api/prieteni`
- GET `/api/prieteni`

---

## Testare
API-ul a fost testat folosind Postman pentru:
- autentificare
- adaugare produse
- claim produse
- gestionare prieteni

---

## Instructiuni de rulare

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
