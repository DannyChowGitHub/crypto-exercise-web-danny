export interface IMnemonicResp {
  words: string;
  seed: string;
  rootKey: string;
}

export interface IMnemonicBody {
  numOfWords: number;
  lang?: string;
  password?: string;
}

export interface IBipPathLevel {
  purpose: number;
  coin: number;
  account: number;
  change: number;
}

export interface IDerivationPathResp extends IBipPathLevel {
  accountPrivateKey: string;
  accountPublicKey: string;
  bip32PrivateKey: string;
  bip32PublicKey: string;
  derivationPath: string;
}

export interface IDerivationPathBody extends IBipPathLevel {
  bip32RootKeyStr: string;
}

export interface IDerivationAddress {
  id: number;
  path: string;
  address: string;
  privateKey: string;
  publicKey: string;
}

export interface IDerivationAddressBody {
  startIdx: number;
  pageSize: number;
  bip32DerivationPath: string;
  bip32RootKeyStr: string;
}

export interface IMultisignatureResp {
  redeemScript: string;
  p2shAddress: string;
}

export interface IMultisignatureBody {
  numberOfApprove: number;
  participantPublicKeys: string[];
}
