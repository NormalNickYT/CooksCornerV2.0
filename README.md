# CooksCorner

Bewaar je favoriete recepten en deel ze met je familie. Vul de hoeveelheden één
keer in voor het aantal personen waarvoor jij kookt; iedereen die het recept
opent kan het met één klik omrekenen naar zijn eigen tafel.

## Snel starten

Je hebt **Node.js 22.6+** nodig (getest op 24 LTS).

```bash
cp .env.example .env      # pas SESSION_SECRET aan
npm install
npm run db:up             # PostgreSQL + Redis via Docker
npm run db:migrate
npm run db:seed
npm run dev
```

De web-app draait op http://localhost:5173, de API op http://localhost:5000.

Inloggen met de seed-data: `nick@cookscorner.test` of `sanne@cookscorner.test`,
wachtwoord `cookscorner123`.

### Zonder Docker

Docker Desktop heeft WSL2 nodig. Zolang dat er niet is, draait dezelfde
PostgreSQL-versie via een npm-package op dezelfde poort, dus `.env` blijft
ongewijzigd:

```bash
npm run db:local --workspace @cookscorner/api   # laten draaien
npm run db:migrate
npm run db:seed
npm run dev
```

Redis wordt dan overgeslagen; sessies staan in het geheugen en verdwijnen bij
een herstart van de API. Verder werkt alles hetzelfde.

## Structuur

```
apps/
  api/        Express 5 + Prisma. Feature-modules onder src/modules/.
  web/        Vite + React + shadcn/ui. Feature-mappen onder src/features/.
packages/
  shared/     Zod-schema's, types en de reken-engine voor porties.
```

`packages/shared` is met opzet de enige plek waar domeinregels staan. De API en
de browser importeren dezelfde `scaleRecipe`, dus wat je op het scherm ziet en
wat de server teruggeeft kan niet uit elkaar lopen.

## Recepten omrekenen

Een recept slaat op voor hoeveel personen het geschreven is (`servings`). Al het
andere is afgeleid:

```
factor = gekozenPersonen / servings
```

Naïef vermenigvuldigen geeft onbruikbare uitkomsten, dus de engine doet meer:

| Regel | Waarom |
| --- | --- |
| Breuken in plaats van decimalen | `⅔ el` is te meten, `0,667 el` niet |
| Metrisch blijft decimaal | `1,5 kg` leest beter dan `1½ kg` |
| g ⇄ kg en ml ⇄ l | `1500 g` wordt `1,5 kg`; cl en dl doen niet mee, want niemand zegt "4½ dl" |
| 3 tl wordt 1 el | Zo schrijft een recept het op |
| Stuks op halven, nooit op nul | Geen "0,33 ei" en geen ingrediënt dat wegvalt |
| Snufjes en vastgezette regels blijven staan | Drie keer "naar smaak" is nog steeds "naar smaak" |

Ingrediënten zonder hoeveelheid (`peper, naar smaak`) en regels die de auteur
op slot heeft gezet, schalen nooit mee.

De API kan hetzelfde: `GET /api/recipes/pannenkoeken?servings=6` geeft de
omgerekende hoeveelheden terug.

## Commando's

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | API en web-app tegelijk |
| `npm run build` | Bouwt shared, api en web in de juiste volgorde |
| `npm test` | Alle tests |
| `npm run typecheck` | TypeScript over alle packages |
| `npm run db:up` / `db:down` | Docker-infrastructuur starten/stoppen |
| `npm run db:nuke` | Stoppen én de data wissen |
| `npm run db:migrate` | Migratie maken en toepassen |
| `npm run db:seed` | Mockdata laden (idempotent) |
| `npm run db:studio` | Prisma Studio |

## Inloggen

E-mail met wachtwoord (bcrypt) en Google OAuth, beide via Passport met
server-side sessies.

Google is optioneel: zonder `GOOGLE_CLIENT_ID` in `.env` start de app gewoon en
verdwijnt de Google-knop. Aanzetten doe je met een OAuth-client uit de
[Google Cloud Console](https://console.cloud.google.com/apis/credentials),
waarbij de redirect-URI exact gelijk moet zijn aan `GOOGLE_CALLBACK_URL`.

Meldt iemand zich met Google aan op een e-mailadres dat al bestaat, dan wordt
dat aan het bestaande account gekoppeld in plaats van een tweede profiel te
maken.

## Stack

Vite · React · TypeScript · TailwindCSS · shadcn/ui · TanStack Query ·
Express 5 · Prisma · PostgreSQL · Redis · Passport · Zod · Vitest
