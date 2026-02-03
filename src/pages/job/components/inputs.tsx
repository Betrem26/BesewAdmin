import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export  const TextInput:React.FC<{label:string,type:string,onChange:any, value:any, name?:string,setIsFocused?:any}> = ({type,onChange,value,label, name,setIsFocused})=> {

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {     
      setIsFocused(false);

    }, 1000);
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >
      {
        type === "input" && <TextField
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        id="outlined-multiline-flexible"
        label={label}
        multiline
        name={name}
        maxRows={4}
        onChange={onChange}
        value={value}
        size='small'
        style={{ width: '90%',  }} // Adjust width and height as needed
      />
      }

      {
        type === "multiline-placeholder" &&  <TextField
        id="outlined-textarea"
        label={label}
        placeholder={value}
        multiline
          onChange={onChange}
          value={value}
          style={{ minWidth: '90%' }}
          size='small'
        />
      }
       
    </Box>
  );
}