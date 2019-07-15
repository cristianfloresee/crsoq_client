import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
   {
      path: '',
      loadChildren: './content/pages/pages.module#PagesModule',
      data: { breadcrumb: 'Inicio' }
   },
   {
      path: '**',
      redirectTo: 'error',
      pathMatch: 'full'
   }
];

@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [RouterModule]
})
export class AppRoutingModule { }
