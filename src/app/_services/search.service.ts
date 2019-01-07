import { Injectable } from '@angular/core';

@Injectable()
export class SearchService {
    _searchQuery: string;
    searchListener: any;

    set searchQuery(v: string) {
        this._searchQuery = v;
        if (this.searchListener !== undefined) {
            this.searchListener(v);
        }
    }

    get searchQuery(): string {
        return this._searchQuery;
    }
}