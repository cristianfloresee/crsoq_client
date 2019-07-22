# Manejo de sesiones en tiempo real con socket.io

Actualmente las listas de usuarios que interactuan con el sistema en tiempo real se almacenan en variables dentro de la aplicación `express.js`.

# 1. Uso de variables

Variable                            | Descripción
------------------------------------|------------------------------
connected_users                     | Lista de usuarios conectados.
loggined_users                      | Lista de usuarios logueados (administradores, profesores y estudiantes).   
students_in_classrooms              | Lista de estudiantes dentro de una sesión de clase (útil para otros estudiantes).
student_participants_of_a_question  | Lista de estudiantes que desean participar por responder una pregunta de la clase (útil para el profesor).

---

**¿No es mejor filtrar `students_in_classrooms` para obtener los estudiantes que deseen participar y así eliminar la variable `student_participants_of_a_question`?**

*R: La variable `students_in_classrooms` almacena 5 estados posibles de un estudiante (en espera, no seleccionado, seleccionado, ganador y perdedor). Al profesor solo le interesa ver los estudiantes que deseen participar, por lo que en caso de usar la variable `students_in_classrooms`, esta debe ser filtrada para obtener solo los estudiantes que no han sido seleccionados (estado 1) y estos puedan ser comparados por el profesor. La idea es solo mostrar las estadísticas de los estudiantes que puedan ser escogidos para responder, y no a los que ya hallan respondido erróneamente o correctamente, ya que esto dificultaría el análisis de las estádisticas para el profesor.*

<img src="https://i.imgur.com/bj4XtZX.png">

Ejemplo del código de filtrado: 

```js
const participants = students_in_classrooms[id_class].filter(student => student.participation_status == 1);
```

---

## 1.1. Usuarios logueados

Estructura de la variable `loggined_users`:

```js
[
  {
    id_user: 1,
    id_socket: "uPkLyvLu2Rt59fUZAAAD",
    role: 1
  },
  {
    id_user: 1,
    id_socket: "SwLHxNkw3wgJ3nBEAAAH",
    role: 2
  },
  ...
]
```

## 1.2. Estados de una clase


### 1.2.1. Fuera de la Clase

+ Tanto el **profesor** como el **estudiante** mientras no entren a la clase verán uno de los 3 siguientes **estados de clase**.

 Valor     | Estado       | Descripción
-----------|--------------|------------------------------
 1 (2,3,4) | activa       | <ul><li>Los estudiantes pueden ingresar a la clase.</li><li>El profesor puede iniciar preguntas.</li></ul>  
 2 (1)     | no iniciada  | <ul><li>Los estudiantes no pueden ingresar a la clase.</li><li>El profesor...</li></ul>
 3 (5)     | terminada    | <ul><li>Los estudiantes no pueden ingresar a la clase.</li><li>El profesor...</li></ul>

+ Estos estados estarán almacenados en la **base de datos** bajo la entidad `class.status`.
+ En el cliente se utilizarán bajo la variable `class.status`.
+ Cada vez que el profesor inicie una clase se le notificará a todos los estudiantes pertenecientes al curso que esten conectados.
+ Cada vez que el profesor cambie el estado de una clase se le notificarán a los estudiantes que esten dentro de la sección de clases del curso, y estos deberán actualizar el listado de clases para reflejar los cambios.

<img src="https://i.imgur.com/tvKtHzi.png">

<img src="https://i.imgur.com/f37mYS5.png">


--- 

**¿Qué sucede si el profesor finaliza la clase y hay estudiantes dentro?**

*R: Por ahora nada, pero debiese indicarle al estudiante que la sesión finalizó. Además se podría mostrar un boton al estudiante para que vea todo lo que se hizo en esa clase. La solución sencilla es indicarle al estudiante que la sesión finalizó y cerrar la ventana en X segundos.*


**¿Cuándo el profesor finalize una clase también finalizará automáticamente la pregunta activa que tenga en esa clase?**

*R: Considerando el caso en que el profesor inicie una pregunta y esta no alcanze a concluir durante la clase, sería bueno que se pudiese mantener la pregunta activa para que se pueda continuar la próxima clase. También sería bueno poder cerrar la clase para que el estudiante no pueda reformular tanto su respuesta.*

**¿Los estudiantes no pueden visualizar el resumen de una clase finalizada (puntos obtenidos, participaciones, etc)?**

*R: Dentro de la misma clase, si esta finalizada se debiese mostrar el resumen de participación del estudiante.*

---

### 1.2.2. Dentro de la Clase

+ Existen 5 **estados de participación en una pregunta** que el **estudiante** puede ver mientras este dentro de ella.
+ El estado marcado se utiliza bajo la entidad `class_question.status` en la **base de datos**.
+ En el cliente se utiliza bajo la variable `current_question`.
+ En el fondo se esta interpretando el estado de la pregunta como el estado de participación en una pregunta.

<img src="https://i.imgur.com/t9CAEXY.png">

Estados de participación:

 Valor  | Estado                   | Descripción
--------|--------------------------|------------------------------
 null   | esperando pregunta       | El profesor no ha iniciado una pregunta. (propio de una pregunta)
 2      | pregunta iniciada        | El profesor esta esperando que estudiantes decidan participar por responder.
 3      | seleccionando estudiante | El profesor pausa la participación y comienza a seleccionar un estudiante.
 4      | estudiante respondiendo  | El estudiante fue seleccionado y debe responder a la clase.
 5      | sesión finalizada        | El profesor ha finalizado la sesión. Este estado vuelvo al estado `null` después de 5 segundos.

Estados de una pregunta: Como asi si class_question tiene solo 3 estados en la bd (1 no iniciado,2 detenida, 3 finalizado)
  Valor  | Estado                   | Descripción
--------|--------------------------|------------------------------
 1      | pregunta no iniciada     | El profesor no ha iniciado una pregunta. (propio de una pregunta)
 2      | pregunta iniciada        | El profesor esta esperando que estudiantes decidan participar por responder.
 3      | pregunta detenida        | El profesor pausa la participación y comienza a seleccionar un estudiante.
 4      | estudiante respondiendo  | El estudiante fue seleccionado y debe responder a la clase.
 5      | sesión finalizada        | El profesor ha finalizado la sesión. Este estado vuelvo al estado `null` después de 5 segundos.
---

Para el **profesor**:
+ Si la pregunta esta **no iniciada**, se debe ...mostrar los estudiantes que estan en la sala.?

+ Si la pregunta esta **iniciada**, se debe mostrar el listado de estudiantes que han decidido participar.
  
<img src="https://i.imgur.com/0WOKkrA.png">

+ Si la pregunta esta **finalizada**, entonces se debe mostrar un resumen de los participantes y ganadores.



---

+ El profesor una vez dentro de la clase puede ver el listado de preguntas vinculadas y sus correspondientes estados bajo la entidad `class_question.status` en la base de datos.

<img src="https://i.imgur.com/wASCxAp.png">

 Valor | Estado                   
-------|--------------------------
 1     | no iniciada       
 2     | activa       
 3     | detenida 
 4     | terminada  

 ---

## 1.3. Estudiantes que participan por responder

+ Variable orientada al **profesor**.
+ La propiedad `status` indica el estado de participación del estudiante (2: no seleccionado, 3: seleccionado, 4: perdedor, 5: ganador).

Estructura de la variable `student_participants_of_a_question`.
```js
{
  "<id_class>": [
     {
        id_user: 1,
        status: 2
     },
     {
        id_user: 1,
        status: 5
     },
     ...
  ],
  "<id_class>": [...]   
}  
```

---

**¿No es necesario que el profesor conozca el estado de los estudiantes? Por ejemplo si uno ya respondió y perdió.**

---

## 1.2. Estados de los participantes

+ Variable orientada a los estudiantes para que conozcan el estado de sus compañeros.
+ Se refiere al estado que tiene un estudiante que ya esta dentro de la sesión de clase, por lo cual nunca existirá el estado desconectado.

 Valor | Estado                             
-------|------------------------------------
 1     | en espera                    
 2     | no seleccionado
 3     | seleccionado   
 4     | perdedor                    
 5     | ganador                            
             
+ En el cliente son utilizados en el componente `play-questions2` bajo la variable `data_participants`.
+ Estos estados son almacenados en la variable `students_in_classrooms[id_class]` en el servidor.

Estructura de la variable `students_in_classrooms`:
```js
{
  "<id_class>": [
     {
        id_socket: "uPkLyvLu2Rt59fUZAAAD",
        id_user: 1,
        participation_status: 1,

     },
     {
        id_socket: "SwLHxNkw3wgJ3nBEAAAH",
        id_user: 1,
        participation_status: 5
     },
     ...
  ],
  "<id_class>": [...]   
}
```     

## 2.2. Estados de una Pregunta

Estado       | Descripción
-------------|------------------------------
iniciada     | Los estudiantes pueden participar.
detenida     | Los estudiantes no pueden elegir participar.
terminada    | Una vez finalizada, espera unos segundos y vuelve a mostrar la vista de `esperando pregunta`.


# 3. Prueba de Funcionamiento

A continuación se presentan las cuentas de prueba para poder ver y analizar el funcionamiento del sistema.

Email                   | Contraseña       | Rol
------------------------|------------------|-----------------
super@ruvi.com          | ruvi1234         | Administrador / Profesor / Estudiante
admin@ruvi.com          | ruvi1234         | Administrador  
teacher@ruvi.com        | ruvi1234         | Profesor
student@ruvi.com        | ruvi1234         | Estudiante

# 4. Recomendaciones por parte de la comunidad

+ `Redis` podría ser una buena opción. Comento una solución que me tocó implementar con una arquitecura de microservicios, primero creamos un array en memoria con los sockets, pero almacenamos un objeto por usuario con todos los sockets clientes abiertos por cada usuario en ese objeto, con eso bajamos el tamaño y manejamos la comunicación con sockets abiertos. Sin embargo los limites son evidentes y para escalar utilizamos `Redis`, aunque `mongodb` tranquilamente puede andar bien.

+ Lo que yo hago por cada nuevo usuario conectado es registrarlo en `mongodb`, es más fácil realizar las consultas. Luego, cuando se desconecte lo elimino de `mongodb`.

# Posibles solicitudes http

Posibles solicitudes http para confirmar que se realizó una modificación en la DB Redis.

`/enter_to_class` { id_class, user: { id_user, username, name, last_name, middle_name, profile_image } }
`/question_started` { id_class }
+ Estudiante ingresa a una clase para responder preguntas.
+ Devuelve una pregunta iniciada si es que hay.
```js
socket.emit('playingTheClassQuestion', {
   question: question
});
```

```js
if (data.question){
   // Si la pregunta finaliza la borro y ejecuto un timer
   if(data.question.status == 4){ 
      
   }
}
```

`/enter_to_question`
+ Profesor ingresa a ..
+ Devuelve la lista de estudiantes que han decidido participar por responder.
```js
socket.emit('aStudentHasEntered', {
   student_participants: student_participants_of_a_question[params.id_class],
   //students_in_classroom: students_in_classrooms[params.id_class]
   //student_selected: 
});
```

`/select_to_answer`
+ Profesor selecciona a un estudiante para responder una pregunta.
+ Devuelve los datos del estudiante.
```js
socket.emit('aStudentHasEntered', {
   student_selected: params.user
});
```

`/cancel_selected_to_answer`
+ Profesor cancela la selección de un estudiante para responder.
+ Devuelve el id_user del estudiante.
```js
socket.emit('aStudentHasEntered', {
   cancel_student_selected: params.user.id_user
});
```

# 4. Socket rooms

+ <id_class>play-question-section

**¿Cuando el estudiante sale de la sala deja de ser una participante?**
No, el estudiante debe permanecer en ese estado. Ya que al pausar la participación el estudiante podría cancelar su participación.
