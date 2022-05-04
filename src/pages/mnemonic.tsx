import {
  Button, Grid, MenuItem, Select, TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { DisableTextField } from '../components/disable-text-field';
import { PageLayout } from '../components/layout';
import { IMnemonicBody } from '../interfaces/bip-api';
import { RootState } from '../stores';
import { calcMnemonic } from '../stores/mnemonic';

const WORDS_NUM_OPTIONS = [12, 15, 18, 21, 24];

interface INumOfWordsSelection {
  numOfWords: number;
  handleChange: (value: number) => void;
}

const NumOfWordsSelection = (props: INumOfWordsSelection) => (
  <Select
    labelId='num-of-words-selection'
    id='num-of-words-select'
    value={props.numOfWords}
    onChange={event => props.handleChange(Number(event.target.value))}
    size='small'
  >
    {WORDS_NUM_OPTIONS.map((num) => (
      <MenuItem key={num} value={num}>
        {num}
      </MenuItem>
    ))}
  </Select>
);

const SelectSentence = (props: INumOfWordsSelection) => {
  return (
    <Grid container spacing={2} direction={'row'} alignItems={'center'}>
      <Grid item xs={12}></Grid>
      <Grid item xs={6}><h3>Mnemonic</h3></Grid>
      <Grid item>random mnemonic words:</Grid>
      <Grid item>
        <NumOfWordsSelection numOfWords={props.numOfWords} handleChange={props.handleChange} />
      </Grid>
      <Grid item>
        <Button size='small' variant="contained" onClick={() => props.handleChange(props.numOfWords)}>Generate</Button>
      </Grid>
    </Grid>
  );
};

const Mnemonic = () => {
  const dispatch = useDispatch();
  const mnemonicState = useSelector((state: RootState) => state.mnemonic);
  return (
    <PageLayout>
      <SelectSentence
        numOfWords={mnemonicState.numOfWords}
        handleChange={value => {
          const params: IMnemonicBody = {
            numOfWords: value,
            password: mnemonicState.password,
          };
          dispatch(calcMnemonic(params));
        }}
      />
      <DisableTextField label='BIP39 Mnemonic' value={mnemonicState.words} />
      <Grid item xs={12}>
        <TextField
          required
          label='BIP39 Passphrase(optional)'
          value={mnemonicState.password}
          style={{ width: '100%' }}
          onChange={event => {
            const params: IMnemonicBody = {
              numOfWords: mnemonicState.numOfWords,
              password: event.target.value,
            };
            dispatch(calcMnemonic(params));
          }}
        />
      </Grid>
      <DisableTextField label='BIP39 Seed' value={mnemonicState.seed} />
      <DisableTextField label='BIP32 Root Key' value={mnemonicState.rootKey} />
    </PageLayout>
  );
};

export default Mnemonic;
