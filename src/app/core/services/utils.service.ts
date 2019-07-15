import { Injectable, } from '@angular/core';

@Injectable()
export class utilService {

   formatR(workspaces, courses) {

      let group_of_courses = this.groupCoursesBySubjectAndYear(courses);

      return workspaces.map(workspace => {
         let group = [];
         // Busca grupos de cursos para el 'workspace' actual
         let index_found = group_of_courses.findIndex(group => group.id_subject == workspace.id_subject);
         // Si encuentra un grupo de cursos lo extrae
         if (index_found >= 0) {
            let temp = group_of_courses.splice(index_found, 1);
            if (temp[0].years) group = temp[0].years;
         }
         return { id_subject: workspace.id_subject, subject: workspace.name, years: group }
      });
   }


   // Agrupa los cursos por asignatura y año
   private groupCoursesBySubjectAndYear(menu) {

      console.log("kika0: ", menu);
      let new_data = menu.reduce((object, item) => {
         object[item.id_subject] = object[item.id_subject] || [];
         object[item.id_subject].push(item);
         return object;
      }, {});

      console.log("kika1: ", new_data);
      new_data = Object.keys(new_data).map(key => {
         console.log("kiko: ", key);
         console.log("kike: ", new_data[key]);

         let years = this.groupCoursesByYears(new_data[key]);
         console.log("years: ", years);
         return { id_subject: key, subject: new_data[key][0].subject, years: years }
      })
      return new_data;
   }

   // Agrupa los cursos por año
   groupCoursesByYears(data) {
      let round1 = JSON.parse(JSON.stringify(data));
      round1 = round1.reduce((object, item) => {
         object[item.year] = object[item.year] || [];
         object[item.year].push(item);
         return object;
      }, {});

      let round2 = Object.keys(round1).map(key => {
         let semesters = this.groupCoursesBySemesters(round1[key]);
         return { year: key, semesters: semesters }
      })
      return round2;
   }

   // Agrupa las asignaturas por semestre
   private groupCoursesBySemesters(data) {
      let round1 = JSON.parse(JSON.stringify(data));
      round1 = round1.reduce((object, item) => {
         object[item.semester] = object[item.semester] || [];
         object[item.semester].push(item);
         return object;
      }, {});

      let round2 = Object.keys(round1).map(key => {
         return { semester: key, courses: round1[key] }
      })
      return round2;
   }


   //////////////////////////////////////
   groupCoursesStudent(data) {
      let round1 = JSON.parse(JSON.stringify(data));
      round1 = round1.reduce((object, item) => {
         object[item.year] = object[item.year] || [];
         object[item.year].push(item);
         return object;
      }, {});

      let round2 = Object.keys(round1).map(key => {
         let semesters = this.groupCoursesBySemesters(round1[key]);
         return { year: key, semesters: semesters }
      })
      return round2;
   }
}
