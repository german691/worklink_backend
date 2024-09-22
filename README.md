# Proyecto de Backend Web API para futura webapp para "Búsqueda de Trabajo"

Este proyecto es una Web API desarrollada con Express y Node.js para la
gestión de solicitudes y postulaciones de trabajo. Es una herramienta de
búsqueda de trabajo que permite la interacción entre clientes y
trabajadores. Este proyecto fue desarrollado como parte del trabajo
práctico de la materia Prácticas Profesionalizantes 3 en el Instituto
San Roque González de Posadas, Misiones, Argentina.

## Funcionalidades implementadas hasta el momento

### **Tipos de Usuarios:**
- **Clientes:** Pueden publicar solicitudes de trabajo.
- **Trabajadores:** Pueden postularse a las solicitudes de trabajo y esperar a ser aceptados.
- **Administrador (SIN IMPLMENTAR):** Gestiona y supervisa la plataforma.
- **LOS ENDPOINTS DE ADMIN NO ESTÁN IMPLEMENTADOS EN SU TOTALIDAD**
### **Publicación de Solicitudes:** 
Los clientes pueden crear y publicar solicitudes de trabajo.
### **Postulación a Solicitudes:** 
Los trabajadores pueden ver las solicitudes publicadas y postularse a ellas.

## Instalación

1.  Clona el repositorio:
    `git clone https://github.com/german691/worklink_backend.git`

2.  Navega al directorio del proyecto:
    `cd worklink_backend`

3.  Instala las dependencias:
    `npm install`

4.  Configura las variables de entorno en un archivo `.env`:

6.  Inicia el servidor:
    `npm run dev`

**Configuración del Entorno**

Este proyecto requiere ciertas variables de entorno. Crea un archivo `.env` en la raíz de tu proyecto y añade lo siguiente:

-   `MONGODB_URI`: Conexión a MongoDB.\
    **Formato**: `mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<nombreDeTuApp>`

-   `PORT`: Puerto de la aplicación.\
    **Formato**: Número entero, por ejemplo: `5000`.

-   `TOKEN_KEY`: Clave para tokens JWT.\
    **Formato**: String codificado en base64, por ejemplo: `cGFyY3RhbG9zY2lkZXJlZA==`

-   `TOKEN_EXPIRY`: Duración del token.\
    **Formato**: String, como `24h`.

-   `CRYPT_KEY`: Clave para cifrado.\
    **Formato**: String en formato SHA-256 codificado en base64, por ejemplo: `CEMJg06HLCnoJ6IxiEY0xfmRdIfE9HD6c9gYgL/u6qE=`

-   `AUTH_EMAIL`: Email de autenticación.\
    **Formato**: String, como `tu_email@ejemplo.com`.

-   `AUTH_PASSWORD`: Contraseña de autenticación.\
    **Formato**: String, como `TuContraseñaSegura`.

-   `DEFAULT_ADMIN_USERNAME`: Usuario administrador.\
    **Formato**: String, como `admin`.

-   `DEFAULT_ADMIN_PASSWORD`: Contraseña del administrador.\
    **Formato**: String, como `admin`.

## Uso

#### Rutas de Users

1.  **Registro de Usuario**
    -   Método: `POST /signup`
2.  **Inicio de Sesión**
    -   Método: `POST /login`

#### Rutas de Jobs

1.  **Obtener Trabajos**
    -   Método: `GET /api/jobs`
2.  **Obtener Detalles de un Trabajo**
    -   Método: `GET /api/jobs/:jobId`
3.  **Obtener Solicitantes de un Trabajo**
    -   Método: `GET /api/jobs/:jobId/applicants`
4.  **Publicar un Trabajo**
    -   Método: `POST /api/jobs`
5.  **Eliminar un Trabajo**
    -   Método: `DELETE /api/jobs/:jobId`
6.  **Editar un Trabajo**
    -   Método: `PUT /api/jobs/:jobId`
7.  **Iniciar un Trabajo**
    -   Método: `PATCH /api/jobs/:jobId/start`
8.  **Finalizar un Trabajo**
    -   Método: `PATCH /api/jobs/:jobId/finish`
9.  **Aplicar a un Trabajo**
    -   Método: `POST /api/jobs/:jobId/apply`
10. **Dejar un Trabajo**
    -   Método: `DELETE /api/jobs/:jobId/apply`
11. **Obtener Categorías**
    -   Método: `GET /api/jobs/categories`
12. **Crear Categorías**
    -   Método: `POST /api/jobs/categories`

### Detalles de Rutas

#### 1\. Registro de Usuario

-   **Ruta:** `POST /signup`
-   **Cuerpo (JSON):**

`{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword",
  "userType": "client",
  "name": "John",
  "surname": "Doe",
  "birthdate": "1990-01-01"
}`
 

`fetch('/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: "user123", email: "user@example.com", password: "securePassword", userType: "client", name: "John", surname: "Doe", birthdate: "1990-01-01" })
})`
 

`axios.post('/signup', {
  username: "user123",
  email: "user@example.com",
  password: "securePassword",
  userType: "client",
  name: "John",
  surname: "Doe",
  birthdate: "1990-01-01"
})`

#### 2\. Inicio de Sesión

-   **Ruta:** `POST /login`
-   **Cuerpo (JSON):**


`{
  "username": "user123",
  "password": "securePassword"
}`
 

`fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: "user123", password: "securePassword" })
})`
 

`axios.post('/login', {
  username: "user123",
  password: "securePassword"
})`

#### 3\. Obtener Trabajos

-   **Ruta:** `GET /api/jobs`
-   **Query:**
    -   `page` (opcional, número entero, mínimo 1)
    -   `limit` (opcional, número entero, mínimo 1)
    -   `username` (opcional, cadena) 

`fetch('/api/jobs?page=1&limit=10&username=user123', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.get('/api/jobs', {
  headers: { 'x-access-token': '<token>' },
  params: { page: 1, limit: 10, username: 'user123' }
})`

#### 4\. Obtener Detalles de un Trabajo

-   **Ruta:** `GET /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.get('/api/jobs/12345', { headers: { 'x-access-token': '<token>' } })`

#### 5\. Obtener Solicitantes de un Trabajo

-   **Ruta:** `GET /api/jobs/:jobId/applicants`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345/applicants', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.get('/api/jobs/12345/applicants', { headers: { 'x-access-token': '<token>' } })`

#### 6\. Publicar un Trabajo

-   **Ruta:** `POST /api/jobs`
-   **Body:**


`{
  "title": "Desarrollador Web",
  "description": "Se busca desarrollador con experiencia en React.",
  "category": "Desarrollo"
}`
 

`fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ title: "Desarrollador Web", description: "Se busca desarrollador con experiencia en React.", category: "Desarrollo" })
})`
 

`axios.post('/api/jobs', {
  title: "Desarrollador Web",
  description: "Se busca desarrollador con experiencia en React.",
  category: "Desarrollo"
}, { headers: { 'x-access-token': '<token>' } })`

#### 7\. Eliminar un Trabajo

-   **Ruta:** `DELETE /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.delete('/api/jobs/12345', { headers: { 'x-access-token': '<token>' } })`

#### 8\. Editar un Trabajo

-   **Ruta:** `PUT /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena)
-   **Body:**


`{
  "title": "Desarrollador Senior",
  "description": "Se busca desarrollador con experiencia en Node.js."
}`
 

`fetch('/api/jobs/12345', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ title: "Desarrollador Senior", description: "Se busca desarrollador con experiencia en Node.js." })
})`
 

`axios.put('/api/jobs/12345', {
  title: "Desarrollador Senior",
  description: "Se busca desarrollador con experiencia en Node.js."
}, { headers: { 'x-access-token': '<token>' } })`

#### 9\. Iniciar un Trabajo

-   **Ruta:** `PATCH /api/jobs/:jobId/start`
-   **Params:**
    -   `jobId` (requerido, cadena)
-   **Body:**


`{
  "userId": "user123"
}`
 

`fetch('/api/jobs/12345/start', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ userId: "user123" })
})`
 

`axios.patch('/api/jobs/12345/start', { userId: "user123" }, { headers: { 'x-access-token': '<token>' } })`

#### 10\. Finalizar un Trabajo

-   **Ruta:** `PATCH /api/jobs/:jobId/finish`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345/finish', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.patch('/api/jobs/12345/finish', {}, { headers: { 'x-access-token': '<token>' } })`

#### 11\. Aplicar a un Trabajo

-   **Ruta:** `POST /api/jobs/:jobId/apply`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.post('/api/jobs/12345/apply', {}, { headers: { 'x-access-token': '<token>' } })`

#### 12\. Dejar un Trabajo

-   **Ruta:** `DELETE /api/jobs/:jobId/apply`
-   **Params:**
    -   `jobId` (requerido, cadena) 

`fetch('/api/jobs/12345/apply', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.delete('/api/jobs/12345/apply', { headers: { 'x-access-token': '<token>' } })`

#### 13\. Obtener Categorías

-   **Ruta:** `GET /api/jobs/categories` 

`fetch('/api/jobs/categories', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})`
 

`axios.get('/api/jobs/categories', { headers: { 'x-access-token': '<token>' } })`

#### 14\. Crear Categorías

-   **Ruta:** `POST /api/jobs/categories`
-   **Body:**


`{
  "category": ["Desarrollo", "Diseño"]
}`
 

`fetch('/api/jobs/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ category: ["Desarrollo", "Diseño"] })
})`
 

`axios.post('/api/jobs/categories', {
  category: ["Desarrollo", "Diseño"]
}, { headers: { 'x-access-token': '<token>' } })`

### Respuestas

-   **Respuesta Éxito (200):**


`{ "username": "user123", "email": "user@example.com", "userType": "client", "name": "John", "surname": "Doe", "birthdate": "1990-01-01" }`

-   **Respuesta Error (400):**


`{ "error": "Mensaje de error de validación" }`