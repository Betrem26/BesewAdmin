import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../common/Sidebar";
import Chart2 from "../components/Chart2";
import Chart3 from "../components/Chart3";
import Chart6 from "../components/Chart6";

function Agencies() {
  const [isTyping, setIsTyping] = useState(false);
  const [agencies, setAgencies] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(true)

 console.log(agencies);
 
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_AGENCIES_ACCOUNT);
        // console.log("response", response);

        const data = await response.json();
        setAgencies(data);
        // console.log("data", data);
      } catch (error) {
        console.error("Error fetching Agencies:", error);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="flex w-full h-[100vh]">
{
        openSidebar && <div className={`${openSidebar ? 'block':'hidden'}  lg:block `}>
        <Sidebar closeSidebar={setOpenSidebar}/>

      </div>
      }      <div className="flex flex-col w-full p-5 bg-slate-50 gap-5">
        <div className="flex w-full gap-5 items-center">
          <div className="flex items-center w-full flex-row-reverse">
            <input
              type="text"
              className="rounded-md border-slate-600 bg-white text-black w-full h-10 relative right-5"
              onChange={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
            {!isTyping && (
              <FiSearch className="text-2xl relative left-5 text-slate-500" />
            )}
          </div>
          <div className="flex items-center justify-end gap-16 w-full">
            <div className="flex bg-white px-5 items-center gap-16 py-1">
              <div className="flex items-center gap-3">
                <div className="flex rounded-full w-10 bg-slate-300 h-10"></div>
                <h1 className="text-black">Bruk</h1>
              </div>
              <FaChevronDown className="cursor-pointer text-black" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 w-full gap-4">
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Matching Report
          </h1>
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Job analysis
          </h1>
          <h1 className="pl-14 text-xl font-medium text-slate-500 relative">
            Candidate Education Analysis
          </h1>
          <Chart6 />
          <Chart2 />
          <Chart3 />
        </div>

        <div className="flex gap-4 items-center ml-14 font-semibold text-xl ">
          <h1>Recent User Reports</h1>
        </div>

        <TableContainer className="mx-14">
          <Table variant="simple" className="border rounded-2xl">
            <Thead className="bg-slate-200 rounded-t-xl">
              <Tr>
                <Th>Id</Th>
                <Th>Agency name</Th>
                <Th># of registered candidates</Th>
                <Th># Matching</Th>
                <Th>Hired candidates</Th>
                <Th>Verification</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* {agencies.map((agencies) => (
                <Tr key={agencies._id}>
                  <Td>{agencies.act_id}</Td>
                  <Td>{agencies.uname}</Td>
                  <Td>{agencies.role}</Td>
                  <Td>{agencies.agency}</Td>
                  <Td>{agencies.company}</Td>
                  <Td>{agencies.location}</Td>
                </Tr>
              ))} */}
              <Tr>
                <Td>098765</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td textColor="blue">
                  {" "}
                  <h1 className="text-orange-500 font-semibold">Pending</h1>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        <div className="w-[80vw] h-20 justify-center items-center gap-80 inline-flex absolute left-80 bottom-0">
          <div className="justify-between items-center flex gap-96">
            <div className="text-zinc-700 text-md font-normal">
              Showing 1 of 25 entries
            </div>
            <div className="justify-start items-start gap-[30px] flex">
              <div className="p-2.5 bg-zinc-100 rounded-sm justify-center items-center gap-2.5 flex">
                <div className="text-zinc-700 text-md font-normal">PREV</div>
              </div>
              <div className="justify-center items-center gap-3 flex">
                <div className="p-2.5 bg-indigo-50 rounded-sm flex-col justify-center items-center gap-2.5 inline-flex">
                  <div className="text-zinc-700 text-md font-normal">1</div>
                </div>
                <div className="text-zinc-700 text-md font-normal">2</div>
                <div className="text-zinc-700 text-md font-normal">4</div>
                <div className="text-zinc-700 text-md font-normal">3</div>
              </div>
              <div className="p-2.5 bg-zinc-100 rounded-sm justify-center items-center gap-2.5 flex">
                <div className="text-zinc-700 text-md font-normal">NEXT</div>
              </div>
            </div>
          </div>
          <div className="justify-start items-center gap-2 flex">
            <h1>Show entries</h1>
            <NumberInput
              defaultValue={1}
              min={1}
              clampValueOnBlur={false}
              className="w-20"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agencies;
