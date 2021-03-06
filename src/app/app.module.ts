import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import {
  AgentService,
  AuthenticationService,
  MetricService,
  PageTitleService,
  ProjectService,
  UserDataService,
  SearchService,
  AlertService,
} from './_services';

import { HeaderComponent } from './_shared';

import { AgentComponent } from './agent';
import { HomeComponent } from './home';
import { AddAgentComponent } from './addAgent';
import { ProjectsComponent } from './projects';
import { SettingsComponent } from './settings';
import { SetupComponent } from './setup';
import { LoginComponent } from './login';
import { MetricComponent } from './metric';
import { AlertComponent } from './alert';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AgentComponent,
    AppComponent,
    HeaderComponent,

    HomeComponent,
    AddAgentComponent,
    ProjectsComponent,
    SettingsComponent,
    SetupComponent,
    LoginComponent,
    MetricComponent,
    SetupComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
  ],
  providers: [
    AuthGuard,
    AgentService,
    AuthenticationService,
    UserDataService,
    MetricService,
    PageTitleService,
    ProjectService,
    SearchService,
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
