import { Injectable } from '@angular/core';

@Injectable()
export class PageTitleService {

    appTitle: string = "ServiceMonitor"
    pageTitle: string = "ServiceMonitor"

    constructor() { }

    getPageTitle() {
        return this.pageTitle;
    }

    setPageTitle(title: string) {
        this.pageTitle = title;
        document.title = this.pageTitle + ' · ' + this.appTitle;
    }

    removePageTitle() {
        this.pageTitle = this.appTitle;
        document.title = this.appTitle;
    }

}