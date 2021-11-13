import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomSnackbar(props) {
  const {openSnackbar, message, severity, handleCloseSnackBar} = props;
  const [state, setState] = React.useState({
    vertical: 'bottom',
    horizontal: 'right',
  });

  const { vertical, horizontal } = state;

  return (
    <Snackbar
        anchorOrigin={{vertical, horizontal}}
        open={openSnackbar}
        onClose={handleCloseSnackBar}
        key={vertical + horizontal}
    >
        <Alert onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
            {message}
        </Alert>
    </Snackbar>
  );
}