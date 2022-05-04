import {
  Action,
  applyMiddleware, combineReducers, configureStore, ThunkAction
} from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { derivationAddressesSlice, derivationPathSlice } from './derivation';
import { mnemonicSlice } from './mnemonic';
import { multiSigSlice } from './multisig';

const isDev = process.env.STAGE === 'dev';

const rootReducer = combineReducers({
  mnemonic: mnemonicSlice.reducer,
  derivationPath: derivationPathSlice.reducer,
  derivationAddress: derivationAddressesSlice.reducer,
  multiSig: multiSigSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: isDev,
  enhancers: isDev ? [applyMiddleware(logger)] : [],
});

export const storeActions = {
  setAccount: derivationPathSlice.actions.setAccount,
  setChange: derivationPathSlice.actions.setChange,
  resetDerivedAddress: derivationAddressesSlice.actions.resetDerivedAddress,
  setM: multiSigSlice.actions.setM,
  setN: multiSigSlice.actions.setN,
  setPublicKey: multiSigSlice.actions.setPublicKey,
};

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

