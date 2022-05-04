import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as blockchainAPI from '../clients/blockchain-api';
import { IDerivationAddress, IDerivationAddressBody, IDerivationPathBody, IDerivationPathResp } from '../interfaces/bip-api';

interface IDerivationAddressState {
  addresses: IDerivationAddress[];
}

export const calcDerivationPath = createAsyncThunk(
  'derivation/path',
  async (params: IDerivationPathBody) => {
    const resp = await blockchainAPI.calcDerivationPath(params);
    return resp;
  }
);

export const calcDerivedAddress = createAsyncThunk(
  'derivation/addresses',
  async (params: IDerivationAddressBody) => {
    let resp: IDerivationAddress[] = [];
    if (!params.bip32RootKeyStr || !params.bip32DerivationPath) {
      resp = [];
      return resp;
    }
    resp = await blockchainAPI.calcDerivedAddress(params);
    return resp;
  }
);

export const derivationPathSlice = createSlice({
  name: 'derivationPath',
  initialState: {
    purpose: 44,
    coin: 0,
    account: 0,
    change: 0,
  } as IDerivationPathBody & IDerivationPathResp,
  reducers: {
    setAccount: (state, action: PayloadAction<number>): IDerivationPathBody & IDerivationPathResp => {
      const newValue = action.payload;
      if (newValue === NaN || newValue < 0) return state;
      return {
        ...state,
        account: newValue,
      };
    },

    setChange: (state, action: PayloadAction<number>): IDerivationPathBody & IDerivationPathResp => {
      const newValue = action.payload;
      if (newValue === NaN || newValue < 0) return state;
      return {
        ...state,
        change: newValue,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calcDerivationPath.fulfilled, (state, action) => {
      state.account = action.meta.arg.account;
      state.change = action.meta.arg.change;
      state.accountPrivateKey = action.payload.accountPrivateKey;
      state.accountPublicKey = action.payload.accountPublicKey;
      state.bip32PrivateKey = action.payload.bip32PrivateKey;
      state.bip32PublicKey = action.payload.bip32PublicKey;
      state.derivationPath = action.payload.derivationPath;
    });
  },
});

export const derivationAddressesSlice = createSlice({
  name: 'derivationAddresses',
  initialState: {
    addresses: [],
  } as IDerivationAddressState,
  reducers: {
    resetDerivedAddress: () => ({ addresses: [] })
  },
  extraReducers: (builder) => {
    builder.addCase(calcDerivedAddress.fulfilled, (state, action) => {
      state.addresses = state.addresses.concat(action.payload);
    });
  },
});
