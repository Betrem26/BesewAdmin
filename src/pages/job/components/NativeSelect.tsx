import * as React from 'react';
// import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
console.log(names);

const  MultipleSelectNative:React.FC<{setJobtitle:any,data?:any}> = ({setJobtitle,data})=> {
  const [personName, setPersonName] = React.useState<string[]>([]);
  const [selectedJob, setSelected] = React.useState<string>()
  console.log("log data log data",selectedJob);
  
  const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = event.target;
    console.log(options);
    
    const value: string[] = [];
    for (let i = 0, l = options?.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
    //setJobtitle(personName)
  };
 React.useEffect(()=>{
  setJobtitle(selectedJob)
 },[selectedJob])
  return (
    <div style={{zIndex:"1000",width:"300px", maxHeight:"200px",overflow:"hidden"}}>
      <FormControl  sx={{ m: 1,maxHeight:200,backgroundColor:"white",position:"absolute",zIndex:"10000",maxWidth:"300px"  }}>
        {/* <InputLabel shrink htmlFor="select-multiple-native">
          Native
        </InputLabel> */}
        <Select<string[]>
            
          multiple
          native
          value={personName}
          // @ts-ignore Typings are not considering `native`
          onChange={handleChangeMultiple}
        //   label="Native"
          inputProps={{
            id: 'select-multiple-native',
          }}
        >
          {data && data.map((name:string) => (
            <option onClick={()=>setSelected(name)} key={name} value={name}>
              {name}
              
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default MultipleSelectNative