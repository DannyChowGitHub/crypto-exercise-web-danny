import axios from 'axios';
import {
  IDerivationAddress,
  IDerivationAddressBody,
  IDerivationPathBody,
  IDerivationPathResp,
  IMnemonicBody,
  IMnemonicResp,
  IMultisignatureBody,
  IMultisignatureResp
} from '../interfaces/bip-api';

const http = axios.create({
  baseURL: 'http://localhost:8095',
  headers: {
    'content-type': 'application/json',
  },
  timeout: 3000,
});

http.interceptors.response.use((resp) => {
  if (resp.status != 200) {
    throw new Error(JSON.stringify(resp));
  }
  return resp.data;
});

export const calcMnemonic = async (body: IMnemonicBody) => {
  const resp: IMnemonicResp = await http.post('/mnemonic', body);
  return resp;
};

export const calcDerivationPath = async (body: IDerivationPathBody) => {
  const resp: IDerivationPathResp = await http.post('/derivation/path', body);
  return resp;
};

export const calcDerivedAddress = async (body: IDerivationAddressBody) => {
  const resp: IDerivationAddress[] = await http.post('/derivation/addresses', body);
  return resp;
};

export const calcP2sh = async (body: IMultisignatureBody) => {
  const resp: IMultisignatureResp = await http.post('/multisignature', body);
  return resp;
};
