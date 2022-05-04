import { Grid } from '@mui/material';
import DerivationAddress from './derivation-address';

import DerivationPath from './derivation-path';
import Mnemonic from './mnemonic';
import MultiSig from './multisig';

const Main = () => {
  return (
    <Grid container rowGap={3}>
      <Mnemonic />
      <DerivationPath />
      <DerivationAddress />
      <MultiSig />
    </Grid>
  );
};

export default Main;
