import { Component, OnInit } from '@angular/core';

import { PageTitleService, UserDataService } from '../_services';

@Component({templateUrl: 'setup.component.html', styleUrls: ['setup.component.less']})
export class SetupComponent implements OnInit {

    constructor(private pageTitle: PageTitleService, private userData: UserDataService) {}

    ngOnInit() {
        this.pageTitle.setPageTitle('Setup');
    }

}