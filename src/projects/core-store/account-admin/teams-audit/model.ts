import { UserTeam } from '../teams';

export interface UserTeamsAuditState {
    teams: UserTeam[];
    requested: boolean;
}
