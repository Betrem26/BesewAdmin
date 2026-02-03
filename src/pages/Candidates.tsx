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
  MenuItem,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Checkbox,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../common/Sidebar";

function Candidates() {
  type Candidate = {
    _id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    agency: string;
    job_title: string;
    salary: number;
    type_of_employment: string;
  };
  
  const [isTyping, setIsTyping] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[] | []>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_CANDIDATE_PROFILES);
        // console.log("response", response);

        const data = await response.json();
        setCandidates(data);
        // console.log("data", data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

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

        <div className="flex w-[20vw] gap-4 items-center ml-14">
          <h1 className="mr-5">Filter by:</h1>
          <Menu>
            <MenuButton as={Button}>Agency</MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox size="lg" colorScheme="green" className="mr-5" />
                ABC
              </MenuItem>
              <MenuItem>
                <Checkbox size="lg" colorScheme="green" className="mr-5" />
                XYZ
              </MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>Job title</MenuButton>
            <MenuList>
              <MenuItem>
                <Checkbox size="lg" colorScheme="green" className="mr-5" />
                ABC
              </MenuItem>
              <MenuItem>
                <Checkbox size="lg" colorScheme="green" className="mr-5" />
                XYZ
              </MenuItem>
            </MenuList>
          </Menu>
        </div>

        <TableContainer className="mx-14">
          <Table variant="simple" className="border rounded-2xl">
            <Thead className="bg-slate-200 rounded-t-xl">
              <Tr>
                <Th>Id</Th>
                <Th>Candidate name</Th>
                <Th>Phone number</Th>
                <Th>Agency</Th>
                <Th>Job title</Th>
                <Th>Salary</Th>
                <Th>Type of employment</Th>
              </Tr>
            </Thead>
            <Tbody>
              {candidates.map((candidate) => (
                <Tr key={candidate._id}>
                  <Td>{candidate._id}</Td>
                  <Td>{`${candidate.first_name} ${candidate.last_name}`}</Td>
                  <Td>{candidate.phone_number}</Td>
                  <Td>{candidate.agency}</Td>
                  <Td>{candidate.job_title}</Td>
                  <Td>{candidate.salary}</Td>
                  <Td>{candidate.type_of_employment}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <div className="w-[80vw] h-20 justify-center items-center gap-80 inline-flex absolute left-80 bottom-0">
          <div className="justify-between items-center flex gap-96">
            <div className="text-zinc-700 text-md font-normal">
              Showing 1 of {candidates.length} entries
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

export default Candidates;
