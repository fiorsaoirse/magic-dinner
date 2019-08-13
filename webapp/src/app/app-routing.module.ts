import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { RandomComponent } from './components/random/random.component';
import { AboutComponent } from './components/about/about.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'random',
    component: RandomComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'error/:errorCode',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: 'error/3',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
