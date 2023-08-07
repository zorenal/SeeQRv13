import React from 'react';
import { TextField } from '@mui/material/';
import Box from '@mui/material/Box';

interface QueryGroupProps {
  group?: string;
  onChange: (newGroup: string) => void;
}

function QueryGroup({ group, onChange }: QueryGroupProps) {
  return <Box>
    <TextField
      label="Group"
      value={group}
      onChange={(evt) => onChange(evt.target.value)}
    />
  </Box>
}

export default QueryGroup;
