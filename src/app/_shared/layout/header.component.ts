import { Component, OnInit } from '@angular/core';
import { AuthenticationService, PageTitleService, SearchService } from '../../_services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less']
})
export class HeaderComponent {

    constructor(
        public auth: AuthenticationService, 
        private title: PageTitleService, 
        private router: Router,
        private searchService: SearchService
    ) {}

}
