import { Routes } from '@angular/router';
import { ChildrenProfileComponent } from './components/pages/children-profile/children-profile.component';
import { HomeComponent } from './components/pages/home/home.component';
import { DonateComponent } from './components/pages/donate/donate.component';
import { ChildComponent } from './components/pages/child/child.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { MothersComponent } from './components/pages/mothers/mothers.component';
import { MotherProfileComponent } from './components/pages/mother-profile/mother-profile.component';
import { User } from './shared/models/user';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { UserComponent } from './components/pages/user/user.component';
import { authGuard } from './auth/guards/auth.guard';

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
    path: 'mother',
    component: MothersComponent,
    title: 'All Mother',
  },
  {
    path: 'children-page/:id',
    component: ChildrenProfileComponent,
    title: 'Children Profile',
  },
  {
    path: 'mother/:id',
    component: MotherProfileComponent,
    title: 'Mother Profile',
  },
  {
    path: 'user',
    component: UserComponent,
    title: 'All Users',
    canActivate: [authGuard],
  },
  {
    path: 'user/:id',
    component: UserProfileComponent,
    title: 'User Profile',
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
  {
    path: 'donate',
    component: DonateComponent,
    title: 'Donate Page',
  },
];
