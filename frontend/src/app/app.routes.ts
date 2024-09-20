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
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { roleGuard } from './auth/guards/role.guard';
import { AdminLogsComponent } from './components/pages/admin-logs/admin-logs.component';
import { ScheduleWorkerComponent } from './components/pages/schedule-worker/schedule-worker.component';
import { AnalyticsComponent } from './components/pages/analytics/analytics.component';
import { RolePendingComponent } from './components/partials/role-pending/role-pending.component';

export const routes: Routes = [
  // Routes for Anonymous User
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page',
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
  {
    path: 'role-pending',
    component: RolePendingComponent,
    title: 'Donate Page',
  },

  // Routes for Normal User
  {
    path: 'child',
    component: ChildComponent,
    title: 'All Children',
    canActivate: [authGuard],
  },
  {
    path: 'mother',
    component: MothersComponent,
    title: 'All Mother',
    canActivate: [authGuard],
  },
  {
    path: 'children-page/:id',
    component: ChildrenProfileComponent,
    title: 'Children Profile',
    canActivate: [authGuard],
  },
  {
    path: 'mother/:id',
    component: MotherProfileComponent,
    title: 'Mother Profile',
    canActivate: [authGuard],
  },
  {
    path: 'user/:id',
    component: UserProfileComponent,
    title: 'User Profile',
    canActivate: [authGuard],
  },

  // Routes for Admin
  {
    path: 'user',
    component: UserComponent,
    title: 'All Users',
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard Page',
    children: [
      {
        path: 'audit-trail',
        component: AdminLogsComponent,
      },
      {
        path: 'healthworker-schedule',
        component: ScheduleWorkerComponent,
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
      },
    ],
    canActivate: [authGuard, roleGuard],
  },
];
