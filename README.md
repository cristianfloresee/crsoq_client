## Versión CRSoq v.2
http://146.83.109.226:3000/

## Generación del Proyecto Angular

Ver advaned porlets para tener cards con acciones mas bonitas
Column Rendering para tener tablas con una columna que incluya foto nombre y los 2 apellidos del usuario
```
ng new client --routing  --style scss --prefix cw
```

## Instalación de Dependencias
```
npm install  @ng-bootstrap/ng-bootstrap moment lodash ngx-perfect-scrollbar @ngx-loading-bar/core @angular/material @angular/cdk @angular/animations hammerjs --save
```
npm install socket.io-client --save
npm install @types/socket.io-client --save-dev


Configurar ng-bootstrap:

https://www.youtube.com/watch?v=D68e2JiM0Fs
ng-boostrap también necesita el archivo de estilos css el cual deberá ser importado en angular-cli.json
Importar NgModule en app.module.ts:

```
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  ...
  imports: [NgbModule, ...],
  ...
})
export class YourAppModule {
}
```

Importar BrowserAnimationsModule al app.module-ts:


## Generación de modulos
Crear modulo que es parte del app.module

+ Modulos Content:

```
ng g module content/partials --module app
```

A continuación se generará un modulo con carga diferida:
```
ng g module content/pages --routing
```


+ Modulos Core:

```
ng g module core --module app
```
```
ng g module core/auth/authentication --module app
```

ng g directive core/directives/menu-horizontal-offcanvas --module core --spec=false

ng g pipe core/pipes/urlImage --spec=false
+ Sobre Lazy Load

En la definición de rutas de modulos de carga diferida, la ruta puede ser relativa o absoluta;
1) Puede usar un ruta relativa como:
```
./membros/membro.module#MembroModule
```
2) Ruta absoluta:
```
app/membros/membro.module#MembroModule
```
En esta última debe asegurarse de que src/tsconfig.json tenga lo siguiente:
```
{
  ...,
  "compilerOptions": {
    ...,
    baseUrl: "./"
  }
}
```

## 1.1 Creación del Modulo Page


## 1.1 Creación del Modulo Core

```
ng g component content/pages --module content/pages --spec=false -is
```


## 1.1 Creación del Modulo Layout

```
ng g module content/layout --module app
ng g component content/layout/header --spec=false
ng g component content/layout/footer --spec=false -is
ng g component content/layout/subheader --spec=false
ng g component content/layout/aside --spec=false
```
### 1.1.1 Componentes del Header

```
ng g component content/layout/header/brand --module content/layout --spec=false -is
ng g component content/layout/header/menu-horizontal --module content/layout --spec=false -is
ng g component content/layout/header/topbar --module content/layout --spec=false -is
```

#### 1.1.1.1 Componentes del Header > Topbar
```
ng g component content/layout/header/topbar/user-profile --spec=false -is
ng g component content/layout/header/topbar/user-role --spec=false -is
ng g component content/layout/header/topbar/quick-action --spec=false -is
ng g component content/layout/header/topbar/search-dropdown --spec=false -is
ng g component content/layout/header/topbar/notification --spec=false

```

##  1.2 Creación del Modulo Authentication
ng g module content/pages/auth --spec false
ng g component content/pages/auth -is --spec=false
ng g component content/pages/auth/login --spec=false
ng g component content/pages/auth/auth-notice --spec=false
ng g component content/pages/auth/forgot-password --spec=false
ng g component content/pages/auth/register --spec=false



## 1.3 Creación del Modulo Dashboard
ng g module content/pages/dashboard --spec=false
ng g component content/pages/dashboard -is --spec=false

## Creación Modulo Admin

ng g module content/pages/admin --spec false
ng g component content/pages/admin -is --spec=false


ng g component content/pages/admin/calendar --spec false
ng g component content/pages/admin/calendar/create-calendar --spec false
ng g component content/pages/admin/calendar/edit-calendar --spec false

ng g component content/pages/admin/subject --spec false
ng g component content/pages/admin/subject/edit-subject --spec false
ng g component content/pages/admin/subject/create-subject --spec false


ng g component content/pages/admin/user --spec false
ng g component content/pages/admin/user/edit-user --spec false
ng g component content/pages/admin/user/create-user --spec false


## Creación Modulo Estudiante
ng g module content/pages/student --spec false
ng g component content/pages/student -is --spec=false

## Creación Modulo Profesor
ng g module content/pages/teacher --spec false
ng g component content/pages/teacher -is --spec=false

ng g component content/pages/teacher/modals/create-course --spec false
ng g component content/pages/teacher/modals/create-question --spec false
ng g component content/pages/teacher/modals/create-category --spec false
ng g component content/pages/teacher/modals/create-subcategory --spec false

ng g c content/pages/teacher/courses/config/general --spec false

## Instalar Componentes de Pages

```
ng g c pages/main --flat --spec=false
```
--flat: genera el componente en pages pero los archivos quedan sueltos.
--spec=false: no crea el archivo spec

## Instalar Componentes de Pages > Header

```
ng g component content/pages/header/action --module content/pages --spec=false -is
ng g component content/pages/header/profile --module content/pages --spec=false -is
```


Creación de Guards
ng g guard core/services/guards/login --spec false
ng g guard core/services/guards/admin --spec false





Crear Servicio
```
ng g s services/miservicio --spec=false
```

## Generación de Web Components


## Importar assets del proyecto
apps: 
+ media\img: estan las imágenes

demo: 
+ default\base: tiene estilos style.bundle.css y style.bundle.rtl.css, tiene un js scrpt.bundle
+ default\base\style.bundle.css: utilizado actualmente por el template. Da estilos de bootstrap
+ default\base\scripts.bundle.js: utilizado actualmente por el template.


Copiar en carpeta de imagenes
src\assets\app\media\img
en src\assets\images


## Levantar el Cliente

```
ng serve --port 4201 -o
```

## Angular en Producción

Instalar dependencia que permite levantar servidor desde terminal:

```
npm install -g http-server
```

Correr la app en producción:

```
http-server dist
```


# Iconos

## Material Icons
Agregar la fuente al index.html
```
<link href="https://fonts/googleapis.com/icon?familyMaterial+Icons" rel="stylesheet">
```
## Font Awesome 5

https://github.com/FortAwesome/angular-fontawesome
https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers

npm install --save-dev @fortawesome/fontawesome-free


## vendor.bundle.js

Incluye:
+ SweetAlert2 (https://github.com/sweetalert2/sweetalert2/)
+ Chart.js?
+ Bootstrap.js??
+ Lodash??
+ Moment


## Por hacer:

+ Reemplazar sweetalert2 por ngx-sweetalert2 (https://github.com/sweetalert2/ngx-sweetalert2)
  Con la versión ngx puedo ajustar opciones globales de estilo y aliviano el component.ts



## Formateador en dd/MM/yyyy
// Formatter using "dd-MM-yyyy" string format:
class NgbDateStringParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (!value) { return null; }

    const parts = value.trim().split('-');
    
    return {
      day: parts.length > 0 ? parseInt(parts[0], 10) : null,
      month: parts.length > 1 ? parseInt(parts[1], 10) : null,
      year: parts.length > 2 ? parseInt(parts[2], 10) : null,
    };
  }

  format(date: NgbDateStruct): string {
    const pad = (n) => Number.isInteger(n) ? ('0' + n).substr(-2) : '';
    return date ? `${pad(date.day)}-${pad(date.month)}-${date.year}` : '';
  }
}

https://gist.github.com/nrobinaubertin/61ff1c3db355c74f4e56f485b566ab22


### Guards

Guard           | Descripción       
----------------|--------------------------------
LoginGuard      | Verifica que halla un token sin expirar. Si no hay uno reedirecciona al login. 
IsLoggedInGuard | Verifica que halla un token sin expirar. Si hay uno reedirecciona al dashboard.       
AdminGuard      | Verifica que exista el rol de administrador (rol 1).
TeacherGuard    | Verifica que exista el rol de profesor (rol 2).
StudentGuard    | Verifica que exista el rol de estudiante (rol 3).

Si no hay sesión iniciada:

`/admin`: Ejecuta `AdminGuard`, no ejecuta `LoginGuard`.
`/teacher`: Ejecuta `TeacherGuard`, no ejecuta `LoginGuard`.
`/student`: Ejecuta `StudentGuard`, no ejecuta `LoginGuard`.
`/`: Ejecuta `AdminGuard`, no ejecuta `LogiGuard`.

**¿Qué sucede si me voy a `/student` teniendo solo rol de profesor?**
Reedirijo a pantalla de error...

Si hay sesión iniciada:

`/admin`: Ejecuta `AdminGuard`, luego `LoginGuard`.
`/login`: Ejecuta `IsLoggedInGuard`.

### Servicios

SessionService
RoleService

### Refresh Tokens
Abro la app.
Teniendo la sesión iniciada, en el cliente recupero el token del localstorage.
Envío el token al servidor, allí compruebo que el token sea válido y si esta apunto de expirar genero otro.

debe implementarse en el servidor algún sistema que permita invalidar un refresh token
establecer un tiempo de vida más largo que el de los access tokens.

En la respuesta del login retornaremos tanto el token JWT como el refresh token con el que podrá solicitar nuevos tokens de acceso. 

Para el refresh token, simplemente generaremos un UID y lo almacenaremos en un objeto en memoria junto con el username del usuario asociado. Lo normal sería guardarlo en una base de datos `Redis` con la información del usuario y la fecha de creación y de expiración (si es que queremos que tenga un tiempo limitado de validez).
