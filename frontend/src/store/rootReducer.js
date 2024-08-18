import { combineReducers } from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import { authReducer } from './auth/auth.slice';
import storage from 'redux-persist/lib/storage';
import { walletReducer } from './wallet/wallet.slice';

const authPersistConfig = {
  key: "auth",
  storage,
};

const walletPersistConfig = {
  key: "wallet",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  wallet: persistReducer(walletPersistConfig, walletReducer),
});

export default rootReducer;
