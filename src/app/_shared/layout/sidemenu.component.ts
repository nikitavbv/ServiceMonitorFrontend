import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PageTitleService } from '../../_services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout-side-menu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.less']
})
export class SideMenuComponent {

    constructor(public auth: AuthenticationService, private title: PageTitleService, private router: Router) {}

}