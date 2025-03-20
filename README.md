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
