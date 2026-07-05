# Udviklerdokumentation

Denne dokumentation er skrevet til fremtidige udviklere, der skal forstå,
starte, ændre og vedligeholde SOP IT Service Solution. Projektet er et
udlånssystem med en backend, to React-frontends, en statisk signup-side,
MariaDB, Prisma, LDAP og mailudsendelse.

Målet er, at du kan bruge dokumentet som første stop, før du dykker ned i
koden.

## Hurtigt overblik

Systemet består af disse hoveddele:

| Del | Placering | Formål |
| --- | --- | --- |
| Backend | `backend/` | Express API, auth, LDAP, mail, Prisma og domænelogik |
| Admin frontend | `frontend/udlånssystem/` | Helpdesk/admin-interface til udlån, produkter, brugere og stamdata |
| Student frontend | `frontend/student-view/` | Forenklet brugerflade til studerende/slutbrugere |
| Signup frontend | `frontend/user-signup/` | Statisk HTML/CSS/JS-flow til oprettelse og bekræftelse af bruger |
| Database | MariaDB via Docker eller lokal installation | Persistente data for produkter, varer, brugere, udlån osv. |
| LDAP | `ldap/` + Docker service | Lokal LDAP til udvikling og login/oprettelse af brugere |
| Reverse proxy | `nginx.conf` | Router lokale domæner til frontends, API og signup |

Teknologistakken er primært:

- Node.js og npm.
- TypeScript.
- Express.
- Prisma med MariaDB.
- React, Vite og React Router.
- Tailwind CSS og shadcn/Radix-inspirerede UI-komponenter.
- LDAP via `passport-ldapauth`, `ldapjs` og `ldapauth-fork`.
- Nodemailer til mail.
- Vitest til backend-tests.
- Docker Compose til lokal/dev/prod-lignende kørsel.

## Domænebegreber

De vigtigste begreber i systemet er:

- `products`: Produkttyper, fx en bestemt model af computer, skærm eller kabel.
- `items`: Fysiske eksemplarer af et produkt. Hvert item kan have stregkode,
  status, kommentar og placering.
- `loans`: Et udlån til en bruger. Et lån har låner, udlåner/helpdesk-personale,
  lånetid og returneringsdato.
- `items_in_loan`: Kobling mellem et lån og de konkrete items, der er udlånt.
  Her gemmes også om varen blev udlånt med taske/lås og om den er returneret.
- `users`: Lokal database-repræsentation af brugere. Login- og brugerdata hentes
  primært fra LDAP, men backend opretter/mapper også brugere i databasen.
- `brands`, `categories`, `product_status`, `buildings`, `zones`,
  `storage_locations`: Stamdata til produkter, statusser og placeringer.
- Prisma `view`s: Læsevenlige database-views med danske kolonnenavne til tabeller
  i frontend, fx `products_view`, `items_view`, `loans_view` og `users_view`.

## Projektstruktur

```txt
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── addViews.js
│   │   └── views/sop/*.sql
│   └── src/
│       ├── api/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   └── middleware/
│       ├── configs/
│       ├── functions/
│       ├── schemas/
│       ├── templates/
│       ├── tests/
│       ├── types/
│       ├── index.ts
│       └── passport.ts
├── frontend/
│   ├── udlånssystem/
│   ├── student-view/
│   ├── user-signup/
│   └── types/
├── ldap/
├── docker-compose.yml
├── docker-compose.dev.yml
├── nginx.conf
└── package.json
```

### Backend-mapper

- `backend/src/index.ts` starter Express, sætter CORS, cookies, JSON parsing,
  Passport og API-ruter op.
- `backend/src/passport.ts` konfigurerer LDAP-login via Passport.
- `backend/src/api/routes/` definerer HTTP-ruter.
- `backend/src/api/controllers/` oversætter HTTP request/response til servicekald.
- `backend/src/api/services/` indeholder forretningslogik og Prisma-kald.
- `backend/src/api/middleware/` indeholder auth, adgangsniveauer og validering.
- `backend/src/functions/` indeholder delte hjælpefunktioner til LDAP, mail,
  Prisma-schemaopslag, typekonvertering, lånelogik og HTML-generering.
- `backend/src/schemas/` indeholder Zod-validering for udvalgte inputs.
- `backend/src/templates/loan.hbs` er Handlebars-template til lånekontrakt.
- `backend/prisma/schema.prisma` er datamodellen.
- `backend/prisma/views/sop/*.sql` er SQL-definitioner for database-views.
- `backend/prisma/addViews.js` opretter eller genopretter alle views.
- `backend/src/tests/` indeholder Vitest-tests for backend-services.

### Frontend-mapper

Begge React-apps har meget ens struktur:

- `src/App.tsx` definerer layout, auth-gate og routing.
- `src/axios.config.ts` sætter `axios.defaults.baseURL` og cookies.
- `src/pages/` indeholder sider. Routing genereres ud fra filstrukturen.
- `src/components/` indeholder fælles UI-komponenter, tabeller, navigation osv.
- `src/components/ui/` indeholder lavniveau UI-komponenter.
- `src/layouts/` findes især i admin-frontenden og genbruges til liste-, ny- og
  redigeringssider.
- `src/data/` samler CRUD-kald mod backend.
- `src/hooks/` indeholder fx `useData` og realtime logout-check.
- `src/helpers/` indeholder dato-, tabel-, route-, barcode- og loan-hjælpere.
- `src/styles/` indeholder CSS for de eksisterende UI-flader.

`frontend/types/` indeholder globale TypeScript-typer, som bruges af frontends.

## Lokal opsætning

Der findes to hovedmåder at køre projektet på:

1. Med Docker Compose, som starter backend, database, LDAP, nginx og frontends.
2. Manuelt med npm i hver app, typisk hvis du kun arbejder på frontend eller
   backend mod en eksisterende database.

### Vigtige env-filer

Brug eksempel-filerne som skabelon:

- Root: `.env.example`
- Backend: `backend/.env.example`
- Docker/backend: `backend/.docker.env.example`

Undgå at committe rigtige `.env`-filer eller hemmeligheder.

Backendens vigtigste variabler er:

- `NODE_ENV`: `development` eller `production`.
- `DATABASE_URL`: MariaDB connection string, fx
  `mysql://user:password@localhost:3306/sop`.
- `FRONTEND_URL`: Kommasepareret liste af tilladte frontend origins.
- `SIGNUP_FRONTEND_URL`: Public URL til signup-siderne i bekræftelsesmail.
- `BACKEND_PORT`: Port for Express, default i koden er `5000`.
- `JWT_SECRET`: Secret til JWT-cookie.
- `LDAP_HOST`, `LDAP_PORT`, `LDAP_USERNAME`, `LDAP_PASSWORD`,
  `LDAP_BASE_DN`, `LDAP_USERS`, `LDAP_ADMINS`, `LDAP_SUPERIORS`: LDAP setup.
- `MAIL_HOST`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM_ADDRESS`,
  `MAIL_FROM_NAME` osv.: Mail setup.

Frontend forventer:

- `VITE_APP_BACKEND_URL`: API-base, fx `http://localhost:5000/api` eller `/api`
  når nginx proxyer.

### Docker Compose til udvikling

Fra repo-roden:

```bash
npm run docker:dev
```

Det kører:

- `admin-frontend` fra `frontend/udlånssystem`.
- `student-frontend` fra `frontend/student-view`.
- `backend` fra `backend/`.
- `db` som MariaDB.
- `nginx` som reverse proxy.
- `ldap` som lokal OpenLDAP.

Nginx bruger disse lokale hosts:

- Default host: admin-frontenden.
- `support.localhost`: student-frontenden.
- `signup.localhost`: statisk signup-frontend.
- `/api/`: proxy til backend.

Hvis din browser eller OS ikke håndterer disse `.localhost`-hosts automatisk,
kan du tilføje dem i din hosts-fil eller bruge de eksponerede porte direkte.

### Manuel kørsel

Installer afhængigheder fra roden:

```bash
npm run i
```

Start backend:

```bash
npm run backend
```

Start admin frontend:

```bash
npm run frontend
```

Student frontenden har ikke et root-script. Kør den direkte:

```bash
cd frontend/student-view
npm run dev
```

Backend kan også køres direkte:

```bash
cd backend
npm run dev
```

### Database-kommandoer

Køres fra `backend/`:

```bash
npm run db:push
npm run db:seed
npm run db:pull
npm run db:deploy
```

Vigtigt:

- `db:push` kører `prisma db push` og derefter `node prisma/addViews.js`.
- `addViews.js` dropper og genskaber alle SQL-views i
  `backend/prisma/views/sop/`.
- Hvis et view mangler i databasen, vil flere frontend-lister ikke få de
  forventede headers/data.
- `db:seed` opretter grunddata for bygninger, produktstatusser,
  recipient types og zoner.

## Backend-arkitektur

Backend bruger en ret klassisk lagdeling:

```txt
HTTP request
  -> route
  -> middleware
  -> controller
  -> service
  -> Prisma/LDAP/mail
  -> response
```

### App-start

`backend/src/index.ts` gør følgende:

- Loader `.env` med `dotenv`.
- Opretter Express-app.
- Konfigurerer CORS ud fra `FRONTEND_URL` og `SIGNUP_FRONTEND_URL`.
- Aktiverer JSON, URL encoding, cookies og Passport.
- Monterer `/api/health` og `/api/auth` uden JWT-krav.
- Kører `authenticateUser` på alle efterfølgende `/api`-ruter.
- Monterer domæneruter som `/loans`, `/items`, `/users_view`, `/locations` osv.
- Monterer til sidst den generiske tabel-router på `/api/:table`.
- Forbinder Prisma, når serveren lytter.

Der ligger en cron-plan til mails om udløbne lån:

```ts
const cronShedule = "0 8 * * 1-5";
```

Selve `cron.schedule(...)` er dog kommenteret ud i den nuværende kode.

### Auth og adgangsniveauer

Login sker via LDAP:

- `POST /api/auth/login` bruger Passport LDAP-strategy.
- Ved succes findes eller oprettes brugeren i `users`-tabellen.
- Backend signerer hele `req.user` som JWT med udløb på 1 dag.
- Token gemmes som cookie med `httpOnly`, `sameSite: "none"` og `secure: true`.

Validering:

- `POST /api/auth/validate` læser `token` fra cookies og verifierer JWT.
- `POST /api/auth/logout` rydder `token`-cookien.
- `authenticateUser` beskytter alle ikke-auth-ruter efter `/auth`.

Adgangsniveauer:

- `moderatorLevel = 0`: Almindelig bruger.
- `moderatorLevel = 1`: Admin/helpdesk.
- `moderatorLevel = 2`: Superior/højere rettighed.

Niveauet beregnes i `getModeratorLevel` ud fra LDAP `memberOf`, `dn` og env:

- `LDAP_SUPERIORS` giver niveau 2.
- `LDAP_ADMINS` giver niveau 1.
- `dn` med `Zone9` giver også niveau 1.

Middleware `minModLevel(level)` bruges til at beskytte skriveoperationer.

### Generisk tabel-API

Den generiske router i `backend/src/api/routes/tables.ts` er en stor del af
systemet.

Endpoints:

- `GET /api/:table`
- `GET /api/:table/:UUID`
- `POST /api/:table`
- `PATCH /api/:table/:UUID`
- `DELETE /api/:table/:UUID`

Eksempler:

- `GET /api/products`
- `GET /api/products/1`
- `GET /api/products_view`
- `POST /api/brands`
- `PATCH /api/categories/3`

Regler:

- `GET` kræver kun at brugeren er logget ind.
- `POST` og `PATCH` kræver `moderatorLevel >= 1`.
- `DELETE` kræver `moderatorLevel >= 2`.
- `Validate` middleware tjekker, at `:table` findes i Prisma Client.
- `getAll` returnerer `{ headers, data }`, hvor `headers` er Prisma-felter.
- Query params bruges som simple Prisma-filtre.
- Strengen `"null"` i query params konverteres til `null`.
- `convertToPrismaTypes` forsøger at konvertere input til Prisma-typer.
- Hvis der findes en Zod-schemafil for tabellen, bruges den ved create/update.

Denne router er god til simple tabeller og views. Brug en specialiseret route,
når der er forretningslogik, transaktioner, ekstra validering eller mail/LDAP
involveret.

### Specialiserede API-ruter

Ud over generisk CRUD findes disse specialruter:

| Route | Formål |
| --- | --- |
| `/api/auth` | Login, logout, token-validering og signup/oprettelse |
| `/api/loans` | Opret lån, returner varer og hent lånekontrakt |
| `/api/items` | Hent item med relationer og opret flere fysiske items |
| `/api/items_view` | Listevisning for items |
| `/api/loans_view` | Listevisning for lån |
| `/api/users_view` | Listevisning for brugere, kræver adminniveau |
| `/api/locations` | Placeringer |
| `/api/user_loans` | Lån for den aktuelle bruger eller valgt bruger ved moderatoradgang |
| `/api/mail` | Testmail i ikke-production |

### Udlånsflow

Oprettelse af lån sker i `backend/src/api/services/loans.ts`.

Flow:

1. Input valideres med `createLoanSchema`.
2. Helpdesk-personale genautentificeres mod LDAP via
   `personel_username` og `personel_password`.
3. Helpdesk-brugeren findes i `users`-tabellen.
4. Lånedata og produktdata konverteres til Prisma-typer.
5. Der oprettes en `loans`-række med nested `items_in_loan`.
6. Lånerens LDAP-bruger hentes.
7. Mailadresse beregnes fra LDAP eller brugernavn.
8. `generateLoanHTML` laver lånekontrakt ud fra `loan.hbs`.
9. Lånekontrakten sendes på mail.
10. Det nye lån returneres med status `201`.

Returnering af varer:

1. `PATCH /api/loans/return/item` modtager `ItemsInLoanToReturn`.
2. Hver item/loan-kobling findes i `items_in_loan`.
3. `date_returned` sættes for de afleverede varer.
4. `returnLoan` tjekker, om alle varer på lånet er returneret.
5. Hvis alt er returneret, sættes `loans.date_of_return`.

Kontrakt/PDF:

- `GET /api/loans/:UUID/pdf` returnerer HTML fra `generateLoanHTML`.
- Frontend kan bruge HTML'en til visning eller PDF-generering.

### Mail

`backend/src/functions/mail.ts` bruger Nodemailer.

I development bruges `nodemailer.createTestAccount()`, og testmail-URL logges i
terminalen. I production bruges mailvariablerne fra `.env`.

`sendMailToExpiredLoans` finder lån, hvor:

- `date_of_return IS NULL`
- `loan_length IS NOT NULL`
- `mail_sent = 0`
- lånets forventede afleveringsdato er passeret

Derefter sendes påmindelser og `mail_sent` sættes til `true`. Cron-kaldet er
forberedt, men ikke aktivt i `index.ts`.

### LDAP

LDAP-funktioner ligger primært i:

- `backend/src/passport.ts`
- `backend/src/functions/auth.ts`
- `backend/src/functions/ldapHelper.ts`

Der er to login-veje i koden:

- Passport-strategy til `/api/auth/login`.
- Service-funktioner `ldapAuthenticate` og `ldapAuthenticate2`, som bruges i
  ældre login-flow og ved genbekræftelse af helpdesk-personale.

Brugeroprettelse:

- `POST /api/auth/create-user` validerer skolemail, laver OTP og sender mail.
- `POST /api/auth/confirm-create-user` validerer OTP, opretter LDAP-bruger og
  opretter brugeren i databasen.
- Kun mails på `@edu.sde.dk` accepteres.
- Numeriske brugernavne med 6 cifre prefikses med `u`.
- OTP er gyldig i 20 minutter.

### Prisma, relationer og views

Prisma-modellen ligger i `backend/prisma/schema.prisma`.

Vigtige modeller:

- `brands`, `categories`, `products`, `items`, `product_status`
- `buildings`, `zones`, `storage_locations`
- `users`, `loans`, `items_in_loan`
- `recipient_type`, `selfservice_case`, `pickup_locations`
- `signup_verifications`
- `feedback`

Views er defineret både i Prisma-schemaet og som SQL-filer i
`backend/prisma/views/sop/`.

Prisma Client preview feature `views` er aktiveret:

```prisma
previewFeatures = ["views"]
```

`backend/src/configs/prisma.config.ts` eksporterer to klienter:

- `prisma`: almindelig PrismaClient.
- `prismaGetRefs`: udvidet klient, der automatisk inkluderer `_count` for
  refererende relationer. Den bruges bl.a. til at kunne deaktivere sletning i
  frontend, hvis en række stadig er refereret.

## Frontend-arkitektur

Der er to Vite/React-apps:

- Admin/helpdesk: `frontend/udlånssystem`
- Student-view: `frontend/student-view`

De deler mange mønstre, men har separate kodebaser.

### Routing

Routing genereres dynamisk i `src/helpers/routeHelpers.ts`:

```ts
import.meta.glob<ReactComponent>("../pages/**/*.tsx", { eager: true })
```

Regler:

- Alle `.tsx`-filer under `src/pages` bliver routes.
- `components`, `Login` og `Home` ignoreres.
- `index.tsx` bliver mappens rodroute.
- `edit.tsx` bliver `:id`.
- Filer som `[uuid].tsx` bliver `:uuid`.
- Path sættes til lowercase.

Eksempel:

- `pages/brands/index.tsx` -> `/brands`
- `pages/brands/new.tsx` -> `/brands/new`
- `pages/brands/edit.tsx` -> `/brands/:id`
- `pages/produkter/new/[uuid].tsx` -> `/produkter/new/:uuid`

Admin-appens `App.tsx` har desuden en manuel route:

- `udlaan/:id/returner`

### Auth-gate i frontend

Begge apps har en `CurrentUserContext`.

I `App.tsx` vises:

- `Login`, hvis `currentUser` ikke er sat.
- App-layout med navigation og `Outlet`, hvis `currentUser` er sat.

`axios.config.ts` sætter:

```ts
axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_URL || "/api";
axios.defaults.withCredentials = true;
```

Det betyder, at JWT-cookien sendes med API-kald.

### Data-lag

Admin-frontenden bruger disse centrale helpers:

- `src/data/getData.ts`
- `src/data/create.ts`
- `src/data/update.ts`
- `src/data/delete.ts`
- `src/hooks/useData.ts`

Mønsteret er:

- `getData(table, { withHeaders: true })` henter `{ headers, data }`.
- `getData(table, { UUID })` henter enkelt række.
- `createItem(table, data)` sender `POST table` med `{ data }`.
- `updateItem(table, UUID, data)` sender `PATCH table/UUID` med `{ data }`.
- `deleteItem(table, UUID)` sender `DELETE table/UUID`.

Da `axios.defaults.baseURL` peger på `/api`, kan frontend bruge korte navne som
`"brands"` eller `"products_view"`.

### Tabel-layout

Admin-listesider bruger ofte `frontend/udlånssystem/src/layouts/index.tsx`.

Flow:

1. Siden sender et tabelnavn eller allerede hentet data ind.
2. Layout henter data med headers.
3. `columnsFormatter` konverterer headers til TanStack Table-kolonner.
4. `components/table.tsx` viser sortering, filtrering, pagination og klik på
   række.
5. Klik på en række navigerer som standard til `/<aktuel-side>/<UUID>`.

Det gør det hurtigt at lave en ny liste for en simpel tabel/view.

### Form-layouts

Admin-frontenden har generiske layouts til ny og rediger:

- `src/layouts/new.tsx`
- `src/layouts/edit.tsx`
- `src/layouts/components/FormPage.tsx`

De bruger `Field[]`-definitioner fra `frontend/types/field.d.ts`.

Et field kan fx være:

```ts
{ label: "Navn", binding: "name", type: "text", required: true }
```

eller et select:

```ts
{
  label: "Brand",
  binding: "brand_id",
  type: "select",
  options: "brands"
}
```

Hvis `options` er en string, henter layoutet mulighederne via `getData`.

Validering:

- Hvis siden ikke giver en Zod-schema, genereres en schema med
  `autoGenZodSchema(fields)`.
- Ved fejl vises warnings via `sonner`.

Redigering:

- Importeret data og eksportdata sammenlignes med `doesObjectsMatch`.
- `UUID`, `date_created` og `date_updated` fjernes på backend før update.
- Delete-knap kan deaktiveres, hvis `_count` viser referencer.

### Navigation og visninger

Admin-appens primære sider dækker bl.a.:

- `brands`
- `brugere`
- `bygninger`
- `kategorier`
- `produkter`
- `produktstatusser`
- `produkttyper`
- `udlaan`
- `zoner`
- `Dashboard`, `Feedback`, `Chat`, `Notifikationer`

Student-view er mere begrænset og har bl.a.:

- `udlaan`
- `laante-produkter`
- `Dashboard`
- `Notifikationer`

### Signup-frontenden

`frontend/user-signup/` er ikke en Vite-app. Det er statiske filer:

- `index.html`
- `confirm.html`
- `index.js`
- `index.css`

Nginx server den på `signup.localhost` i dev-compose. Den kalder backendens
signup-endpoints under `/api/auth`.

## API-reference på højt niveau

Alle endpoints starter med `/api`.

### Auth

| Metode | Endpoint | Beskrivelse |
| --- | --- | --- |
| `POST` | `/auth/login` | LDAP-login, opretter/finder lokal bruger og sætter JWT-cookie |
| `POST` | `/auth/validate` | Validerer JWT-cookie |
| `POST` | `/auth/logout` | Rydder JWT-cookie |
| `GET` | `/auth/cookies` | Debug: returnerer cookies |
| `POST` | `/auth/create-user` | Starter signup med skolemail og OTP |
| `POST` | `/auth/confirm-create-user` | Bekræfter OTP og opretter LDAP-/DB-bruger |

### Loans

| Metode | Endpoint | Beskrivelse |
| --- | --- | --- |
| `GET` | `/loans/:UUID/pdf` | Returnerer HTML for lånekontrakt |
| `POST` | `/loans` | Opretter lån og sender lånekontrakt |
| `PATCH` | `/loans/return/item` | Returnerer en eller flere varer på et lån |

Bemærk: `routes/loans.ts` har en `GET`-validering registreret for `/` og
`/:UUID`, men ingen controller til egentlig response på disse GET-ruter i den
nuværende kode. Lånelister læses typisk via `/loans_view`.

### Items

| Metode | Endpoint | Beskrivelse |
| --- | --- | --- |
| `GET` | `/items/:UUID` | Henter item med relaterede lån og brugere |
| `POST` | `/items` | Opretter flere items for et produkt, kræver adminniveau |

### Views og tabeller

| Endpoint | Brug |
| --- | --- |
| `/items_view` | Læsevenlig item-liste |
| `/loans_view` | Læsevenlig låneliste, filtreret efter brugerrettighed |
| `/users_view` | Læsevenlig brugerliste, kræver adminniveau |
| `/user_loans` | Aktuel brugers lån eller `?user_id=<id>` for moderatorer |
| `/:table` | Generisk Prisma-baseret CRUD/læsning |

## Typiske udvikleropgaver

### Tilføj en simpel stamdata-side i admin

1. Tilføj eller opdater Prisma-model i `backend/prisma/schema.prisma`.
2. Kør relevante Prisma-kommandoer.
3. Opret evt. SQL-view i `backend/prisma/views/sop/`.
4. Kør `npm run db:push` fra `backend/`, så views oprettes.
5. Tilføj Zod-schema i `backend/src/schemas/`, hvis create/update skal valideres.
6. Opret frontend-side under `frontend/udlånssystem/src/pages/<navn>/`.
7. Brug `layouts/index.tsx` til liste.
8. Brug `layouts/new.tsx` og `layouts/edit.tsx` til formularer.
9. Tilføj eller genbrug `Field[]` for formularfelter.

### Tilføj speciallogik til backend

Brug ikke den generiske tabel-router, hvis handlingen:

- Skal skrive til flere tabeller.
- Kræver transaktion.
- Skal sende mail.
- Skal tale med LDAP.
- Har komplekse rettighedsregler.
- Skal validere et domæneflow.

Opret i stedet:

1. Route i `backend/src/api/routes/<navn>.ts`.
2. Controller i `backend/src/api/controllers/<navn>.ts`.
3. Service i `backend/src/api/services/<navn>.ts`.
4. Zod-schema i `backend/src/schemas/<navn>.ts`, hvis input skal valideres.
5. Eksport i `backend/src/api/routes/index.ts`.
6. Mount i `backend/src/index.ts`.
7. Test i `backend/src/tests/`.

### Tilføj et nyt database-view

1. Opret SQL-fil i `backend/prisma/views/sop/<view_navn>.sql`.
2. Tilføj view-definition i `backend/prisma/schema.prisma`.
3. Kør fra `backend/`:

```bash
npm run db:push
```

4. Brug viewet i frontend med `getData("<view_navn>", { withHeaders: true })`.

### Ændr lånekontrakten

1. Rediger `backend/src/templates/loan.hbs`.
2. Hvis data mangler, opdater `generateLoanHTML` i
   `backend/src/functions/generateLoanHTML.ts`.
3. Test `GET /api/loans/:UUID/pdf`.
4. Test oprettelse af lån, fordi samme HTML bruges til mail.

### Ændr login eller rettigheder

Relevante filer:

- `backend/src/passport.ts`
- `backend/src/functions/auth.ts`
- `backend/src/functions/ldapHelper.ts`
- `backend/src/api/middleware/auth.ts`
- `backend/src/api/routes/auth.ts`
- `frontend/*/src/App.tsx`
- `frontend/*/src/services/login.ts`

Vær ekstra opmærksom på:

- JWT payload og udløbstid.
- Cookie flags (`httpOnly`, `sameSite`, `secure`).
- CORS origins.
- `moderatorLevel`.
- LDAP group DNs fra env.

## Tests og kvalitet

Backend bruger Vitest:

```bash
cd backend
npm run test
```

Testene er service-orienterede og forventer adgang til database og relevant
testdata. De er derfor ikke helt isolerede unit tests.

Frontend har scripts til build og lint:

```bash
cd frontend/udlånssystem
npm run build
npm run lint
```

```bash
cd frontend/student-view
npm run build
npm run lint
```

Bemærk at lint-scriptet findes i `package.json`, men der skal være gyldig ESLint
opsætning og afhængigheder installeret.

## Kodestil og mønstre

### Backend

- Hold route/controller/service-lag adskilt.
- Brug Zod til inputvalidering, især ved specialiserede endpoints.
- Brug Prisma Client til databasekald.
- Brug transaktioner, når flere writes skal lykkes eller fejle samlet.
- Returner services som `IResponse` med `{ status, data }`.
- Undgå at lægge HTTP-logik direkte i services.
- Undgå at bruge den generiske tabel-router til domæneflows.

### Frontend

- Brug eksisterende `data` helpers i stedet for nye ad hoc axios-kald, når det er
  almindelig CRUD.
- Brug eksisterende layouts til simple lister og formularer.
- Brug `Field[]` og Zod-schemaer til formularer.
- Hold pages små ved at flytte genbrugelig logik til components/helpers/hooks.
- Husk at route-navne kommer fra filstien og bliver lowercase.
- Ved API-kald skal endpoints normalt skrives uden `/api`, fordi axios baseURL
  allerede peger på API-roden.

## Kendte opmærksomhedspunkter

- Root `package.json` installerer kun admin-frontenden og backend. Student-view
  skal installeres/køres separat, medmindre Docker Compose bruges.
- `frontend/types/currentUser.d.ts` angiver `moderatorLevel` som boolean, mens
  backend bruger number. Det bør rettes ved fremtidig typeoprydning.
- `routes/loans.ts` registrerer GET-validering uden controllerresponse for
  `/loans` og `/loans/:UUID`; brug `/loans_view` til listevisning.
- Cron-jobbet for udløbne lån er kommenteret ud i `backend/src/index.ts`.
- `POST /api/mail` returnerer ikke response i production, fordi funktionen
  stopper ved `if (isProd()) return;`. Det er tænkt som dev/test-endpoint.
- `generateLoanHTML` læser template fra relativ sti
  `src/templates/loan.hbs`; det kræver, at backend-processens working directory
  er `backend/`.
- Cookies er sat med `secure: true`, også i development. Ved manuel lokal kørsel
  uden HTTPS/proxy kan login derfor kræve justering eller browseropsætning.
- Reelle `.env`-filer findes lokalt, men må ikke bruges som dokumentation eller
  committes.

## Fejlfinding

### Login fejler

Tjek:

- Kører LDAP?
- Er `LDAP_HOST`, `LDAP_PORT`, `LDAP_USERNAME`, `LDAP_PASSWORD` korrekte?
- Matcher `LDAP_BASE_DN`, `LDAP_USERS`, `LDAP_ADMINS` og `LDAP_SUPERIORS`
  den aktuelle LDAP-struktur?
- Sendes cookies med frontend-kald? Tjek `axios.defaults.withCredentials`.
- Matcher frontend origin en værdi i `FRONTEND_URL`?
- Bliver secure cookie accepteret i dit lokale setup?

### Frontend viser tomme tabeller

Tjek:

- Er backend startet?
- Peger `VITE_APP_BACKEND_URL` på korrekt API?
- Er brugeren logget ind?
- Findes det view/tabellen, siden spørger efter?
- Er `npm run db:push` kørt efter ændring af views?
- Returnerer endpointet `{ headers, data }`?

### Prisma-view findes ikke

Kør fra `backend/`:

```bash
npm run db:push
```

Hvis problemet fortsætter:

- Tjek SQL-filen i `backend/prisma/views/sop/`.
- Tjek at viewet også findes i `schema.prisma`.
- Tjek databasebrugerens rettigheder til `DROP VIEW` og `CREATE VIEW`.

### Mail sendes ikke

Tjek:

- I development: kig efter Nodemailer test-URL i backend-terminalen.
- I production: tjek mail env-variabler.
- Tjek at `MAIL_FROM_ADDRESS` og `MAIL_FROM_NAME` er sat.
- Tjek at modtager-mailen fra LDAP eller brugernavn er korrekt.

### Docker Compose starter ikke rent

Tjek:

- At porte `80`, `3306`, `389`, `636` og relevante Vite/backend-porte er ledige.
- At `backend/.env` og `backend/.docker.env` findes.
- At Docker volumes ikke indeholder gammel database/LDAP-state, hvis du forventer
  en frisk installation.

## Ny udvikler: anbefalet læserute

1. Læs denne fil.
2. Læs `backend/src/index.ts`.
3. Læs `backend/prisma/schema.prisma`.
4. Læs `backend/src/api/routes/tables.ts` og
   `backend/src/api/services/tables.ts`.
5. Læs `backend/src/api/services/loans.ts`.
6. Læs `frontend/udlånssystem/src/App.tsx`.
7. Læs `frontend/udlånssystem/src/helpers/routeHelpers.ts`.
8. Læs `frontend/udlånssystem/src/layouts/index.tsx`,
   `frontend/udlånssystem/src/layouts/new.tsx` og
   `frontend/udlånssystem/src/layouts/edit.tsx`.
9. Start systemet lokalt og følg et lån fra oprettelse til returnering.

Når du har været igennem de filer, har du set de vigtigste mønstre i projektet.
