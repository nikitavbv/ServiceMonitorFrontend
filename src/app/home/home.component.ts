import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PageTitleService, UserDataService } from '../_services';

@Component({templateUrl: 'home.component.html', styleUrls: ['home.component.less']})
export class HomeComponent implements OnInit {

    constructor(private pageTitle: PageTitleService, private userData: UserDataService) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Home');
    }

}