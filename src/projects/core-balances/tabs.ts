import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface Tab {
    title: string;
    icon: string;
    active: boolean;
    data: any;
}

export class TabControl {
    tabs: Tab[];
    defaultTabs: Tab[];
    subject: BehaviorSubject<Tab[]>;

    constructor(defaultTab: Tab) {
        this.defaultTabs = [defaultTab];
        this.tabs = this.defaultTabs;
        this.subject = new BehaviorSubject(this.tabs);
    }

    public new(tab: Tab) {
        const tabs = [...this.tabs];
        const len = tabs.push(tab);
        this.tabs = tabs;
        this.activate(len - 1);
        this.subject.next(this.tabs);
    }

    public getTabs(): Observable<Tab[]> {
        return this.subject.asObservable();
    }

    public close(index) {
        if (!index) {
            return;
        }

        const tabs = [...this.tabs];
        tabs.splice(index, 1);

        this.tabs = tabs;

        this.activate(0);
        this.subject.next(this.tabs);
    }

    public activate(index: any): boolean {
        if (typeof index !== 'number') {
            index = this.tabs.findIndex(index);
        }
        if (index === -1) {
            return false;
        }

        let tabs = [...this.tabs];
        tabs = tabs.map((tab, i) => {
            return { ...tab, active: (i === index) };
        });
        this.tabs = tabs;
        this.subject.next(this.tabs);

        return true;
    }
}
