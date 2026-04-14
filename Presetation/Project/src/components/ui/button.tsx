import * as React from 'react';
import { Button as MuiButton } from '@mui/material';

export type ButtonProps = React.ComponentProps<typeof MuiButton>;

export function Button(props: ButtonProps) {
  return <MuiButton {...props} />;
}

export default Button;
