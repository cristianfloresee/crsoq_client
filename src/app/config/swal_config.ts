// Opciones Swal al realizar una confirmación
export const SWAL_QUESTION = {
   title: '¿Está seguro?',
   type: 'warning',
   showCancelButton: true,
   focusCancel: true,
   reverseButtons: true
};

// Opciones Swal al eliminar un registro
export const SWAL_DELETE = {
   confirmButtonText: 'Si, eliminar',
}

// Opciones Swal al ser realizada una acción con éxito
export const SWAL_SUCCESS = {
   title: 'Acción realizada!',
   type: 'success',
   confirmButtonText: 'Aceptar'
};

// Opciones swal de confirmación antes de eliminar un registro
export const SWAL_DELETE_ACTIVITY = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la actividad?' });
export const SWAL_DELETE_LESSON = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la clase?' });
export const SWAL_DELETE_LESSON_QUESTION = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea desvincular esta pregunta de la clase?' });
export const SWAL_DELETE_MODULE = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar el modulo?' });
export const SWAL_DELETE_STUDENT = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar a este estudiante del curso?' });
export const SWAL_DELETE_CALENDAR = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar el período?' });
export const SWAL_DELETE_USER = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar el usuario?' });
export const SWAL_DELETE_SUBJECT = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la asignatura?' });
export const SWAL_DELETE_QUESTION = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la pregunta?' });
export const SWAL_DELETE_CATEGORY = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la categoría?' });
export const SWAL_DELETE_SUBCATEGORY = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la subcategoría?' });
export const SWAL_DELETE_ENROLLMENT = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar la inscripción?' });
export const SWAL_DELETE_COURSE = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea eliminar el curso?' });
export const SWAL_DELETE_PARTICIPATION = Object.assign({}, SWAL_QUESTION, SWAL_DELETE, { text: '¿seguro desea reiniciar la participación y eliminar sus correspondientes datos?' });

// Opciones swal al completarse la eliminación
export const SWAL_SUCCESS_DELETE_ACTIVITY = Object.assign({}, SWAL_SUCCESS, { text: 'La actividad ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_LESSON = Object.assign({}, SWAL_SUCCESS, { text: 'La clase ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_LESSON_QUESTION = Object.assign({}, SWAL_SUCCESS, { text: 'La pregunta ha sido eliminada de este curso' });
export const SWAL_SUCCESS_DELETE_MODULE = Object.assign({}, SWAL_SUCCESS, { text: 'El modulo ha sido eliminado' });
export const SWAL_SUCCESS_DELETE_STUDENT = Object.assign({}, SWAL_SUCCESS, { text: 'El estudiante ha sido eliminado' });
export const SWAL_SUCCESS_DELETE_CALENDAR = Object.assign({}, SWAL_SUCCESS, { text: 'El período ha sido eliminado' });
export const SWAL_SUCCESS_DELETE_USER = Object.assign({}, SWAL_SUCCESS, { text: 'El usuario ha sido eliminado' });
export const SWAL_SUCCESS_DELETE_SUBJECT = Object.assign({}, SWAL_SUCCESS, { text: 'La asignatura ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_QUESTION = Object.assign({}, SWAL_SUCCESS, { text: 'La pregunta ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_COURSE = Object.assign({}, SWAL_SUCCESS, { text: 'El curso ha sido eliminado' });
export const SWAL_SUCCESS_DELETE_CATEGORY = Object.assign({}, SWAL_SUCCESS, { text: 'La categoría ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_SUBCATEGORY = Object.assign({}, SWAL_SUCCESS, { text: 'La subcategoría ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_ENROLLMENT = Object.assign({}, SWAL_SUCCESS, { text: 'La inscripción ha sido eliminada' });
export const SWAL_SUCCESS_DELETE_PARTICIPATION = Object.assign({}, SWAL_SUCCESS, { text: 'La participación ha sido reiniciada' });

// Mensajes de actualización de un registro
export const DELETED_CLASS = 'Clase actualizada!';
export const DELETED_CLASS2 =  'La clase ha sido actualizada';
