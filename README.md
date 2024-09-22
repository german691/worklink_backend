# Proyecto de Backend Web API para futura webapp para "Búsqueda de Trabajo"

Este proyecto es una Web API desarrollada con Express y Node.js para la
gestión de solicitudes y postulaciones de trabajo. Es una herramienta de
búsqueda de trabajo que permite la interacción entre clientes y
trabajadores. El backend de este proyecto fue desarrollado en base a la materia "Prácticas Profesionalizantes 3" del Instituto
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

-   `PORT`: Puerto de la aplicación (Por ejemplo, `5000`).

-   `TOKEN_KEY`: Clave para tokens JWT.\
    **Formato**: String en formato SHA-256 codificado en base64.

-   `TOKEN_EXPIRY`: Duración del token.\
    **Formato**: String, por defecto `24h`.

-   `CRYPT_KEY`: Clave para cifrado.\
    **Formato**: String en formato SHA-256 codificado en base64.

-   `AUTH_EMAIL`: Email de autenticación.
    **Formato**: String, email genérico `tu_email@ejemplo.com`.

-   `AUTH_PASSWORD`: Contraseña de autenticación.
    **Formato**: String, contraseña genérica.

-   `DEFAULT_ADMIN_USERNAME`: Usuario administrador.

-   `DEFAULT_ADMIN_PASSWORD`: Contraseña del administrador.

## Uso

#### Rutas de Users

1.  **Registro de Usuario**
    -   Método: `POST api/user/signup`
2.  **Inicio de Sesión**
    -   Método: `POST api/user/login`

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

#### Rutas públicas:

1. **Enviar OTP**
    -   Método: `POST /api/otp/`
2. **Verificar OTP**
    -   Método: `POST /api/otp/verify`
3. **Enviar OTP para verificación de email**
    -   Método: `POST /api/email_verification`
4. **Verificar email con OTP**
    -   Método: `POST /api/email_verification/verify`
5. **Enviar OTP para reestablecer contraseña**
    -   Método: `POST /api/forgot_password`
6. **Verificar OTP para reestablecer contraseña**
    -   Método: `POST /api/forgot_password/reset`

#### Las rutas ADMIN siguen en desarrollo y no están completamente implementadas.

### Detalles de Rutas

#### 1\. Registro de Usuario

-   **Ruta:** `POST /signup`
-   **Cuerpo (JSON):**

```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword",
  "userType": "client",
  "name": "John",
  "surname": "Doe",
  "birthdate": "1990-01-01"
}
```
```javascript
fetch('/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: "user123", email: "user@example.com", password: "securePassword", userType: "client", name: "John", surname: "Doe", birthdate: "1990-01-01" })
})
```
```javascript
axios.post('/signup', {
  username: "user123",
  email: "user@example.com",
  password: "securePassword",
  userType: "client",
  name: "John",
  surname: "Doe",
  birthdate: "1990-01-01"
})
```

#### 2\. Inicio de Sesión

-   **Ruta:** `POST /login`
-   **Cuerpo (JSON):**

```json
{
  "username": "user123",
  "password": "securePassword"
}
```
```javascript
fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: "user123", password: "securePassword" })
})
 ```
```javascript
axios.post('/login', {
  username: "user123",
  password: "securePassword"
})
```

#### 3\. Obtener Trabajos

-   **Ruta:** `GET /api/jobs`
-   **Query:**
    -   `page` (opcional, número entero, mínimo 1)
    -   `limit` (opcional, número entero, mínimo 1)
    -   `username` (opcional, cadena) 

```javascript
fetch('/api/jobs?page=1&limit=10&username=user123', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.get('/api/jobs', {
  headers: { 'x-access-token': '<token>' },
  params: { page: 1, limit: 10, username: 'user123' }
})
```
#### 4\. Obtener Detalles de un Trabajo

-   **Ruta:** `GET /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena)
    -   
```javascript
fetch('/api/jobs/12345', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.get('/api/jobs/12345', { headers: { 'x-access-token': '<token>' } })
```
#### 5\. Obtener Solicitantes de un Trabajo

-   **Ruta:** `GET /api/jobs/:jobId/applicants`
-   **Params:**
    -   `jobId` (requerido, cadena) 
```javascript
fetch('/api/jobs/12345/applicants', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.get('/api/jobs/12345/applicants', { headers: { 'x-access-token': '<token>' } })
```

#### 6\. Publicar un Trabajo

-   **Ruta:** `POST /api/jobs`
-   **Body:**

```json
{
  "title": "Desarrollador Web",
  "description": "Se busca desarrollador con experiencia en React.",
  "category": "Desarrollo"
}
```
 
```javascript
fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ title: "Desarrollador Web", description: "Se busca desarrollador con experiencia en React.", category: "Desarrollo" })
})
```
```javascript
axios.post('/api/jobs', {
  title: "Desarrollador Web",
  description: "Se busca desarrollador con experiencia en React.",
  category: "Desarrollo"
}, { headers: { 'x-access-token': '<token>' } })
```

#### 7\. Eliminar un Trabajo

-   **Ruta:** `DELETE /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena) 

```javascript
fetch('/api/jobs/12345', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.delete('/api/jobs/12345', { headers: { 'x-access-token': '<token>' } )
```
#### 8\. Editar un Trabajo

-   **Ruta:** `PUT /api/jobs/:jobId`
-   **Params:**
    -   `jobId` (requerido, cadena)
-   **Body:**


```json
{
  "title": "Desarrollador Senior",
  "description": "Se busca desarrollador con experiencia en Node.js."
}
```
 
```javascript
fetch('/api/jobs/12345', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ title: "Desarrollador Senior", description: "Se busca desarrollador con experiencia en Node.js." })
})
```
```javascript
axios.put('/api/jobs/12345', {
  title: "Desarrollador Senior",
  description: "Se busca desarrollador con experiencia en Node.js."
}, { headers: { 'x-access-token': '<token>' } })
```

#### 9\. Iniciar un Trabajo

-   **Ruta:** `PATCH /api/jobs/:jobId/start`
-   **Params:**
    -   `jobId` (requerido, cadena)
-   **Body:**

```json
{
  "userId": "user123"
}
```
 
```javascript
fetch('/api/jobs/12345/start', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ userId: "user123" })
})
```
```javascript
axios.patch('/api/jobs/12345/start', { userId: "user123" }, { headers: { 'x-access-token': '<token>' } })
```

#### 10\. Finalizar un Trabajo

-   **Ruta:** `PATCH /api/jobs/:jobId/finish`
-   **Params:**
    -   `jobId` (requerido, cadena) 

```javascript
fetch('/api/jobs/12345/finish', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.patch('/api/jobs/12345/finish', {}, { headers: { 'x-access-token': '<token>' } })
```

#### 11\. Aplicar a un Trabajo

-   **Ruta:** `POST /api/jobs/:jobId/apply`
-   **Params:**
    -   `jobId` (requerido, cadena) 

```javascript
fetch('/api/jobs/12345/apply', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.post('/api/jobs/12345/apply', {}, { headers: { 'x-access-token': '<token>' } })
```

#### 12\. Dejar un Trabajo

-   **Ruta:** `DELETE /api/jobs/:jobId/apply`
-   **Params:**
    -   `jobId` (requerido, cadena) 

```javascript
fetch('/api/jobs/12345/apply', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.delete('/api/jobs/12345/apply', { headers: { 'x-access-token': '<token>' } })
```

#### 13\. Obtener Categorías

-   **Ruta:** `GET /api/jobs/categories` 

```javascript
fetch('/api/jobs/categories', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' }
})
```
```javascript
axios.get('/api/jobs/categories', { headers: { 'x-access-token': '<token>' } })
```

#### 14\. Crear Categorías

-   **Ruta:** `POST /api/jobs/categories`
-   **Body:**

```json
{
  "category": ["Desarrollo", "Diseño"]
}
```
 
```javascript
fetch('/api/jobs/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-access-token': '<token>' },
  body: JSON.stringify({ category: ["Desarrollo", "Diseño"] })
})
```
```javascript
axios.post('/api/jobs/categories', {
  category: ["Desarrollo", "Diseño"]
}, { headers: { 'x-access-token': '<token>' } })
```
### Respuestas

-   **Respuesta Éxito (200):**

```javascript
{ "username": "user123", "email": "user@example.com", "userType": "client", "name": "John", "surname": "Doe", "birthdate": "1990-01-01" }
```
-   **Respuesta Error (400):**

```json
{ "error": "Mensaje de error de validación" }
```

#### 15\. Enviar OTP

```javascript
fetch('/api/otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
    subject: 'Verificación de OTP',
    message: 'Su código OTP es: 123456',
    duration: 10,
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

```javascript
axios.post('/api/otp', {
  email: 'usuario@example.com',
  subject: 'Verificación de OTP',
  message: 'Su código OTP es: 123456',
  duration: 10,
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

**Respuesta esperada**:


```json
{
  "otp": "123456", // OTP generado
  "message": "OTP enviado con éxito"
}
```

#### 16\. Verificar OTP

```javascript
fetch('/api/otp/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
    otp: '123456',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`
```
```javascript
axios.post('/api/otp/verify', {
  email: 'usuario@example.com',
  otp: '123456',
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

```json
{
  "valid": true // o false dependiendo de si el OTP es válido
}
```

#### 17\. Enviar OTP para verificación de email

```javascript
fetch('/api/email_verification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
```javascript
axios.post('/api/email_verification', {
  email: 'usuario@example.com',
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

**Respuesta esperada**:

```json
{
  "message": "OTP de verificación enviado"
}
```

#### 18\. Verificar email con OTP

```javascript
fetch('/api/email_verification/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
    otp: '123456',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
```javascript
axios.post('/api/email_verification/verify', {
  email: 'usuario@example.com',
  otp: '123456',
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));`
```
**Respuesta esperada**:

```json
{
  "email": "usuario@example.com",
  "verify": true // o false si la verificación falla
}
```

#### 19\. Enviar OTP para restablecer contraseña

```javascript
fetch('/api/forgot_password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
```javascript
axios.post('/api/forgot_password', {
  email: 'usuario@example.com',
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```
**Respuesta esperada**:

```json
{
  "message": "OTP para restablecer contraseña enviado"
}
```

#### 20\. Restablecer contraseña

```javascript
fetch('/api/forgot_password/reset', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@example.com',
    newPassword: 'nuevaContraseña',
    confirmPassword: 'nuevaContraseña',
  }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```
```javascript
axios.post('/api/forgot_password/reset', {
  email: 'usuario@example.com',
  newPassword: 'nuevaContraseña',
  confirmPassword: 'nuevaContraseña',
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

**Respuesta esperada**:


```json 
{
  "email": "usuario@example.com",
  "reset": true
}
```