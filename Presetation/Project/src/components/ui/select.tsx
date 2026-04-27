import * as React from 'react';
import { Select as MuiSelect } from '@mui/material';

export type SelectProps = React.ComponentProps<typeof MuiSelect>;

export function Select(props: SelectProps) {
  return <MuiSelect {...props} />;
}

export default Select;
