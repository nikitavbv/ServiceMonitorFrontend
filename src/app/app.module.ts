import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { AuthGuard } from './_guards';
import { JwtInterceptor } from './_helpers';
import { AuthenticationService, PageTitleService, UserDataService } from './_services';

import { SideMenuComponent } from './_shared';

import { HomeComponent } from './home';
import { SetupComponent } from './setup';
import { LoginComponent } from './login';

if (environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,

    HomeComponent,
    SetupComponent,
    LoginComponent,
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
    AuthenticationService,
    UserDataService,
    PageTitleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
