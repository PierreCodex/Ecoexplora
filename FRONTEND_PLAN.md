# Plan Frontend — Panel Admin EcoExplora Tumbes

> Documento para el agente frontend.
> **Ruta del proyecto:** `F:\PERSONAL_JEAN\Fronted-Ecoexplora\Admin\TS\`
> **Stack:** Next.js 16 + React 19 + TypeScript + Bootstrap 5 + Supabase Auth.
> **Backend:** FastAPI en `https://tu-backend.com` — todas las llamadas van con JWT en `Authorization: Bearer`.
> **Estrategia:** Reusar componentes existentes del template UBold adaptándolos al dominio de EcoExplora (reservas, conversaciones, catálogo). No construir desde cero lo que ya existe.

---

## 0. Setup inicial (hacer primero)

### 0.1 Limpieza del template UBold

Borrar páginas demo que **no se usan**:

```
src/app/(admin)/apps/email
src/app/(admin)/apps/outlook
src/app/(admin)/apps/social-feed
src/app/(admin)/apps/ticket
src/app/(admin)/apps/invoice
src/app/(admin)/apps/ecommerce
src/app/(admin)/apps/api-keys
src/app/(admin)/apps/crm/campaign
src/app/(admin)/apps/crm/contacts
src/app/(admin)/apps/crm/customers
src/app/(admin)/apps/crm/deals
src/app/(admin)/apps/crm/estimations
src/app/(admin)/apps/crm/leads
src/app/(admin)/apps/crm/opportunities
src/app/(admin)/apps/crm/proposals
src/app/(admin)/charts
src/app/(admin)/icons
src/app/(admin)/layouts
src/app/(admin)/maps
src/app/(admin)/pages
src/app/(admin)/plugins
src/app/(admin)/widgets
src/app/(admin)/form
src/app/(admin)/tables
src/app/(admin)/ui
```

**Mantener / Reusar:**

| Folder a mantener | Para qué |
|---|---|
| `apps/calendar/` | Calendario de reservas confirmadas + Disponibilidad |
| `apps/crm/pipeline/` | Lista kanban de reservas por estado |
| `apps/crm/activities/` | Timeline de eventos de reserva + itinerarios de tour |
| `apps/chat/` | Conversaciones de WhatsApp |
| `apps/file-manager/` | Visualizar comprobantes de pago |
| `apps/users/contacts/` | Lista de clientes |
| `apps/users/profile/` | Perfil de cliente / detalle de cliente |
| `apps/users/account-settings/` | Settings del panel |
| `apps/users/role-details/` | Permisos / admin_users |
| `dashboard/ecommerce/` | Dashboard principal (stats + gráficos) |
| `dashboard/projects/` | Stats secundarias (cards) |
| `auth/(basic)/sign-in/` | Login |
| `auth/(basic)/reset-pass/` | Reset password |
| `(admin)/layout.tsx` y wrappers | Layout global |

### 0.2 Auth real con Supabase

Reemplazar `src/hooks/useAuth.ts` (dummy con sessionStorage) por Supabase Auth real.

**Dependencias a instalar:**
```bash
npm install @supabase/ssr @supabase/supabase-js
```

**Archivo: `src/lib/supabase/client.ts`**
```ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**`useAuth.ts` real:**
- `signIn(email, password)` → `supabase.auth.signInWithPassword()`
- `signOut()` → `supabase.auth.signOut()`
- `session` → `supabase.auth.getSession()`
- El JWT de sesión se incluye en cada llamada al backend: `Authorization: Bearer <access_token>`

### 0.3 Cliente HTTP centralizado

**Archivo: `src/lib/api.ts`**

```ts
async function apiFetch(path: string, options?: RequestInit) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
}
```

### 0.4 Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

---

## 1. Módulo: Login

**Componente base a reusar:** `src/app/auth/(basic)/sign-in/page.tsx` (ya existe)

**Cambios:**
- Adaptar el handler de submit para usar `supabase.auth.signInWithPassword()`
- Si error: mostrar inline con `Alert` de react-bootstrap
- Si éxito: redirect a `/dashboard`
- Si ya hay sesión activa: redirect automático

**Validación:** `react-hook-form` + `yup`
- Email: formato válido, requerido
- Password: mínimo 6 caracteres, requerido

---

## 2. Módulo: Dashboard

**Ruta nueva:** `src/app/(admin)/dashboard/page.tsx`

**Componentes base a reusar de `dashboard/ecommerce/components/`:**

| Componente UBold | Adaptación para EcoExplora |
|---|---|
| `EcomStats.tsx` | → `ReservasStats.tsx` — Cards de métricas (reservas hoy, pendientes verificación, pendientes pago, conversaciones activas, takeover, ingresos del mes) |
| `SalesAnalytics.tsx` | → `ReservasAnalytics.tsx` — Gráfico ApexCharts de reservas por día (últimos 30 días) |
| `RecentOrders.tsx` | → `UltimasReservas.tsx` — Tabla con últimas 5 reservas |
| `TotalSales.tsx` | → `IngresosMes.tsx` — Card grande de ingresos del mes con comparativa |

**Endpoint:** `GET /admin/stats/dashboard`

**Respuesta esperada:**
```json
{
  "reservas_hoy": 3,
  "reservas_pendientes_verificacion": 5,
  "reservas_pendientes_pago": 2,
  "conversaciones_activas": 12,
  "conversaciones_takeover": 1,
  "ingresos_mes": 4500.00,
  "ingresos_mes_anterior": 3800.00,
  "reservas_por_dia": [{"date": "2026-05-01", "count": 3}, ...]
}
```

---

## 3. Módulo: Reservas

### 3.1 Vista Pipeline (Kanban) — Lista principal

**Ruta:** `src/app/(admin)/reservas/page.tsx`
**Componente base a reusar:** `apps/crm/pipeline/`

**Adaptación:**

Las columnas del kanban representan los estados de reserva:

| Columna | Estado | Color |
|---|---|---|
| Pendiente Pago | `pending_payment` | warning |
| Pendiente Verificación | `pending_verification` | info |
| Confirmadas | `confirmed` | success |
| Cancelación Solicitada | `cancellation_requested` | danger |
| Canceladas | `cancelled` | secondary |
| Completadas | `completed` | primary |

**Cada card del kanban** (adaptar `TaskItem` de `PipelinePage.tsx`):
- Código de reserva (ej: `RES-20260510-0001`)
- Nombre del cliente
- Tour + variante
- Fecha de servicio
- Cantidad de pax
- Monto total
- Avatar/iniciales del cliente
- Dropdown con acciones según estado: Ver detalle, Confirmar, Rechazar, Cancelar, Reembolsar

**Drag and drop:** **DESACTIVAR**. En CRM mover entre columnas cambia estado, pero acá los estados son automáticos. Solo lectura visual.

**Filtros (header del pipeline):**
- Búsqueda por código o nombre
- Filtro por tour
- Filtro por rango de fechas

**Endpoint:** `GET /admin/reservations` con `?status=...&search=...&page=...`

### 3.2 Vista Calendario — Reservas confirmadas

**Ruta:** `src/app/(admin)/reservas/calendario/page.tsx`
**Componente base a reusar:** `apps/calendar/components/CalendarPage.tsx`

**Adaptación:**

Cada **evento del calendario** = una reserva confirmada. Mapeo:

```ts
{
  id: reserva.id,
  title: `${reserva.code} - ${reserva.customer.full_name} (${reserva.pax_count} pax)`,
  start: reserva.service_date,
  className: getColorByTour(reserva.tour_variant.tour_slug)
}
```

**Click en evento:** abre modal con resumen + botón "Ver detalle completo" (redirige a `/reservas/[id]`)

**Funcionalidad a remover del template:**
- "Create New Event" (no se crean reservas desde el calendario)
- Drag and drop de reservas (no se reprograman desde acá)
- External events sidebar

**Funcionalidad a mantener:**
- Vista Mes / Semana / Día / Lista
- Click en evento para ver detalle

**Endpoint:** `GET /admin/reservations?status=confirmed&service_date_from=...&service_date_to=...`

### 3.3 Detalle de reserva

**Ruta:** `src/app/(admin)/reservas/[id]/page.tsx`
**Componentes base a reusar:**
- `apps/users/profile/` — estructura de header con avatar + datos del cliente
- `apps/crm/activities/page.tsx` — timeline de eventos de la reserva

**Layout:**

**Header (parte superior, basado en profile):**
- Avatar/iniciales del cliente
- Nombre, DNI, email, teléfono
- Código de reserva, estado (badge), fecha creación

**Tabs (debajo del header):**

**Tab 1: Resumen**
- Datos de la reserva: tour, variante, fecha servicio, pax, monto total, expira en
- Datos congelados del snapshot: precio, política de cancelación

**Tab 2: Comprobante**
- Si existe: imagen del comprobante (cargada via `GET /admin/receipts/:id/signed-url`)
- Estado de verificación
- Si está pendiente: botones **Aprobar** / **Rechazar** (con SweetAlert2 confirmación)
- Notas

**Tab 3: Itinerario** (reusar `apps/crm/activities/page.tsx`)
- Timeline con el itinerario congelado del snapshot
- Cada paso del tour como `timeline-item`

**Tab 4: Historial**
- Timeline con `reservation_events` (basado en `crm/activities`)
- `reservation_created`, `payment_instructions_sent`, `receipt_uploaded`, `payment_verified`, etc.

**Acciones (botones en header lateral derecho):**

| Estado actual | Acciones disponibles |
|---|---|
| `pending_verification` | Confirmar pago, Rechazar pago |
| `confirmed` | Cancelar, Reembolsar, Reprogramar, Reenviar instrucciones |
| `cancellation_requested` | Procesar reembolso |

**Endpoints de acciones:**
- `POST /admin/reservations/:id/confirm`
- `POST /admin/reservations/:id/reject`
- `POST /admin/reservations/:id/cancel`
- `POST /admin/reservations/:id/process-refund`
- `POST /admin/reservations/:id/resend-payment-instructions`
- `POST /admin/reservations/:id/reschedule`

**Cada acción destructiva usa SweetAlert2.**

---

## 4. Módulo: Conversaciones

### 4.1 Lista + Chat

**Ruta:** `src/app/(admin)/conversaciones/page.tsx`
**Componente base a reusar:** `apps/chat/components/ChatPage.tsx`

**Adaptación directa al dominio:**

| Concepto chat template | Concepto EcoExplora |
|---|---|
| `contactData` | Lista de conversaciones de WhatsApp |
| `currentContact` | Conversación seleccionada |
| `messageThreadData` | Mensajes de la conversación |
| `senderId === currentUser.id` | Mensajes del bot/admin (lado derecho) |
| `senderId === contact.id` | Mensajes del usuario (lado izquierdo) |
| `isOnline` | Estado: bot_active / human_takeover |

**Adaptaciones específicas:**

**Sidebar izquierdo (lista de conversaciones):**
- Cada item: teléfono, nombre del cliente, último mensaje, hora
- Badge de estado: `bot_active` (verde) / `human_takeover` (rojo) / `archived` (gris)
- Búsqueda por teléfono o nombre

**Header del chat (centro):**
- Datos del cliente
- Estado de la conversación
- Botones de acción:
  - **Tomar control** (si `bot_active`) → `POST /admin/conversations/:id/takeover`
  - **Liberar** (si `human_takeover`) → `POST /admin/conversations/:id/release`
  - **Archivar**

**Burbujas de mensajes:**
- Usuario (cliente WhatsApp) → izquierda, color amarillo claro (igual al template)
- Bot → derecha, color azul claro (igual al template)
- Admin (en takeover) → derecha, color verde para distinguir
- Cada mensaje muestra: texto, hora, ícono de origen (bot/admin)

**Footer del chat (input):**
- **Solo habilitado si `human_takeover`**
- Si `bot_active`: deshabilitado con texto "El bot está respondiendo. Toma control para responder manualmente."
- Submit → `POST /admin/conversations/:id/send-message` con `{ message: string }`

**Endpoints:**
- `GET /admin/conversations` (lista)
- `GET /admin/conversations/:id` (detalle con mensajes)
- `POST /admin/conversations/:id/takeover`
- `POST /admin/conversations/:id/release`
- `POST /admin/conversations/:id/send-message`

---

## 5. Módulo: Catálogo

### 5.1 Tours

**Ruta:** `src/app/(admin)/catalogo/tours/page.tsx`
**Componente base a reusar:** `apps/users/contacts/page.tsx` (lista de cards/grid)

**Adaptación:**

Vista de **grid de cards** de tours (similar a contacts):

Cada card muestra:
- Imagen del tour (placeholder si no hay)
- Nombre del tour
- Descripción base (truncada)
- Cantidad de variantes
- Toggle de activo/inactivo
- Acciones: Editar, Ver variantes, Eliminar

**Botón superior:** "Nuevo Tour" → modal con formulario

**Formulario (modal):**
- `name` — input text, requerido
- `slug` — input text, auto-generado
- `base_description` — textarea
- `active` — checkbox
- `display_order` — number input

**Endpoints:** CRUD en `/admin/catalog/tours`

### 5.2 Variantes de tour

**Ruta:** `src/app/(admin)/catalogo/tours/[id]/variantes/page.tsx`
**Componente base a reusar:** `apps/users/profile/` para el detalle de variante

**Lista de variantes:** tabla con `@tanstack/react-table`
- Etiqueta, precio, duración, capacidad diaria, estado, acciones

**Formulario de variante (página completa o modal grande):**

**Sección 1: Datos básicos**
- `variant_label` — input text
- `summary` — textarea
- `active` — checkbox

**Sección 2: Precio**
- `price_amount` — number
- `price_currency` — select: PEN, USD
- `price_unit` — select: per_person, per_person_per_day, group
- `price_total_amount` — number (opcional)
- `payment_terms_json` — JSON editor o campos estructurados

**Sección 3: Duración**
- `duration_type` — select
- Campos condicionales según tipo: `duration_hours`, `duration_days`, `duration_nights`

**Sección 4: Contenido (Quill editors)**
- `includes_text`
- `itinerary_text`
- `recommendations_text`
- `important_notes_text`

**Sección 5: Cupos y destinos**
- `default_daily_capacity` — number
- `destinos` — multiselect drag-and-drop ordenable

> **Importante:** Cada save al catálogo dispara `POST /admin/rag/resync/*` después de éxito.

### 5.3 Destinos

**Ruta:** `src/app/(admin)/catalogo/destinos/page.tsx`
**Componente base a reusar:** `apps/users/contacts/` (lista en grid)

**Tabla:** nombre, slug, lat/long, aliases (chips)

**Formulario:**
- `name`, `slug`, `latitude`, `longitude`
- `aliases` — input tags (array)

**Endpoints:** CRUD en `/admin/catalog/destinations`

### 5.4 Políticas

**Ruta:** `src/app/(admin)/catalogo/politicas/page.tsx`
**Componente base a reusar:** tabla simple con `@tanstack/react-table`

**Formulario:**
- `title`, `slug`, `topic` — inputs texto
- `content` — **Quill editor**
- `priority` — number
- `active` — checkbox

**Endpoints:** CRUD en `/admin/catalog/policies`

### 5.5 FAQs

**Ruta:** `src/app/(admin)/catalogo/faqs/page.tsx`
**Componente base a reusar:** tabla simple con `@tanstack/react-table` o accordion de Bootstrap

**Formulario:**
- `question` — textarea
- `answer` — **Quill editor**
- `topic`, `slug` — inputs
- `priority`, `active`

**Endpoints:** CRUD en `/admin/catalog/faqs`

### 5.6 Info de empresa

**Ruta:** `src/app/(admin)/catalogo/empresa/page.tsx`
**Componente base a reusar:** `apps/users/account-settings/page.tsx` (form de configuración)

**Formulario (único registro):**
- `name`, `short_description` — inputs
- `long_description` — **Quill editor**
- `phone`, `email`, `website` — inputs
- `offices` — array de objetos con campos repetibles

**Endpoints:** `GET` y `PUT /admin/catalog/company`

---

## 6. Módulo: Disponibilidad

**Ruta:** `src/app/(admin)/disponibilidad/page.tsx`
**Componente base a reusar:** `apps/calendar/components/CalendarPage.tsx`

**Adaptación clave:** este calendario es DISTINTO al de reservas confirmadas.

**Header del calendario:**
- Select de variante de tour (filtro principal)
- Botón "Bloquear fecha"

**Cada día muestra:**
- Cupo restante (número grande)
- Color según disponibilidad:
  - Verde: tiene cupo (>3)
  - Amarillo: cupo bajo (1-3)
  - Rojo: sin cupo o bloqueado
  - Gris: bloqueado globalmente

**Click en día:** abre modal con:
- Cupo actual
- Capacidad personalizada (input editable)
- Estado de bloqueo
- Botón "Bloquear fecha" / "Desbloquear"
- Razón del bloqueo (si aplica)
- Botón "Guardar"

**Adaptaciones del template:**
- Quitar "external events" (no aplica)
- Quitar drag-and-drop entre días
- Mantener solo vista mes (las otras no aplican)

**Endpoints:**
- `GET /admin/availability?variant=...&month=YYYY-MM`
- `PUT /admin/availability/:variant/:date` con `{ capacity: number }`
- `DELETE /admin/availability/:variant/:date` (restaurar default)
- `GET /admin/date-blocks`
- `POST /admin/date-blocks` con `{ date, tour_variant_id?, reason }`
- `DELETE /admin/date-blocks/:id`

---

## 7. Módulo: Horarios de atención

**Ruta:** `src/app/(admin)/horarios/page.tsx`
**Componente base a reusar:** `apps/users/account-settings/page.tsx` (form simple en card)

**UI:** Tabla de 7 días dentro de un Card

| Día | ¿Abierto? | Hora inicio | Hora fin |
|---|---|---|---|
| Lunes | toggle | timepicker | timepicker |
| Martes | toggle | timepicker | timepicker |
| ... | | | |

- Toggle `is_open`: habilita/deshabilita los timepickers del día
- Timepickers: `flatpickr` en modo time
- Botón "Guardar cambios" al final
- SweetAlert2 antes de guardar

**Endpoints:**
- `GET /admin/business-hours`
- `PUT /admin/business-hours/:id`

---

## 8. Módulo: Settings

**Ruta:** `src/app/(admin)/settings/page.tsx`
**Componente base a reusar:** `apps/users/account-settings/page.tsx`

**Estructura:** Tabs de Bootstrap como en account-settings, adaptadas al dominio.

### Tab 1: Operativos
| Setting | Tipo |
|---|---|
| `yape_number` | text |
| `yape_holder_name` | text |
| `reservation_expiration_hours` | number |
| `reservation_min_lead_hours` | number |
| `reschedule_min_lead_hours` | number |
| `reservation_dni_max_retries` | number |
| `reservation_email_max_retries` | number |
| `signed_url_ttl_seconds` | number |

### Tab 2: Política de cancelación
- `cancellation_policy.refund_full_hours_min`
- `cancellation_policy.refund_partial_hours_min`
- `cancellation_policy.refund_partial_percent`

### Tab 3: Feature Flags
Toggles para cada flag.

### Tab 4: Mensajes del bot
Cada mensaje en un card con textarea editable + botón "Guardar":
- `handoff_reply`
- `audio_retry`
- `image_unclear`
- `payment_instructions_template`
- `payment_received_ack`
- `cancellation_requested_ack`
- `refund_processed_template`
- `refund_rejected_template`

**Endpoints:**
- `GET /admin/settings`
- `PUT /admin/settings/:key`

---

## 9. Módulo: Administradores (admin_users)

**Ruta:** `src/app/(admin)/administradores/page.tsx`
**Componente base a reusar:** `apps/users/role-details/`

**Funcionalidad:**
- Lista de admin_users con rol (`owner`, `operator`, `viewer`)
- Activar/desactivar
- Crear nuevo admin (envía invitación de Supabase Auth)

**Solo accesible para `owner`.**

---

## 10. Sidebar — Navegación principal

**Archivo a editar:** `src/assets/data/menu-items.ts` (o el equivalente en el template)

```
📊 Dashboard
📋 Reservas
   └ Lista (Kanban)
   └ Calendario
💬 Conversaciones
🌿 Catálogo
   └ Tours
   └ Destinos
   └ Políticas
   └ FAQs
   └ Info empresa
📅 Disponibilidad
🕐 Horarios
⚙️ Settings
👥 Administradores  (solo owner)
```

---

## 11. Componentes compartidos a crear

### `<StatusBadge status="..." />`
Badge Bootstrap con color según estado de reserva o conversación.

### `<ConfirmModal />`
Wrapper de SweetAlert2 para acciones destructivas.

### `<DataTable />`
Wrapper de `@tanstack/react-table` con paginación, búsqueda y filtros estándar (para módulos que no usan kanban/calendario).

### `<RichTextEditor />`
Wrapper de Quill con toolbar estándar.

### `<LoadingSpinner />` y `<ErrorAlert />`
Estados de carga y error.

### `<MoneyDisplay amount currency unit />`
Formato de precio: `S/. 120 por persona` o `USD 50 por persona por día`.

### `<DateDisplay date format="dd/MM/yyyy" />`
Formato de fechas en español.

---

## 12. Consideraciones técnicas

- **SSR:** Importar DataTables, FullCalendar y Quill via `next/dynamic` con `ssr: false` para evitar errores de hidratación en Next 16.
- **Forms:** Todos con `react-hook-form` + `yup`.
- **Errores:** Si la API devuelve 401, redirigir a login. 4xx → `<ErrorAlert />`. 5xx → mensaje genérico.
- **Loading:** Cada módulo muestra spinner mientras carga datos.
- **Responsive:** Mantener el responsive del template UBold (sidebar colapsable, offcanvas en móvil).
- **Resync RAG:** Después de cualquier escritura al catálogo, llamar a `POST /admin/rag/resync/*`.
- **Permisos:** Ocultar módulos según rol del admin (`owner` ve todo, `operator` ve operación diaria, `viewer` solo lectura).

---

## 13. Orden de implementación sugerido

1. **Setup** — Limpieza UBold + auth Supabase + cliente API + variables de entorno
2. **Login** — adaptar `auth/(basic)/sign-in/`
3. **Sidebar** — adaptar menú de navegación con los items de EcoExplora
4. **Dashboard** — adaptar `dashboard/ecommerce/`
5. **Reservas Kanban** — adaptar `apps/crm/pipeline/`
6. **Reservas Calendario** — adaptar `apps/calendar/`
7. **Reservas Detalle** — combinar `apps/users/profile/` + `apps/crm/activities/`
8. **Conversaciones** — adaptar `apps/chat/`
9. **Catálogo Tours** — adaptar `apps/users/contacts/`
10. **Catálogo Variantes** — formulario completo con Quill
11. **Catálogo Destinos / Políticas / FAQs / Empresa** — tablas + formularios
12. **Disponibilidad** — adaptar `apps/calendar/` (segunda instancia, distinta a reservas)
13. **Horarios** — adaptar `apps/users/account-settings/`
14. **Settings** — adaptar `apps/users/account-settings/` con tabs
15. **Administradores** — adaptar `apps/users/role-details/`
16. **Pulido** — manejo de errores global, loading states, responsive, permisos por rol

---

## 14. Resumen de mapeo componentes UBold → EcoExplora

| Componente UBold | Módulo EcoExplora |
|---|---|
| `dashboard/ecommerce/` | Dashboard principal |
| `apps/crm/pipeline/` | Reservas (kanban por estado) |
| `apps/calendar/` | Calendario de reservas confirmadas |
| `apps/calendar/` (otra instancia) | Disponibilidad de cupos |
| `apps/crm/activities/` | Itinerario de tour + historial de eventos de reserva |
| `apps/users/profile/` | Detalle de reserva (header con datos cliente) |
| `apps/chat/` | Conversaciones de WhatsApp |
| `apps/users/contacts/` | Catálogo de tours / destinos (grid) |
| `apps/users/account-settings/` | Settings + Horarios + Info empresa |
| `apps/users/role-details/` | Administradores |
| `apps/file-manager/` | Visualizar comprobantes (opcional) |
| `auth/(basic)/sign-in/` | Login |

Esta estrategia minimiza el código nuevo y aprovecha al máximo el template ya estilizado.