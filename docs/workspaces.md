# Gestión de Workspaces

Gestión de los workspaces o espacios de trabajo para una asignatura por parte del profesor.

# Creando un workspace

Si el profesor crea un workspace (tabla `user_subject`), se crea una categoría y subcategoría `DEFAULT`.
El nombre de la categoría y subcategoría por defecto se configura en el diseño de la tabla `user_subject`.

## ¿Qué tal si no se crea la categoría y subcategoría por defecto?

Existirían registros de preguntas con `id_subcategory = NULL` y `id_category = NULL`.


# Eliminando un workspace

## Opción 1

Si el profesor elimina un workspace estaría eliminando un conjunto de elementos vinculados al mismo.

```
|-- user_subject (workspaces)
   |-- categories
      |-- subcategories
         |-- questions
            |-- question_class (preguntas hechas en clases)
               |-- user_question_class (participación en pregunta)
   |-- courses
      |-- modules
         |-- classes
            |-- question_class (preguntas hechas en clases)
               |-- user_question_class (participación en pregunta)
            |-- activities
               |-- activity_student (participación en actividad)
```

Para ello es necesario solicitar una confirmación advirtiendo lo anterior y diseñar tablas de la base de datos que permitan realizar la eliminación de los registros en cadena con la opción `ON DELETE CASCADE`, de lo contrario el profesor debería eliminar manualmente cada uno de los registros vinculados considerando que estos pueden ser bastantes.

## Opción 2

Si el profesor intenta eliminar workspaces este debe asegurarse que no tengan registros vinculados a los mismos, de lo contrario no se podrán eliminar y serán notificados.

Con esta opción surge el problema de que se crean por defecto una categoría y subcategoría para el workspace y esto no permite que se elimine un workspace recien creado si las tablas de la base de datos estan diseñadas con la opción `ON DELETE RESTRICT`.

Una solución a lo anterior es realizar una verificación de que no existan categorías diferentes a la `DEFAULT` y no existan cursos para cada uno de los workspaces.
