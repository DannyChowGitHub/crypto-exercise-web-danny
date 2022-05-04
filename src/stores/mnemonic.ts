import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as blockchainAPI from '../clients/blockchain-api';

import { IMnemonicBody, IMnemonicResp } from '../interfaces/bip-api';

export const calcMnemonic = createAsyncThunk(
  'mnemonic/infos',
  async (params: IMnemonicBody) => {
    const resp = await blockchainAPI.calcMnemonic(params);
    return resp;
  }
);

export const mnemonicSlice = createSlice({
  name: 'mnemonicInfos',
  initialState: {
    lang: 'english',
    numOfWords: 12,
    password: '',
  } as IMnemonicBody & IMnemonicResp,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(calcMnemonic.fulfilled, (state, action) => {
      state.numOfWords = action.meta.arg.numOfWords;
      state.password = action.meta.arg.password;
      state.rootKey = action.payload.rootKey;
      state.seed = action.payload.seed;
      state.words = action.payload.words;
    });
  },
});
