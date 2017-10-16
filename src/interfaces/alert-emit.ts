import {AlertType} from './alert-type';
import {AlertSettings} from './alert-settings';

export interface AlertEmit {
    close?: boolean;
    message?: string;
    type?: AlertType;
    override?: AlertSettings;
}

export interface UpdateEmit {
    type?: AlertType;
    message: string;
}
