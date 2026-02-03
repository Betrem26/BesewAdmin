import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import Sidebar from "./../../common/Sidebar";
import Header from "./../../common/Header";

import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function CompanyDetail() {
  const id = useParams().partyId
  const [data, setData] = useState<any>(null)
  const [openSidebar, setOpenSidebar] = useState(true)
  const [personData, setPersonData] = useState<any>({})

  useEffect(() => {
    // let testUrl="https://party.besewonline.com/party-profiles/find-by-party-id/5f4f59988ce5b60b5a448a6d"
    let apiUrl = "https://party.besewonline.com/company-data/" + id
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(partydata => {
        // Process the retrieved user data
        // console.log('data',partydata);
        setData(partydata)
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, []);

  // contact person data

  useEffect(() => {
    let testUrl = "https://party.besewonline.com/company-contacts"
    // let apiUrl="https://party.besewonline.com/company-contacts/"+id
    fetch(testUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(partydata => {
        // Process the retrieved user data
        console.log('data', partydata);
        setPersonData(partydata)
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }, []);


  return (
    <>
      <div className='flex  w-full overflow-scroll'>
        {
          openSidebar && <div className={`${openSidebar ? 'block' : 'hidden'}  lg:block `}>
            <Sidebar closeSidebar={setOpenSidebar} />

          </div>
        }
        <div className=' w-full flex flex-col gap-3  text-white bg-gray-900 p-9 '>
          <Header />

          <div className='border text-white w-full pl-14 pr-14 pt-7 pb-7 flex flex-col gap-3' >
            <div className='flex flex-wrap gap-5 justify-around'>

              <div className='border font-bold  w-full p-3'>
                <h1 className='h-20 flex items-center justify-center  w-24'><img className='w-20 h-20 border rounded-full' src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEX///9gYGBdXV1UVFRbW1tXV1dTU1PY2Nh2dnZ6enr8/PxpaWn39/dkZGTk5OTy8vKVlZXMzMyjo6N/f3/t7e1wcHDe3t6NjY2wsLDBwcG7u7uGhoapqambm5vS0tKvr6+QkJBRwIq1AAAIZUlEQVR4nO2da3uiPBCGNScUBEQOVRD1///KNxOKDdi+YDenXtfcX3bLYpfHTGYmySRsNgiCIAiCIAiCIAiCIAiCIAiCIAiCIAiCIH+e/wD6W4bIGbaaNQAAAABJRU5ErkJggg=="} alt="" /></h1>

                <h1 className='text-xl'>Company Name: {data?.company_name}</h1>
                <ul className='flex  w-full justify-between  mb-3 mt-3'>
                  <li><i className="fa-regular fa-circle-dot"> </i> Company Type: {data?.company_type.name}</li>
                  <li><i className="fa-regular fa-circle-dot"> </i> Phone Number: {data?.phone_number}</li>
                  <li><i className="fa-regular fa-circle-dot"> </i> Location: {data?.location}</li>
                </ul>
                <ul className=' flex w-full flex-col '>
                  <li><i className="fa-solid fa-check"> </i>  Total Employee: {data?.total_employee}</li>
                  <li><i className="fa-solid fa-check"></i> Total Vacancy: {data?.total_vacancy}</li>

                  <li>
                    <i className="fa-solid fa-check"></i> Favorite: <span style={data?.isFavorite ? { color: "green" } : { color: "red" }}>{data?.isFavorite ? "True" : "False"}</span>

                  </li>

                </ul>

              </div>

            </div>
            <div className='flex gap-2 justify-between'>
              <div className='flex flex-col gap-3'>
                <div className='border font-bold w-80 bg-slate-900 p-3'>
                  <h1><i className="fa-solid fa-location-dot"></i>Address Info.</h1>
                  <p>City: {data?.city}</p>
                  <p>Region: {data?.region}</p>
                  <p>Location: {data?.location}</p>



                </div>
                <div className='w-full border font-bold pl-4'>
                  <h1 className='text-center '>Licence and Registration </h1>
                  <div>
                    <p>Company Type: {data?.company_type.name}</p>
                    <p>License Type: {data?.license_type.name}</p>
                    <p>License Number: {data?.liscence_number}</p>
                    <p>Allowed Countries: {data?.allowed_countries.name}</p>
                    <p className=''>Registered by Agency: <span style={data?.isFavorite ? { color: "green" } : { color: "red" }}>{data?.registered_by_agency ? "True" : "False"}</span> </p>
                  </div>

                </div>
              </div>
              <div className='font-bold w-2/4  p-3 border'>
                <h1 className='text-center '>Company Contact Persons</h1>
                <h1>Name: {personData[0]?.name} {personData[0]?.last_name}</h1>
                <p>Role: {personData[0]?.role}</p>
                <p>Phone Number: {personData[0]?.phone_number}</p>

              </div>
            </div>

            <Link style={{ marginTop: '3%', paddingBottom: "1%", display: 'flex', justifyContent: 'center', }} to='../Users'> <Button variant="contained"><ArrowBackIcon />Back</Button></Link>

          </div>



        </div>
      </div>
    </>
  )
}

export default CompanyDetail