// Opciones toastr al ser realizada una acción con éxito
export const TOAST_SUCCESS = { title: 'Acción realizada!' };

// Opciones toastr al ocurrir un error mientrás se realizaba una acción
export const TOAST_ERROR = { title: 'Ha ocurrido un error' };

// Opciones toastr al completarse una acción
export const TOAST_SUCCESS_CREATE_QUESTION = Object.assign({}, TOAST_SUCCESS, { message: 'La pregunta ha sido creada correctamente.' });
export const TOAST_SUCCESS_UPDATE_QUESTION = Object.assign({}, TOAST_SUCCESS, { message: 'La pregunta ha sido actualizada correctamente.' });
export const TOAST_SUCCESS_DELETE_QUESTION = Object.assign({}, TOAST_SUCCESS, { message: 'La pregunta ha sido eliminada correctamente.' });

// Opciones toastr de los workspaces
export const TOAST_SUCCESS_UPDATE_WORKSPACES = Object.assign({}, TOAST_SUCCESS, { message: 'Los workspaces se han actualizado correctamente.' });
export const TOAST_ERROR_UPDATE_WORKSPACES = Object.assign({}, TOAST_ERROR, { message: 'Los workspaces no han podido ser actualizados.' });

// Opciones toastr de las preguntas de la clase
export const TOAST_SUCCESS_UPDATE_QUESTIONS = Object.assign({}, TOAST_SUCCESS, { message: 'Las preguntas se han actualizado correctamente.' });
export const TOAST_ERROR_UPDATE_QUESTIONS = Object.assign({}, TOAST_ERROR, { message: 'Las preguntas no se han podido ser actualizadas.' });

export const TOAST_SUCCESS_UPDATE_WINNERS = Object.assign({}, TOAST_SUCCESS, { message: 'La participación se ha actualizado correctamente.' });
export const TOAST_ERROR_UPDATE_WINNERS = Object.assign({}, TOAST_ERROR, { message: 'La participación no ha podido ser actualizada.' });

// Opciones toastr de las subcategorías
export const TOAST_SUCCESS_CREATE_SUBCATEGORY = Object.assign({}, TOAST_SUCCESS, { message: 'La subcategoría ha sido creada correctamente.' });
export const TOAST_ERROR_CREATE_SUBCATEGORY = Object.assign({}, TOAST_ERROR, { message: 'La subcategoría no ha podido ser creada.' });

export const TOAST_ERROR_DELETE_QUESTIONS =  Object.assign({}, TOAST_ERROR, { message: 'La Pregunta esta siendo utilizada.' });
export const TOAST_ERROR_DELETE_COURSES =  Object.assign({}, TOAST_ERROR, { message: 'El curso esta siendo utilizado.' });
export const TOAST_ERROR_DELETE_CATEGORIES =  Object.assign({}, TOAST_ERROR, { message: 'La categoría esta siendo utilizada.' });
export const TOAST_ERROR_DELETE_SUBCATEGORIES =  Object.assign({}, TOAST_ERROR, { message: 'La subcategoría esta siendo utilizada.' });
