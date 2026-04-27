import * as React from 'react';
import { Paper as MuiPaper } from '@mui/material';

export type PaperProps = React.ComponentProps<typeof MuiPaper>;

export function Paper(props: PaperProps) {
  return <MuiPaper {...props} />;
}

export default Paper;
