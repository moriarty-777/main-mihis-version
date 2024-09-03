import { Routes } from '@angular/router';
import { ChildrenProfileComponent } from './components/pages/children-profile/children-profile.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DonateComponent } from './components/pages/donate/donate.component';
import { ChildComponent } from './components/pages/child/child.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { SignupComponent } from './components/pages/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page',
  },
  {
    path: 'child',
    component: ChildComponent,
    title: 'All Children',
  },
  {
    path: 'children-page/:id',
    component: ChildrenProfileComponent,
    title: 'Children Profile',
  },
  {
    path: 'donate',
    component: DonateComponent,
    title: 'Donate Page',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login to MIHIS',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Signup to MIHIS',
  },
];
