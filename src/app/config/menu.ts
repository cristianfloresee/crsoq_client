export const MENU = [
   {
      subject: 'Base de Datos',
      years: [
         {
            year: 2018,
            semesters: [
               {
                  semester: 1,
                  courses: [
                     {
                        name: 'A',
                        url: ''
                     }
                  ]
               }
            ]
         },
         {
            year: 2017,
            semesters: [
               {
                  semester: 1
               },
               {
                  semester: 2
               }
            ]
         }

      ]
   }
];

export const MENU_ADMIN = [
   { title: 'Usuarios', url: 'user', parent: '/admin/' },
   { title: 'Asignaturas', url: 'subject', parent: '/admin/' },
   { title: 'Calendario', url: 'calendar', parent: '/admin/' }
];


export const MENU_ADMIN2 = {
   home: '',
   menu: [
      { title: 'Usuarios', url: 'user', parent: '/admin/' },
      { title: 'Asignaturas', url: 'subject', parent: '/admin/' },
      { title: 'Calendario', url: 'calendar', parent: '/admin/' }
   ]
}
