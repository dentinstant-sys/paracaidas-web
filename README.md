# condorsky-web

Sitio público + backend del proyecto **Condor Sky**.
Stack: React + Vite + Tailwind + Firebase.

## Estructura

```
condorsky-web/
├── firebase.json           Hosting + Functions + Firestore
├── firestore.rules         Reglas de seguridad
├── firestore.indexes.json  Índices compuestos
├── functions/              Cloud Functions
└── src/
    ├── App.jsx             Router: / y /reservar
    ├── lib/firebase.js     Cliente Firebase + callables
    └── pages/
        ├── Landing.jsx     Landing pública
        └── Reservar.jsx    Wizard de reserva, 6 pasos
```

Este repo es dueño de la configuración del proyecto Firebase (rules,
índices y functions). El panel admin (`condorsky-admin`) es un frontend
aparte que consume el mismo proyecto Firebase.

## Puesta en marcha

1. `npm install`
2. `cd functions && npm install && cd ..`
3. Copiar `.env.example` a `.env` y llenar la config web de Firebase.
4. `npm run dev` — sitio en local.
5. Backend en local (opcional): `cd functions && npm run serve`.

Falta agregar los assets del cliente en `public/img/` (logo y fotos).

## Estado de la integración

Modelo de datos unificado **v2**. El sitio y el panel comparten las
mismas colecciones Firestore (`bookings`, `services`, `additionals`, etc.).

- **Cloud Functions** — alineadas a v2: `crearBooking`, `boldWebhook`,
  `consultarBooking`, `setAdminClaim`.
- **Wizard `/reservar`** — cableado: el paso 5 llama a `crearBooking`.
  Con pasarela y llaves Bold reales redirige al checkout; con WhatsApp o
  en modo simulado avanza directo a la confirmación.
- **Pendiente:** volver `Landing.jsx` content-driven — que lea
  testimonios, galería, FAQ y textos desde `settings/*` en vez de tenerlos
  fijos en el código. El calendario del paso 1 del wizard también pasará a
  leer disponibilidad real (`blocked/*`). El backend ya valida disponibilidad
  al crear, así que esto es de presentación, no de seguridad.

Payload de `crearBooking`:
`{ fecha, sede, cliente, servicioBase, servicioFotos, adicionales, metodoPago, aceptaTerminos }`.

## Deploy

```
firebase use caidalibre-prod          # SIEMPRE verificar primero
firebase deploy --only firestore      # reglas + índices
firebase deploy --only functions      # Cloud Functions
npm run build && firebase deploy --only hosting
```

Dominios conectados en Firebase Hosting: `condorsky.co` y `www.condorsky.co` (sitio) y `admin.condorsky.co` (panel).

## Pendientes

- Credenciales Bold → sin ellas, los pagos corren en modo simulado.
- Fotos del cliente en alta resolución en `public/img/`.
- Asignar el primer usuario admin (ver `functions/src/setAdminClaim.js`).
- `Landing.jsx` content-driven.
