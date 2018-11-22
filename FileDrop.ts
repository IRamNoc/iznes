import { DropHandler } from './drophandler/drophandler.component';

export class FileDropItem {
    category?: string;
    fileHash?: string;
    fileID?: number;
    fileTitle?: string;
    id?: number;
    permissionID?: number;
    walletID?: number;
}

export enum FilePermission {
    Public = 0,
    Private = 1,
}

export interface File {
    data: string; // base64
    filePermission: FilePermission;
    id: number;
    lastModified: number; // timestamp
    name: string;
    status: 'uploaded-file'|null;
    mimeType: string;
}

export interface FileDropEvent {
    target: DropHandler;
    files: File[];
}

export interface ImageConstraint {
    width: number;
    height: number;
}

export type AllowFileType = 'application/pdf' | 'image/png' | 'image/jpeg';
