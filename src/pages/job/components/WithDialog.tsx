import * as React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';

import { Competency } from '../common-job.type';
import { AddCompetency } from '../AddCompetency';
// import theme from '../../../themes/Theme';

interface AddCompetencyProps {
  getCompetency: (competency: Competency) => void;
  backHome: (value: boolean) => void;
  data:Competency | null;
  label:string
}
 const DialogSelect:React.FC<AddCompetencyProps> = ({
  getCompetency,
  backHome,
  data,
  label="Open Competency"
})=> {
  console.log(backHome);
  
  const [open, setOpen] = React.useState(false);

 

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    console.log(event);
    
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div>
<Button
  sx={{
    color: "white",
   // background: `linear-gradient(145deg, ${theme.colors.primary.main}, ${theme.colors.primary.light})`
  }}
  onClick={handleClickOpen}
>
  {label}
  
</Button>      
<Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        {/* <DialogTitle sx={{color:theme.colors.primary.main}}>Create Competency</DialogTitle> */}
        <DialogContent>
        <AddCompetency data={data} handleClose={handleClose}  backHome={handleClose} getCompetency={getCompetency} />
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default DialogSelect