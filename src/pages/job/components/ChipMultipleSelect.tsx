import * as React from 'react';

import FormControl from '@mui/material/FormControl';

import { TextInput } from './inputs';

const MultipleSelectChip:React.FC<{label:string, onChange:any, value:any,addEnv:any,deleteEnv:any,data:any}> = ({label, onChange, value, addEnv,data})=> {
console.log(data);


  return (
    <div>
      <FormControl sx={{ width: 300 }}>
      <FormControl className='flex justify-center items-center ' sx={{flexDirection:"row", width: 300 }}>
        
        <TextInput
        type='input'
          label={label}
          value={value}
          onChange={onChange}
        />
        <div onClick={addEnv} className="relative flex justify-center items-center h-11 w-40">
  <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#007bff] rounded-md opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
  <button className="absolute inset-0 flex items-center justify-center gap-2 rounded-md text-white cursor-pointer bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 hover:bg-black hover:shadow-lg backdrop-blur-sm px-3 py-1">
    {/* <FaPlus className="text-white" /> */}
    <h1 className="text-white font-medium">Add</h1>
  </button>
</div>
      </FormControl>
      
      </FormControl>
      
    </div>
  );
}

export default MultipleSelectChip
