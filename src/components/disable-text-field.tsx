import { Grid, TextField } from '@mui/material';

interface IGridItem {
  label: string;
  value?: string;
  rows?: number;
}

export const DisableTextField = (props: IGridItem) => {
  return (
    <Grid item xs={12}>
      <TextField
        disabled
        multiline
        rows={props.rows || 2}
        style={{ width: '100%' }}
        id={props.label}
        label={props.label}
        value={props.value || ''}
      />
    </Grid>
  );
};
