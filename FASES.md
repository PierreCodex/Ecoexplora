# Avance Frontend EcoExplora Tumbes

> Reporte de progreso del scaffolding del panel admin contra `FRONTEND_PLAN.md`.
> **Actualizado:** 2026-05-11
> **Ruta del proyecto:** `Admin/TS/`

Leyenda: ✅ hecho · 🟡 parcial · ⬜ pendiente · ➖ no aplica todavía

---

## Resumen ejecutivo

| Fase | Estado | Notas |
|---|---|---|
| 0. Setup inicial | 🟡 | Auth + API + env listos. Limpieza UBold pendiente. |
| 1. Login | ✅ | Supabase signInWithPassword, redirect a /dashboard |
| 2. Dashboard | 🟡 | UI lista; falta endpoint backend `/admin/stats/dashboard` (Backend M3) |
| 3. Reservas | ✅ | Kanban (estilo `outlook-box kanban-app` con scroll horizontal) + Calendario + Detalle (4 tabs + acciones) **conectados al backend real** `/admin/reservations` (Backend M2). |
| 4. Conversaciones | ⬜ | Endpoints backend pendientes |
| 5. Catálogo (6 sub) | 🟡 | Frontend Tours UI escrito (no conectado); backend CRUD pendiente (Backend M4). `<RichTextEditor />` wrapper Quill listo. |
| 6. Disponibilidad | ⬜ | |
| 7. Horarios | ⬜ | |
| 8. Settings | ⬜ | |
| 9. Administradores | ⬜ | Solo `propietario` |
| 10. Sidebar | ✅ | `src/layouts/components/data.ts` ya domain-only |
| 11. Componentes compartidos | 🟡 | StatusBadge + confirm helpers + RichTextEditor hechos; DataTable / MoneyDisplay / DateDisplay pendientes |
| 12. Consideraciones técnicas | 🟡 | Patrones establecidos; header `ngrok-skip-browser-warning` agregado a `api.ts`; permisos por rol pendientes |
| 13. Pulido final (paso 16) | ⬜ | |

---

## Alineación con backend (en curso desde 2026-05-11)

Se descubrió que el frontend Reservas / Dashboard apuntaba a contratos inexistentes en el backend (`/admin/reservations` en inglés vs `/admin/reservas` en español, auth Bearer JWT vs `X-Admin-API-Key`). Se inició el bloque de **backend admin** para alinear ambos lados.

| Milestone backend | Cubre | Estado |
|---|---|---|
| **M1. Auth JWT compartida** | `app/api/admin/deps.py` — HS256 legacy + ES256/RS256 vía JWKS, roles `propietario`/`operador`/`visor` | ✅ Hecho |
| **M2. `/admin/reservations`** | 8 endpoints (list, detail, confirm, reject, cancel, refund, resend, reschedule) + schemas ES↔EN | ✅ Hecho |
| **M3. Stats + Receipts** | `/admin/stats/dashboard`, `/admin/receipts/:id/signed-url` | ✅ Hecho |
| **M4. Catálogo CRUD** | `/admin/catalog/{tours,variants,destinations,policies,faqs,company}` | ✅ Hecho |
| **Itinerario Fase A** | Timeline UI + endpoints `/variants/:id/activities` | ✅ Hecho |
| **Itinerario Fase B** | Bot lee de `actividades_variante`; migración `013` dropea `itinerario_texto` | ✅ Hecho |
| **M5. RAG resync** | `POST /admin/rag/resync/{scope}` con BackgroundTasks; cierra el loop con `resyncRag()` del frontend | ✅ Hecho |
| **M6. Frontend reconciliación** | Estados `rejected`/`expired` añadidos; types catálogo alineados; UI completo de Catálogo (6 sub-módulos + Variantes con timeline) | ✅ Hecho |
| **M7. Backend Disponibilidad** | `/admin/availability` (mes completo con cupo computado vía `generate_series`) + override PUT/DELETE; `/admin/date-blocks` CRUD scope global/variante | ✅ Hecho |
| **M8. UI Disponibilidad** | `/disponibilidad` con FullCalendar dayGridMonth; select de variante agrupado por tour; color por cupo; modal de día + modal de bloqueo | ✅ Hecho |

Detalles completos en `ecoexplora-bot/MVP_V2_PLAN.md` §7.

---

## 0. Setup inicial

### 0.1 Limpieza del template UBold — 🟡 PARCIAL

Las carpetas listadas en el plan para borrar **siguen existiendo** bajo `src/app/(admin)/`. Los demos no están enlazados en el sidebar (`layouts/components/data.ts` solo muestra rutas de dominio) y los `(admin)` están auth-gated, por lo que no son alcanzables por usuarios finales — pero contribuyen 2 errores pre-existentes de `tsc` y ~MB de bundle.

**Pendiente de borrar (intacto desde el template):**

- `src/app/(admin)/apps/crm/` → quedarse solo con `pipeline/` y `activities/` como referencia, borrar: `campaign`, `contacts`, `customers`, `deals`, `estimations`, `leads`, `opportunities`, `proposals` (si existen)
- `src/app/(admin)/apps/email`, `apps/outlook`, `apps/social-feed`, `apps/ticket`, `apps/invoice`, `apps/ecommerce`, `apps/api-keys` — verificar y eliminar si presentes
- `src/app/(admin)/charts`, `icons`, `layouts`, `maps`, `pages`, `plugins`, `widgets`, `form`, `tables`, `ui` — verificar y eliminar

**Estado actual de `(admin)/`:** solo carpetas de dominio (`dashboard/`, `reservas/`) + `apps/` con demos (calendar, chat, crm, file-manager, users) intactos como referencia para próximos módulos.

**Decisión pendiente:** ¿borrar ahora todo lo no listado en "Mantener / Reusar" del plan §0.1, o esperar hasta que cada módulo nuevo absorba la referencia que necesita? Recomendado: borrar inmediatamente las carpetas no usadas como referencia para ningún módulo del plan (`email`, `outlook`, `invoice`, `ecommerce`, `api-keys`, `social-feed`, `ticket`, `charts`, `icons`, `layouts`, `maps`, `pages`, `plugins`, `widgets`, `form`, `tables`, `ui`).

### 0.2 Auth real con Supabase — ✅

- `src/lib/supabase/client.ts` — `createBrowserClient` con warn si faltan envs
- `src/hooks/useAuth.ts` — reescrito (sin más sessionStorage dummy): `signInWithPassword`, `signOut`, `onAuthStateChange`, expone `session`, `user`, `sessionReady`, `isAuthenticated`, `loading`, `error`, `login`, `logout`
- Gate de dos capas: `AppProvidersWrapper` redirige a `/auth/sign-in`, `MainLayout` retorna `null` hasta `sessionReady && isAuthenticated`

### 0.3 Cliente HTTP centralizado — ✅

`src/lib/api.ts` con:
- `apiFetch<T>(path, { body, query, ...rest })` + helpers `api.get/post/put/patch/delete`
- Inyección automática del JWT vía `supabase.auth.getSession()`
- `ApiError` exportada con `status` + `body`
- Redirect a `/auth/sign-in` en 401
- Soporte FormData (no estampa Content-Type)

### 0.4 Variables de entorno — ✅

`.env.local` configurado por el usuario con `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`.

---

## 1. Módulo Login — ✅

- `src/app/auth/(basic)/sign-in/page.tsx` adaptado para usar `useAuth().login`
- react-hook-form + yup (email + password ≥6)
- Errores inline con Alert de react-bootstrap
- Redirect a `/dashboard` en éxito

---

## 2. Módulo Dashboard — ✅

**Ruta:** `/dashboard` — `src/app/(admin)/dashboard/page.tsx`

Componentes implementados:
- `ReservasStats` — 6 cards (reservas hoy, pend. verificación, pend. pago, conv. activas, takeover, ingresos mes) con CountUp
- `IngresosMes` — Card grande con comparativa mes anterior
- `ReservasAnalytics` — ApexCharts línea/área, últimos 30 días
- `UltimasReservas` — Tabla con últimas 5 reservas + status badge

**Endpoints consumidos:**
- `GET /admin/stats/dashboard`
- `GET /admin/reservations` (limit=5 ordenado por created_at desc)

---

## 3. Módulo Reservas — ✅

### 3.1 Vista Kanban — ✅
**Ruta:** `/reservas` — `src/app/(admin)/reservas/page.tsx`
- 6 columnas (los 6 estados del plan §3.1), drag-and-drop **desactivado** (estados son automáticos)
- `ReservaCard` — código, iniciales cliente, tour+variante, fecha, pax, total, dropdown de acciones contextual al estado
- `ReservasBoard` — agrupa por estado y renderiza columnas
- `ReservasFilters` — búsqueda + select tour + rango de fechas
- Hook `useReservaActions` — dispatch centralizado con SweetAlert2 (`view`, `confirm`, `reject`, `cancel`, `refund`, `resend_payment`, `reschedule`)

### 3.2 Vista Calendario — ✅
**Ruta:** `/reservas/calendario` — `src/app/(admin)/reservas/calendario/page.tsx`
- FullCalendar via `next/dynamic({ ssr: false })`
- Solo eventos `status=confirmed`, carga por rango visible (`datesSet`)
- Locale `es`, semana lunes primero, botones traducidos
- Quitados: create-event, drag-drop, external-events sidebar
- Click en evento → modal `ReservaEventModal` con resumen + "Ver detalle completo"

### 3.3 Detalle de reserva — ✅
**Ruta:** `/reservas/[id]` — `src/app/(admin)/reservas/[id]/page.tsx`
- Layout: Col 9 (Header + Tabs) | Col 3 (sidebar de acciones)
- `ReservaHeader` — avatar/iniciales, datos contacto, código, tour, fecha, pax, expira
- 4 tabs:
  - **Resumen** — datos reserva + snapshot (precio congelado + política)
  - **Comprobante** — preview de imagen vía `GET /admin/receipts/:id/signed-url`, aprobar/rechazar con SweetAlert2 si `pending`
  - **Itinerario** — timeline de pasos del snapshot
  - **Historial** — timeline de `reservation_events` agrupado por día (mapeo type→icon+color+label)
- `ReservaActions` (sidebar) — botones contextuales por estado, cada uno con confirmación + endpoint correspondiente

**Endpoints consumidos:**
- `GET /admin/reservations` (kanban + calendario, con filtros)
- `GET /admin/reservations/:id` (detalle)
- `GET /admin/receipts/:id/signed-url`
- `GET /admin/catalog/tours` (filtro de tours)
- `POST /admin/reservations/:id/{confirm,reject,cancel,process-refund,resend-payment-instructions,reschedule}`

---

## 4. Módulo Conversaciones — ⬜ PENDIENTE

**Base a reusar:** `apps/chat/components/ChatPage.tsx` (intacto en el repo)

Sin tocar todavía. Componentes a crear bajo `src/app/(admin)/conversaciones/`:
- Sidebar izquierdo con lista de conversaciones (búsqueda, badge bot_active/human_takeover/archived)
- Header con datos cliente + botones Tomar control / Liberar / Archivar
- Burbujas con diferenciación bot/admin/usuario
- Footer con input **solo habilitado en human_takeover**

**Endpoints:** `GET /admin/conversations`, `GET /admin/conversations/:id`, `POST /admin/conversations/:id/{takeover,release,send-message}`

---

## 5. Módulo Catálogo — ⬜ PENDIENTE (6 sub-módulos)

| Sub-módulo | Ruta | Base | Estado |
|---|---|---|---|
| 5.1 Tours | `/catalogo/tours` | `apps/users/contacts/` (grid) | ⬜ |
| 5.2 Variantes | `/catalogo/tours/[id]/variantes` | form completo con Quill | ⬜ |
| 5.3 Destinos | `/catalogo/destinos` | `apps/users/contacts/` | ⬜ |
| 5.4 Políticas | `/catalogo/politicas` | tabla + Quill | ⬜ |
| 5.5 FAQs | `/catalogo/faqs` | tabla/accordion + Quill | ⬜ |
| 5.6 Empresa | `/catalogo/empresa` | `apps/users/account-settings/` | ⬜ |

**Pendiente común a todo el módulo:** wrapper `<RichTextEditor />` sobre Quill, llamadas a `POST /admin/rag/resync/*` después de cada save exitoso.

---

## 6. Módulo Disponibilidad — ⬜ PENDIENTE

**Base a reusar:** `apps/calendar/components/CalendarPage.tsx` (segunda instancia, distinta a Reservas)

Falta: select de variante en header, color por cupo restante (verde/amarillo/rojo/gris), modal de cupo personalizado + bloqueo.

**Endpoints:** `GET /admin/availability`, `PUT /admin/availability/:variant/:date`, `DELETE`, `GET/POST/DELETE /admin/date-blocks`.

---

## 7. Módulo Horarios — ⬜ PENDIENTE

**Base:** `apps/users/account-settings/` (form en card). Tabla 7 días con toggle `is_open` + 2 timepickers (`flatpickr` time-mode) cada uno.

**Endpoints:** `GET /admin/business-hours`, `PUT /admin/business-hours/:id`.

---

## 8. Módulo Settings — ⬜ PENDIENTE

**Base:** `apps/users/account-settings/` con tabs. 4 tabs: Operativos / Política cancelación / Feature flags / Mensajes bot.

**Endpoints:** `GET /admin/settings`, `PUT /admin/settings/:key`.

---

## 9. Módulo Administradores — ⬜ PENDIENTE

**Base:** `apps/users/role-details/`. Solo accesible para rol `owner`. Crear admin → invitación Supabase Auth.

---

## 10. Sidebar — ✅

`src/layouts/components/data.ts` ya reescrito con la estructura del plan §10:

```
Principal
  └ Dashboard
Operaciones
  └ Reservas (Lista Kanban + Calendario)
  └ Conversaciones
  └ Disponibilidad
  └ Horarios de atención
Catálogo
  └ Tours / Destinos / Políticas / FAQs / Info empresa
Sistema
  └ Settings
  └ Administradores
```

**Pendiente:** ocultar `Administradores` por rol (depende del paso 9 y de exponer el rol desde Supabase user metadata).

---

## 11. Componentes compartidos

| Componente | Estado | Archivo |
|---|---|---|
| `<StatusBadge />` | ✅ | `src/components/StatusBadge.tsx` |
| `<ConfirmModal />` (como helpers) | ✅ | `src/lib/confirm.ts` — `confirmAction`, `notifyOk`, `notifyError` |
| `<DataTable />` | ⬜ | wrapper sobre `@tanstack/react-table` con paginación/búsqueda/filtros |
| `<RichTextEditor />` | ⬜ | wrapper sobre Quill (Catálogo lo necesita) |
| `<LoadingSpinner />` | ⬜ | (cada página usa `<Spinner>` inline por ahora) |
| `<ErrorAlert />` | ⬜ | (cada página usa `<Alert variant="danger">` inline por ahora) |
| `<MoneyDisplay />` | ⬜ | formato `S/. 120 por persona` / `USD 50 por persona por día` |
| `<DateDisplay />` | ⬜ | formato fechas en español (actualmente se usa `dayjs` inline) |

---

## 12. Consideraciones técnicas — 🟡

| Punto | Estado |
|---|---|
| SSR off para FullCalendar / DataTables / Quill | ✅ aplicado en Reservas Calendario; replicar en Disponibilidad y módulos con Quill |
| Forms con react-hook-form + yup | ✅ patrón en Login; replicar en formularios de Catálogo/Settings |
| 401 → redirect login | ✅ centralizado en `api.ts` |
| 4xx → ErrorAlert | 🟡 actualmente se usa `<Alert>` inline con `err.message`; pendiente extraer a `<ErrorAlert />` |
| 5xx → mensaje genérico | 🟡 hereda del manejador genérico de `ApiError` |
| Loading spinner por módulo | 🟡 inline con `<Spinner>`; pendiente unificar |
| Responsive UBold | ✅ heredado del template |
| Resync RAG post-save | ⬜ aplicar cuando Catálogo se implemente |
| Permisos por rol | ⬜ pendiente — necesita exponer rol vía claim Supabase o `GET /admin/me` |

---

## 13. Errores `tsc --noEmit` actuales

Mi código compila limpio. Únicos errores remanentes son **pre-existentes del template** y viven en demos que se borrarán:

1. `src/app/(admin)/apps/crm/pipeline/components/usePipelineContext.tsx` — `ValidateForm` generic mismatch
2. `src/components/wrappers/ApexChart.tsx` — `'ApexChart' refers to a value, but is being used as a type`

No tocar; desaparecerán con la limpieza UBold de §0.1.

---

## 14. Próximo paso sugerido

El frontend Reservas ya funciona end-to-end contra el backend real. El siguiente paso depende de qué desbloquear primero:

1. **Backend M3 (recomendado)** — `/admin/stats/dashboard` + `/admin/receipts/:id/signed-url`. Desbloquea el módulo Dashboard (que hoy carga vacío) y la pestaña Comprobante del detalle de reserva.
2. **Backend M4** — CRUD de catálogo. Desbloquea el módulo Catálogo entero (Tours, Variantes, Destinos, Políticas, FAQs, Empresa).
3. **Backend M5** — `/admin/rag/resync/*`. Solo necesario una vez que el catálogo se edite desde panel.
4. **Frontend M6** — añadir `rejected` y `expired` a `RESERVA_STATUS_META`, agregar columnas correspondientes al kanban.

Orden lógico: **M3 → M4 → M5 → M6**.

---

## 15. Archivos clave creados / modificados hasta hoy

### Nuevos — Frontend
- `src/types/reservation.ts`, `src/types/catalog.ts`
- `src/lib/supabase/client.ts`
- `src/lib/api.ts`
- `src/lib/confirm.ts`, `src/lib/rag.ts`
- `src/components/StatusBadge.tsx`, `src/components/RichTextEditor.tsx`
- `src/app/(admin)/dashboard/page.tsx` + `dashboard/components/{ReservasStats,IngresosMes,ReservasAnalytics,UltimasReservas}.tsx`
- `src/app/(admin)/reservas/page.tsx` + `reservas/components/{ReservaCard,ReservasBoard,ReservasFilters}.tsx`
- `src/app/(admin)/reservas/hooks/useReservaActions.ts`
- `src/app/(admin)/reservas/calendario/page.tsx` + `calendario/components/{ReservasCalendar,ReservaEventModal}.tsx`
- `src/app/(admin)/reservas/[id]/page.tsx` + `[id]/components/{ReservaHeader,ReservaActions,TabResumen,TabComprobante,TabItinerario,TabHistorial}.tsx`
- `src/app/(admin)/catalogo/tours/page.tsx` + `tours/components/{TourCard,TourFormModal}.tsx` (UI lista, sin backend aún)

### Modificados — Frontend
- `src/hooks/useAuth.ts` — reescrito desde dummy
- `src/layouts/components/data.ts` — menú reescrito al dominio EcoExplora
- `src/app/auth/(basic)/sign-in/page.tsx` — handler real con Supabase
- `src/components/wrappers/AppProvidersWrapper.tsx` — redirect a sign-in si sin sesión
- `src/layouts/MainLayout.tsx` — bloqueo de render hasta sesión lista
- `src/lib/api.ts` — header `ngrok-skip-browser-warning`, `console.error` previo al redirect 401, sin loop si ya estás en `/auth/*`
- `src/app/(admin)/reservas/components/ReservasBoard.tsx` — wrapper `outlook-box kanban-app` para scroll horizontal estilo CRM pipeline

### Nuevos — Backend (`ecoexplora-bot/`)
- `app/api/admin/deps.py` — auth JWT compartida (HS256 + JWKS), `AdminUser`, `require_admin_user` / `require_write` / `require_owner`
- `app/api/admin/schemas.py` — Pydantic ES↔EN, builders desde rows postgres
- `app/api/admin/reservations.py` — router `/admin/reservations` con 8 endpoints

### Modificados — Backend
- `app/main.py` — montaje del nuevo router `admin_reservations_router` (el viejo `/admin/reservas` con `X-Admin-API-Key` sigue activo para no romper integraciones)
- `MVP_V2_PLAN.md` — sección 7.0 con estado de implementación; sección 7.2 con checkmarks por router