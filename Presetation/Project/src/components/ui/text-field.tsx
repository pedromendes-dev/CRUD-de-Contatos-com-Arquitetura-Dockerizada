import * as React from 'react';
import { TextField as MuiTextField } from '@mui/material';

export type TextFieldProps = React.ComponentProps<typeof MuiTextField>;

export function TextField(props: TextFieldProps) {
  return <MuiTextField {...props} />;
}

export default TextField;
