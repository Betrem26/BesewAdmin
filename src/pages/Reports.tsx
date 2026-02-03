import { useState } from "react";
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

function Reports() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex w-full h-[100vh]">
      <Sidebar />
      <div className="flex flex-col w-full p-5 bg-slate-50 gap-5">
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
          <div className="flex items-center text-black justify-end gap-16 w-full">
            <div className="flex bg-white px-5 text-black items-center gap-16 py-1">
              <div className="flex items-center text-black gap-3">
                <div className="flex rounded-full w-10 bg-slate-300 h-10"></div>
                <h1 className="text-black">Bruk</h1>
              </div>
              <FaChevronDown className="cursor-pointer text-black" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center ml-14 font-semibold text-xl ">
          <h1>Recent User Reports</h1>
        </div>

        <TableContainer className="mx-14">
          <Table variant="simple" className="border rounded-2xl">
            <Thead className="bg-slate-200 rounded-t-xl">
              <Tr>
                <Th>Id</Th>
                <Th>Agency</Th>
                <Th>Job</Th>
                <Th>Vacancies</Th>
                <Th>Payment verified</Th>
                <Th>Date added</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td>Harrassment</Td>
                <Td>Pending</Td>
                <Td>Details</Td>
                <Td textColor="blue">Details</Td>
              </Tr>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td>Inappropriate</Td>
                <Td>Resolved</Td>
                <Td>Details</Td>
                <Td textColor="blue">Details</Td>
              </Tr>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td>Spam</Td>
                <Td>Details</Td>
                <Td>Details</Td>
                <Td textColor="blue">Details</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

        <div className="flex gap-4 items-center ml-14 font-semibold text-xl ">
          <h1>User Action Log</h1>
        </div>

        <TableContainer className="mx-14">
          <Table variant="simple" className="border rounded-2xl">
            <Thead className="bg-slate-200 rounded-t-xl">
              <Tr>
                <Th>Report ID </Th>
                <Th>Administrator </Th>
                <Th>Action Taken</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>Warning issued </Td>
                <Td>Harrassment</Td>
              </Tr>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>Account suspension </Td>
                <Td>Inappropriate</Td>
              </Tr>
              <Tr>
                <Td>00000198765</Td>
                <Td>Details</Td>
                <Td>No action taken (under review) </Td>
                <Td>Spam</Td>
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

export default Reports;
