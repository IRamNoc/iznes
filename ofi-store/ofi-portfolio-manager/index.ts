import { combineReducers, Reducer } from 'redux';
import { PortfolioManagerList } from './portfolio-manage-list/model';
import { OfiPortfolioManagerListReducer } from './portfolio-manage-list/reducer';

export interface OfiPortfolioManagerState {
    portfolioManagerList: PortfolioManagerList;
}

export const OfiPortfolioMangerReducer: Reducer<OfiPortfolioManagerState> = combineReducers<OfiPortfolioManagerState>({
    portfolioManagerList: OfiPortfolioManagerListReducer,
});
