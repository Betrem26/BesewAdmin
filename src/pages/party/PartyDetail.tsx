import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Sidebar from "./../../common/Sidebar";
import Header from "./../../common/Header";

import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import { useEffect, useState } from 'react'
import {  Link, useParams } from "react-router-dom"

function PartyDetail() {
    const id=useParams().partyId
    const[data, setData]=useState<any>(null)
    const [openSidebar, setOpenSidebar] = useState(true)

    useEffect(() => {
      // let testUrl="https://party.besewonline.com/party-profiles/find-by-party-id/5f4f59988ce5b60b5a448a6d"
      let apiUrl="https://party.besewonline.com/party-profiles/"+id
      fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(partydata => {
        // Process the retrieved user data
        console.log('data',partydata);
        setData(partydata)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    },[]);
    return (
    <>
     <div className="flex w-full overflow-scroll " >
    {
        openSidebar && <div className={`${openSidebar ? 'block':'hidden'}  lg:block `}>
        <Sidebar closeSidebar={setOpenSidebar}/>

      </div>
      }
      
    <div style={{width:"100%", background:"gray"}}>
       <div  className='flex bg-slate-900 text-white flex-col  w-full pl-24 pr-24 '> 
       <Header/>
        <div className="flex items-center  p-10 justify-center">
           <img className='rounded-full w-40 h-40' src={"data:image/png;base64,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"} alt="" />
           
        </div>
        <div className="flex justify-between pb-5 gap-1  flex-wrap    ">
         <div className=" pl-4 font-bold border w-[310px] pt-3">
         <h1 className='text-xl underline decoration-1'>Personal Info</h1>

           <h1 className="text-lg	" >Name:{data?.name} {data?.last_name}</h1> 
           <p >Status:<span style={data?.status==="Active"?{color:"green"}:{color:"red"}}> {data?.status}</span></p> <span>from {data?.added_date.replace(/\T/g, "/").split('/')[0]} GC</span>
           <p >Verfied:<span style={data?.verfied===true?{color:"green"}:{color:"red"}}> {data?.verfied?"Yes":"No" }</span></p>
           {/* <p>Id: {data?._id}</p> */}
       
        </div> 
        <div className='pl-4 border w-[31%] font-bold  pt-3 flex flex-col'>
           {/* <select className="w-2/5 h-[45px] font-bold text-xl pl-7 bg">
            <option value="">Social Media</option>
            {data?.social_media_links.map(link=><option><a href={link}>{link}</a> </option>)}
             
           </select> */}
           <h1 className='text-xl text-dec underline decoration-1'>Contact Info</h1>
           <h4>Phone Number: <a href="">{data?.phone_number}</a></h4>
           <ul className=" font-bold ">
           
            {data?.social_media_links.length!==0? data?.social_media_links.map((link,index)=><li><a href={link}> Social Media({index+1}): {link}</a> </li>):<li> Social Media: No Social Media</li>}

           </ul>
        </div>
        <div className=' pl-4 border w-[31%] font-bold   p-10  pt-3 flex flex-col'>
          
           <h1 className='text-xl underline decoration-1'>Address Info</h1>
           <ul className=" font-bold text-xl  bg">
           
               <li>City: {data?.city.charAt(0).toUpperCase()+data?.city.slice(1)}</li>
               <li>Region: {data?.region.charAt(0).toUpperCase()+data?.region.slice(1)}</li>
               <li>country: {data?.country.charAt(0).toUpperCase()+data?.country.slice(1)}</li>

           </ul>
        </div>
        </div>
        
        <div className='w-full gap-10  p-10   bg-slate-800 flex flex-col' >
            <h1 className='text-xl text-center font-bold pb-10'>Professional</h1>
            <div className=' w-fit p-2'>
           <h3 className='font-bold' >
             <i className="fa-solid fa-check"> </i> Has Company: <span style={data?.has_company? {color:"green"}:{color:"red"}}>{
            data?.has_company? "Yse":"No"
            }
            </span> 
            
            </h3>
            <h3 className='font-bold'><i className="fa-solid fa-check"></i> Type: Agency</h3>
           </div>
             
              <select className=" h-[45px] pl-20 text-black  font-bold w-1/2">
            <option value="">language skill</option>
            {data?.lang_skill.map(link=><option><a href={link}>{link}</a> </option>)}
             
           </select> 
         
           
    <div>
        <h3 className='font-bold'>Expriance</h3>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
          
          <TableRow>
            <TableCell>sn</TableCell>
            <TableCell align="right">Company</TableCell>
            <TableCell align="right">level</TableCell>
            <TableCell align="right">Position</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell align="right">start date</TableCell>
            <TableCell align="right">end date</TableCell>
            <TableCell align="right">Years</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="right">Addispay</TableCell>
              <TableCell align="right">Junior</TableCell>
              <TableCell align="right">Development</TableCell>
              <TableCell align="right">12500</TableCell>
              <TableCell align="right">09-02-2024</TableCell>
              <TableCell align="right">09-02-2024</TableCell>
              <TableCell align="right">4</TableCell>

            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
        </div>
        <div>
        <h3 className='font-bold'>Competency</h3>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
          
          <TableRow>
            <TableCell>sn</TableCell>
            <TableCell align="right">Company</TableCell>
            <TableCell align="right">level</TableCell>
            <TableCell align="right">Position</TableCell>
            <TableCell align="right">Salary</TableCell>
            <TableCell align="right">start date</TableCell>
            <TableCell align="right">end date</TableCell>
            <TableCell align="right">Years</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="right">Addispay</TableCell>
              <TableCell align="right">Junior</TableCell>
              <TableCell align="right">Development</TableCell>
              <TableCell align="right">12500</TableCell>
              <TableCell align="right">09-02-2024</TableCell>
              <TableCell align="right">09-02-2024</TableCell>
              <TableCell align="right">4</TableCell>

            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
        </div>
        <div>
        <h3 className='font-bold'>Education</h3>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
          
          <TableRow>
            <TableCell>sn</TableCell>
            <TableCell align="right">Institute</TableCell>
            <TableCell align="right">level</TableCell>
            <TableCell align="right">Field</TableCell>
            <TableCell align="right">start date</TableCell>
            <TableCell align="right">end date</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                1
              </TableCell>
              <TableCell align="right">University of Example</TableCell>
              <TableCell align="right">Bachelor</TableCell>
              <TableCell align="right">Computer Science</TableCell>
              <TableCell align="right">09-02-2024</TableCell>
              <TableCell align="right">09-02-2024</TableCell>

            </TableRow>
          
        </TableBody>
      </Table>
    </TableContainer>
        </div>
        </div>
        <Link style={{ marginTop:'3%',paddingBottom:"1%", display:'flex', justifyContent:'center',} } to='../Users'> <Button variant="contained"><ArrowBackIcon/>Back</Button></Link>

        </div>
    </div>
    </div>
    </>
  )
}

export default PartyDetail