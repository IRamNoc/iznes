export { name } from './__init__';
export { ManagedWalletsReducer } from './reducer';
export { ManagedWalletsState } from './model';
export { SET_MANAGED_WALLETS, SET_WALLET_ADDED, SET_WALLET_UPDATED, SET_WALLET_DELETED } from './actions';
export { getManagedWallets, getManageWalletList } from './selectors';
import * as managedWalletsActions from './actions';

export { managedWalletsActions };
