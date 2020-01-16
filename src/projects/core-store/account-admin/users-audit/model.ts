import { User } from '../users';

export interface UsersAuditState {
    users: User[];
    requested: boolean;
}
