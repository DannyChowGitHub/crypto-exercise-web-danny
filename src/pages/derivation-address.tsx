import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageLayout } from '../components/layout';
import { IDerivationAddress, IDerivationAddressBody } from '../interfaces/bip-api';
import { RootState, storeActions } from '../stores';
import { calcDerivedAddress } from '../stores/derivation';

const ADDRESS_TABLE_HEADER = ['Path', 'Address', 'Public Key', 'Private Key'];

const MAX_ROW_LENGTH = 500;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 100];

interface IDispatchAddrPageChangeParams {
  pageNum: number;
  pageSize: number;
  derivationAddresses: IDerivationAddress[];
  bip32DerivationPath: string;
  rootKey: string;
  reset: boolean
  dispatch: Dispatch<any>;
}

interface IAddressTableProps {
  derivationAddresses: IDerivationAddress[];
  rowsPerPage: number;
  changePage: (size: number, pageNum: number, reset?: boolean) => void;
  setRowsPerPage: Dispatch<React.SetStateAction<number>>;
}

const dispatchAddrPageChange = (params: IDispatchAddrPageChangeParams) => {
  const { pageSize, derivationAddresses, bip32DerivationPath, rootKey, reset, dispatch } = params;
  let rowSize = pageSize;
  if (reset) {
    dispatch(storeActions.resetDerivedAddress());
  } else {
    const currentSize = derivationAddresses.length;
    if (currentSize > MAX_ROW_LENGTH) return;

    if (currentSize + pageSize > MAX_ROW_LENGTH) rowSize = MAX_ROW_LENGTH - currentSize;
  }

  const calcAddrBody: IDerivationAddressBody = {
    startIdx: params.pageNum === 0 ? 0 : params.pageNum * pageSize,
    pageSize: rowSize,
    bip32DerivationPath,
    bip32RootKeyStr: rootKey,
  };

  dispatch(calcDerivedAddress(calcAddrBody));
};

const AddressTable = (props: IAddressTableProps) => {
  const [page, setPage] = useState(0);

  const { derivationAddresses: addresses, rowsPerPage, setRowsPerPage } = props;
  const displayRows = addresses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer style={{ width: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {ADDRESS_TABLE_HEADER.map((header) => (<TableCell key={header}>{header}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayRows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.path}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell>{row.publicKey}</TableCell>
                <TableCell>{row.privateKey}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component='div'
        count={MAX_ROW_LENGTH}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => {
          props.changePage(rowsPerPage, newPage);
          setPage(newPage);
        }}
        onRowsPerPageChange={event => {
          setRowsPerPage(+event.target.value);
          setPage(0);
          props.changePage(+event.target.value, 0, true);
        }}
      />
    </Paper>
  );
};

const DerivationAddress = () => {
  const dispatch = useDispatch();
  const {
    mnemonic: mState, derivationPath: dpState, derivationAddress: daState
  } = useSelector((state: RootState) => state);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const changePage = (size: number, pageNum: number, reset = false) => dispatchAddrPageChange({
    dispatch,
    pageNum,
    pageSize: size,
    reset,
    derivationAddresses: daState.addresses,
    bip32DerivationPath: dpState.derivationPath,
    rootKey: mState.rootKey,
  });

  useEffect(() => {
    changePage(rowsPerPage, 0, true);
  }, [dispatch, mState.rootKey, dpState.derivationPath]);

  return (
    <PageLayout title='Derived Addresses'>
      <AddressTable
        derivationAddresses={daState.addresses}
        rowsPerPage={rowsPerPage}
        changePage={changePage}
        setRowsPerPage={setRowsPerPage}
      />
    </PageLayout>
  );
};

export default DerivationAddress;
