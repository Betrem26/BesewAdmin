import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const BasicSelect: React.FC<{ onChange: any, value: any, data: string[], label: string }> = ({ onChange, value, data, label }) => {

  return (
    <Box sx={{ minWidth: 270 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          
          onChange={onChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200, // Adjust the value according to your preference
              },
            },
          }}
          size='small'
        style={{ width: '90%',  }} 
        >
          {data && data.map((item) => {
            return <MenuItem value={item}>{item}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
