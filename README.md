# Proyecto de Backend Web API para futura webapp para "Búsqueda de Trabajo"

Este proyecto es una Web API desarrollada con Express y Node.js para la
gestión de solicitudes y postulaciones de trabajo. Es una herramienta de
búsqueda de trabajo que permite la interacción entre clientes y
trabajadores. Este proyecto fue desarrollado como parte del trabajo
práctico de la materia Prácticas Profesionalizantes 3 en el Instituto
San Roque González de Posadas, Misiones, Argentina.

## Funcionalidades implementadas hasta el momento

### **Registro de Usuarios:** 
Los usuarios pueden registrarse y autenticarse en la plataforma.
### **Tipos de Usuarios:**
- **Clientes:** Pueden publicar solicitudes de trabajo.
- **Trabajadores:** Pueden postularse a las solicitudes de trabajo y esperar a ser aceptados.
- **Administrador:** Gestiona y supervisa la plataforma.
### **Publicación de Solicitudes:** 
Los clientes pueden crear y publicar solicitudes de trabajo.
### **Postulación a Solicitudes:** 
Los trabajadores pueden ver las solicitudes publicadas y postularse a ellas.

## Tecnologías Utilizadas

 - **Node.js:** Entorno de ejecución para JavaScript en el servidor.
 - **Express:** Framework web para Node.js.
 - **MongoDB:** Base de datos NoSQL para el almacenamiento de datos.
 - **JWT (JSON Web Tokens):** Para la autenticación y autorización de usuarios.
 - **Mongoose:** ODM (Object Data Modeling) para MongoDB y Node.js.
 - **BCrypt:** Para el hash de contraseñas.
 - **Dotenv:** Para la gestión de variables de entorno.
 - **Cors:** Middleware para habilitar CORS (Cross-Origin Resource Sharing).
 - **Nodemailer:** Para el envío de correos electrónicos.
 - **Nodemon:** Herramienta que ayuda a desarrollar aplicaciones basadas en Node.js reiniciando automáticamente la aplicación cuando se detectan cambios.

## Instalación

1.  Clona el repositorio:
    `git clone https://github.com/german691/worklink_backend.git`

2.  Navega al directorio del proyecto:
    `cd worklink_backend`

3.  Instala las dependencias:
    `npm install`

4.  Configura las variables de entorno en un archivo `.env`:
    ```env
    MONGODB_URI=(Tu conexión a MongoDB)
    PORT=3000
    TOKEN_KEY=SHA256 BASE64
    TOKEN_EXPIRY=24h
    CRYPT_KEY=SHA256 BASE64
    ADMIN_KEY=SHA256 BASE64
    AUTH_EMAIL=(Tu email de contacto)
    AUTH_PASSWORD=SHA256 HEX
    

6.  Inicia el servidor:
    `npm run dev`

## Uso

### Registro de Usuario

- **Endpoint:** `POST /api/v1/user/signup`
- **Body:**
  ```json
  { "username": "example", "email": "example@domain.abc", "password": "Example1$", "userType": "worker or client", "name": "example", "surname": "example", "birthdate": "1985-04-12T09:20:00Z" }

### Autenticación de Usuario:

- **Endpoint:** POST `/api/v1/user`
- **Body:**
  ```json
  { "username": "example", "password": "example" }
  { "email": "example@domain.abc", "password": "example" }
- x-access-token requerido para cualquier acción en ruta "auth"
  
## Rutas públicas

### Ver Status:
**Endpoint:** `GET /api/v1/status`

### Verificar Email:
**Endpoint:** `POST /api/v1/email_verification/verify`
- **Body:**
  ```json
  { "otp": "123456", "email": "example@domain.abc" }


### Resetear contraseña:
**Endpoint:** `POST /api/v1/forgot_password`
- **Body:**
  ```json
  { "email": "example@domain.abc" }

### Verificar cambio de contraseña:
**Endpoint:** `POST /api/v1/forgot_password/verify`
- **Body:**
  ```json
  { "otp": "123456", "email": "example@domain.abc" }
  
## Cliente:

### Listar Solicitudes de Trabajo:
- **Endpoint:** `GET /api/v1/jobs`

### Publicar Solicitud de Trabajo:
- **Endpoint:** `POST /api/v1/jobs`
- **Body:**
  ```json
  { "title": "example", "description": "example", "category": "example" }
  
- Se deben primero crear las categorías desde los enpoints de administrador

### Dar de baja Solicitud de Trabajo:
- **Endpoint:** `DELETE /api/v1/jobs`
- **Body:**
  ```json
  { "jobId": "encrypted string" }

### Editar Solicitud de Trabajo:
- **Endpoint:** `PUT /api/v1/jobs`
- **Body:**
  ```json
  { "jobId": "encrypted string", "title": "example title", "description": "example title description" }

### Fijar trabajador final en Solicitud de Trabajo:
- **Endpoint: `POST /api/v1/jobs/start`
- **Body:**
  ```json
  { "userId": "encrypted string", "jobId": "encrypted string" }    

### Marcar Solicitud de Trabajo como Finalizado:
- **Endpoint:** `POST /api/v1/jobs/finish`
- **Body:**
  ```json
  { "jobId": "encrypted string" }

## Trabajador:

### Aplicar a Solicitud de Trabajo:
- **Endpoint:** `POST /api/v1/jobs/apply`
- **Body:**
  ```json
  { "jobId": "encrypted string" }

### Abandonar Solicitud de Trabajo:
- **Endpoint:** `POST /api/v1/jobs/leave`
- **Body:**
  ```json
  { "jobId": "encrypted string" }

Contribuciones
--------------

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que quieras hacer.
A futuro se nombrarán agradecimientos a los diferentes colaboradores de la institución.

Licencia
--------

Este carece de licencia, es para fines meramente educativos.

## Autor: Delgado Pablo German
