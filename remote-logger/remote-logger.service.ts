import {Injectable} from "@angular/core";
import {MemberSocketService} from "@setl/websocket-service/member-socket.service";
import {createMemberNodeRequest} from "@setl/utils/common";
import {NavigationEnd, Router} from "@angular/router";
import {getBrowserName} from "../../utils/helper/common/get-browser-name";
import {HttpClient} from "@angular/common/http";
import {select} from "@angular-redux/store";
import {filter} from "rxjs/operators";

export type LogType = 'error'|'warn'|'info'|'verbose'|'debug';

@Injectable()
export class RemoteLoggerService {

    @select(['user', 'myDetail', 'userId']) userId$;

    private userId: number = 0;

    constructor(
        private memberSocketService: MemberSocketService,
        private router: Router,
        private http: HttpClient
    ) {
       this.userId$.subscribe(v => this.userId = v);
       this.router.events.pipe(filter(v => v instanceof NavigationEnd)).subscribe(() => this.log('info', 'user activity'));
    }

    async log(type: LogType, message: string) {
        const browser = getBrowserName();
        const appVersion = await this.getAppVersion();
        const url = this.router.url;
        const id = this.userId;

        const messageBody = {
            RequestName: 'externallog',
            logData: {
                type,
                message,
                id,
                browser,
                appVersion,
                url
            },
        };

        return createMemberNodeRequest(this.memberSocketService, messageBody);
    }

    getAppVersion() {
        return new Promise((resolve)=> {
            this.http.get('/VERSION').subscribe(v => {
               resolve(v);
            }, () => {
               resolve('unknown');
            });
        });
    }
}
