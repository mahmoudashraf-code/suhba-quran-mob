import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: "login",
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'quran',
    loadChildren: () => import('./quran/quran.module').then(m => m.QuranModule),
  },
  {
    path: 'supervisor',
    loadChildren: () => import('./supervisor/supervisor.module').then(m => m.SupervisorPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'examer',
    loadChildren: () => import('./examer/examer.module').then( m => m.ExamerPageModule),
    canActivate: [AuthGuard]
  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
