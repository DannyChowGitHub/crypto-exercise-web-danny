import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import * as blockchainAPI from '../clients/blockchain-api';
import { IMultisignatureBody, IMultisignatureResp } from '../interfaces/bip-api';

export interface IMultiSig extends IMultisignatureBody, IMultisignatureResp {
  numOfParticipant: number;
}

const generateArray = (size: number): string[] => Array(size).fill('');

export const calcP2sh = createAsyncThunk(
  'p2sh',
  async (params: IMultisignatureBody) => {
    const resp = await blockchainAPI.calcP2sh(params);
    return resp;
  }
);

export const multiSigSlice = createSlice({
  name: 'multisignature',
  initialState: {
    numberOfApprove: 2,
    numOfParticipant: 3,
    participantPublicKeys: generateArray(3),
  } as IMultiSig,
  reducers: {
    setN: (state, action: PayloadAction<number>): IMultiSig => {
      const newValue = action.payload;
      if (newValue >= state.participantPublicKeys.length || newValue < 1) return state;
      return {
        ...state,
        numberOfApprove: action.payload,
      };
    },

    setM: (state, action: PayloadAction<number>): IMultiSig => {
      const newNum = action.payload;
      const currentPublicKeys = state.participantPublicKeys;
      const diff = newNum - state.numOfParticipant;
      if (diff === 0) return state;
      let newKeyLists: string[];
      if (diff > 0) {
        newKeyLists = currentPublicKeys.concat(generateArray(diff));
      } else {
        newKeyLists = currentPublicKeys.slice(0, newNum);
      }
      return {
        ...state,
        numOfParticipant: action.payload,
        participantPublicKeys: newKeyLists,
      };
    },

    setPublicKey: (state, action: PayloadAction<{ index: number, value: string }>): IMultiSig => {
      const { index, value } = action.payload;
      const currentPublicKeys = state.participantPublicKeys;
      if (index > currentPublicKeys.length - 1) {
        throw new Error(`Invalid index[${index}] to update public key`);
      }

      const newPublicKeys = _.clone(currentPublicKeys);
      newPublicKeys[index] = value;

      return {
        ...state,
        participantPublicKeys: newPublicKeys
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calcP2sh.fulfilled, (state, action) => {
      state.redeemScript = action.payload.redeemScript;
      state.p2shAddress = action.payload.p2shAddress;
    });
  },
});
