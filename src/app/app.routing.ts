import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AddAgentComponent } from './addAgent';
import { ProjectsComponent } from './projects';
import { SetupComponent } from './setup';
import { LoginComponent } from './login';
import { MetricComponent } from './metric';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'setup', component: SetupComponent },

    { path: 'setup', component: SetupComponent },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },

    { path: 'add', component: AddAgentComponent, canActivate: [AuthGuard] },
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },

    { path: 'agent/:agentID/metric/:metricID', component: MetricComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
