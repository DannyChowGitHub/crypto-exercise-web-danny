import { Grid, TextField } from '@mui/material';
import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DisableTextField } from '../components/disable-text-field';
import { PageLayout } from '../components/layout';
import { IBipPathLevel, IDerivationPathBody } from '../interfaces/bip-api';

import { RootState, storeActions } from '../stores';
import { calcDerivationPath } from '../stores/derivation';

interface IPathLevelPros extends IBipPathLevel {
  dispatchFunc: Dispatch<any>;
}

interface IPathLevelTextProps {
  label: string;
  value: number;
  editable?: boolean;
  handleChange: (value: number) => void;
}

const PathLevelText = (props: IPathLevelTextProps) => (
  <Grid item xs={3}>
    <TextField
      disabled={!props.editable}
      id={`path-level-${props.label}`}
      label={props.label}
      value={props.value}
      onChange={event => props.handleChange(Number(event.target.value))}
    />
  </Grid>
);

const PathLevel = (props: IPathLevelPros) => {
  return (
    <Grid container>
      <PathLevelText label='Purpose' value={props.purpose} handleChange={(value) => value} />
      <PathLevelText label='Coin' value={props.coin} handleChange={(value) => value} />
      <PathLevelText
        editable={true}
        label='Account'
        value={props.account}
        handleChange={value => props.dispatchFunc(storeActions.setAccount(value))} />
      <PathLevelText
        editable={true}
        label='External / Internal'
        value={props.change}
        handleChange={value => props.dispatchFunc(storeActions.setChange(value))} />
    </Grid>);
};

const DerivationPath = () => {
  const dispatch = useDispatch();
  const mnemonicState = useSelector((state: RootState) => state.mnemonic);
  const pathState = useSelector((state: RootState) => state.derivationPath);

  useEffect(() => {
    if (mnemonicState.rootKey) {
      const params: IDerivationPathBody = {
        bip32RootKeyStr: mnemonicState.rootKey,
        purpose: pathState.purpose,
        coin: pathState.coin,
        account: pathState.account,
        change: pathState.change,
      };
      dispatch(calcDerivationPath(params));
    }
  }, [dispatch, mnemonicState.rootKey, pathState.account, pathState.change]);

  return (
    <PageLayout title='BIP44 -- Derivation Path'>
      <h3>Mnemonic</h3>
      <PathLevel
        purpose={pathState.purpose}
        coin={pathState.coin}
        account={pathState.account}
        change={pathState.change}
        dispatchFunc={dispatch}
      />
      <DisableTextField label='Account Extended Private Key' value={pathState.accountPrivateKey} />
      <DisableTextField label='Account Extended Public Key' value={pathState.accountPublicKey} />
      <DisableTextField label='BIP32 Derivation Path' value={pathState.derivationPath} rows={1} />
      <DisableTextField label='BIP32 Extended Private Key' value={pathState.bip32PrivateKey} />
      <DisableTextField label='BIP32 Extended Public Key' value={pathState.bip32PublicKey} />
    </PageLayout>
  );
};

export default DerivationPath;
