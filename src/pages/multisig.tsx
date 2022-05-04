import { Button, Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { DisableTextField } from '../components/disable-text-field';
import { PageLayout } from '../components/layout';
import { IMultisignatureBody } from '../interfaces/bip-api';
import { RootState, storeActions } from '../stores';
import { calcP2sh } from '../stores/multisig';

interface INumberTextFieldProps {
  value: number;
  onChange: (num: number) => void;
  title: string;
}

interface IFillSentenceProps {
  n: INumberTextFieldProps,
  m: INumberTextFieldProps,
  handleGen: (numOfApprove: number) => void;
}

interface IPublicKeyLists {
  publicKeys: string[];
  updateList: (index: number, value: string) => void;
}

const NumberTextField = (props: INumberTextFieldProps) => {
  const { title, value, onChange } = props;
  return (
    <TextField
      id={`${title}}-number`}
      label={title}
      type='number'
      size='small'
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
};

const FillSentence = (props: IFillSentenceProps) => {
  const { n, m } = props;
  return (
    <Grid container spacing={2} direction={'row'} alignItems={'center'}>
      <Grid item xs={12}></Grid>
      <Grid item xs={3}><h3>Multisig To P2SH</h3></Grid>
      <Grid item>
        <NumberTextField {...n} />
      </Grid>
      <Grid item><p>of </p></Grid>
      <Grid item>
        <NumberTextField {...m} />
      </Grid>
      <Grid item>
        <Button size='small' variant="contained" onClick={() => props.handleGen(props.n.value)}>Generate</Button>
      </Grid>
    </Grid>
  );
};

const PublicKeyLists = (props: IPublicKeyLists) => {
  return (
    <Grid container rowGap={2}>
      {
        props.publicKeys.map((key, i) => (
          <Grid
            key={`public-key-${i}`} item xs={12}>
            <TextField
              required
              id={`public-key-${i}`}
              label={`Public Key ${i + 1}`}
              value={key}
              style={{ width: '100%' }}
              onChange={event => props.updateList(i, event.target.value)}
            />
          </Grid>
        ))
      }
    </Grid>
  );
};

const MultiSig = () => {
  const dispatch = useDispatch();
  const { numberOfApprove, numOfParticipant, participantPublicKeys, p2shAddress, redeemScript } = useSelector((state: RootState) => state.multiSig);

  return (
    <PageLayout>
      <FillSentence
        n={{ value: numberOfApprove, title: 'Number Of Approve', onChange: num => dispatch(storeActions.setN(num)) }}
        m={{ value: numOfParticipant, title: 'Number Of Participant', onChange: num => dispatch(storeActions.setM(num)) }}
        handleGen={(value) => {
          const params: IMultisignatureBody = {
            numberOfApprove: value,
            participantPublicKeys: participantPublicKeys,
          };
          dispatch(calcP2sh(params));
        }}
      />
      <PublicKeyLists publicKeys={participantPublicKeys} updateList={(index, value) => dispatch(storeActions.setPublicKey({ index, value }))} />
      <Grid container rowGap={2}>
        <DisableTextField value={redeemScript} label="Pay-To-Script-Hash (P2SH)" rows={3} />
        <DisableTextField value={p2shAddress} label="Bitcoin Address" />
      </Grid>
    </PageLayout>
  );
};

export default MultiSig;
