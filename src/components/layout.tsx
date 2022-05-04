import { Container, Grid } from '@mui/material';
import { ReactNode } from 'react';

interface IPageLayoutProps {
  children?: ReactNode;
  title?: string;
}

export const PageLayout = (props: IPageLayoutProps) => (
  <Container style={{ width: '100%' }}>
    <Grid container rowGap={2}>
      {props.title && <h3>{props.title}</h3>}
      {props.children}
    </Grid>
  </Container>
);
