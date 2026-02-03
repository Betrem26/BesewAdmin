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
import { MdOutlineMoreVert } from "react-icons/md";
import Sidebar from "../common/Sidebar";

export default function Payments() {
  const [isTyping, setIsTyping] = useState(false);
  const [payments, setPayments] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(true)

  console.log(payments);
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_PAYMENTS);
        // console.log("response", response);

        const data = await response.json();
        setPayments(data);
        // console.log("data", data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchPayments();
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
              <FaChevronDown className="text-black cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center ml-14 font-semibold text-xl ">
          <h1>Payment Verification Requests</h1>
        </div>

        <TableContainer className="mx-14">
          <Table variant="simple" className="border rounded-2xl">
            <Thead className="bg-slate-200 rounded-t-xl">
              <Tr>
                <Th>Agency Name</Th>
                <Th>Invoice #</Th>
                <Th>Invoice date</Th>
                <Th>Agency commission</Th>
                <Th>Amount</Th>
                <Th>Bank ref</Th>
                <Th>Deposit Amount</Th>
                <Th>Status</Th>
                <Th>Vacancy</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Ethio</Td>
                <Td>00000198765</Td>
                <Td>02-04-2023</Td>
                <Td>2%</Td>
                <Td>1000</Td>
                <Td>8675463542</Td>
                <Td>1000</Td>
                <Td textColor="blue">
                  <div className="bg-green-200 text-green-700 font-medium border border-green-600 rounded-md px-3 py-1">
                    Pending
                  </div>
                </Td>
                <Td textColor="blue">Details</Td>
                <Td>
                  <MdOutlineMoreVert className="text-2xl cursor-pointer" />
                </Td>
              </Tr>
              <Tr>
                <Td>Addis</Td>
                <Td>00000198765</Td>
                <Td>02-04-2023</Td>
                <Td>7%</Td>
                <Td>3000</Td>
                <Td>76544987</Td>
                <Td>3000</Td>
                <Td textColor="blue">
                  <div className="bg-green-200 text-green-700 font-medium border border-green-600 rounded-md px-3 py-1">
                    Verified
                  </div>
                </Td>
                <Td textColor="blue">Details</Td>
                <Td>
                  <MdOutlineMoreVert className="text-2xl cursor-pointer" />
                </Td>
              </Tr>
              <Tr>
                <Td>ABC</Td>
                <Td>00000198765</Td>
                <Td>02-04-2023</Td>
                <Td>4%</Td>
                <Td>500</Td>
                <Td>09871234</Td>
                <Td>500</Td>
                <Td textColor="blue">
                  <div className="bg-green-200 text-green-700 font-medium border border-green-600 rounded-md px-3 py-1">
                    Details
                  </div>
                </Td>
                <Td textColor="blue">Details</Td>
                <Td>
                  <MdOutlineMoreVert className="text-2xl cursor-pointer" />
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