import {InjectionToken} from '@angular/core';
import {AppConfig} from './appConfig.model';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');
