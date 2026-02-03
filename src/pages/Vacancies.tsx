import { useState, useEffect } from "react";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Center
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../common/Sidebar";
import { MdOutlineMoreVert } from "react-icons/md";
import Chart3 from "../components/Chart3";
import Chart5 from "../components/Chart5";
import AddVacancyModal from "./job/AddVacancyModal";

interface Vacancy {
  _id: string;
  employerType: {
    id: string;
  };
  agency?: string;
  jobTitle: string;
  applicantsNeeded: number;
  verified: boolean;
  posted_date: string;
  jobDescription: string;
}

export default function Vacancies() {
  const [isTyping, setIsTyping] = useState(false);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(import.meta.env.VITE_VACANCIES);

        if (!response.ok) {
          throw new Error('Failed to fetch vacancies');
        }

        const data = await response.json();
        setVacancies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching vacancies:", error);
        setError('Failed to load vacancies');
        setVacancies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  return (
    <div className="flex w-full h-[100vh]">
      {openSidebar && (
        <div className={`${openSidebar ? 'block' : 'hidden'} lg:block`}>
          <Sidebar closeSidebar={setOpenSidebar} />
        </div>
      )}

      <div className="flex flex-col w-full p-5 bg-slate-50 gap-5">
        <div className="flex w-full gap-5 items-center">
          <div className="flex items-center w-full flex-row-reverse">
            <input
              type="text"
              className="rounded-md border-slate-600 bg-white text-black w-full h-10 relative right-5"
              onChange={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              placeholder="Search vacancies..."
            />
            {!isTyping && (
              <FiSearch className="text-2xl relative left-5 text-slate-500" />
            )}
          </div>
          <div className="flex items-center justify-end gap-16 w-full">
            <div className="flex bg-white px-5 items-center gap-16 py-1">
              <div className="flex items-center gap-3">
                <div className="flex rounded-full w-10 bg-slate-300 h-10"></div>
                <span className="text-black">Bruk</span>
              </div>
              <FaChevronDown className="cursor-pointer text-black" />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex w-[20vw] gap-4 items-center ml-5">
            <span>Enter Date</span>
            <input type="date" className="border px-4 py-2 rounded-lg" />
          </div>
          <div className="flex w-[20vw] gap-4 items-center ml-5">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add new Vacancy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Total vacancies posted
          </h1>
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Agencies vacancies
          </h1>
          <h1 className="pl-14 text-xl font-medium text-slate-500 relative"></h1>
          <Chart5 />
          <Chart3 />
        </div>

        <div style={{ overflowY: "scroll", maxHeight: "calc(100vh - 240px)" }}>
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
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={8}>
                      <Center p={8}>
                        <Spinner size="xl" />
                      </Center>
                    </Td>
                  </Tr>
                ) : error ? (
                  <Tr>
                    <Td colSpan={8}>
                      <Center p={4} color="red.500">
                        {error}
                      </Center>
                    </Td>
                  </Tr>
                ) : vacancies.length === 0 ? (
                  <Tr>
                    <Td colSpan={8}>
                      <Center p={4}>
                        No vacancies found
                      </Center>
                    </Td>
                  </Tr>
                ) : (
                  vacancies.map((vacancy) => (
                    <Tr key={vacancy._id}>
                      <Td>{vacancy.employerType?.id}</Td>
                      <Td>{vacancy.agency || "N/A"}</Td>
                      <Td>{vacancy.jobTitle}</Td>
                      <Td>{vacancy.applicantsNeeded}</Td>
                      <Td style={{ color: vacancy.verified ? "green" : "red" }}>
                        {vacancy.verified ? "YES" : "NO"}
                      </Td>
                      <Td>{vacancy.posted_date}</Td>
                      <Td>{vacancy.jobDescription}</Td>
                      <Td>
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            onClick={() => {/* Add edit handler */ }}
                          >
                            <MdOutlineMoreVert className="text-2xl" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        <div className="w-[80vw] h-20 justify-center items-center gap-80 inline-flex absolute left-80 bottom-0">
          <div className="justify-between items-center flex gap-96">
            <div className="text-zinc-700 text-md font-normal">
              Showing 1 of {vacancies.length} entries
            </div>
            <div className="justify-start items-start gap-[30px] flex">
              <button className="p-2.5 bg-zinc-100 rounded-sm hover:bg-zinc-200">
                <span className="text-zinc-700 text-md font-normal">PREV</span>
              </button>
              <div className="justify-center items-center gap-3 flex">
                <div className="p-2.5 bg-indigo-50 rounded-sm">
                  <span className="text-zinc-700 text-md font-normal">1</span>
                </div>
                <span className="text-zinc-700 text-md font-normal">2</span>
                <span className="text-zinc-700 text-md font-normal">3</span>
                <span className="text-zinc-700 text-md font-normal">4</span>
              </div>
              <button className="p-2.5 bg-zinc-100 rounded-sm hover:bg-zinc-200">
                <span className="text-zinc-700 text-md font-normal">NEXT</span>
              </button>
            </div>
          </div>
          <div className="justify-start items-center gap-2 flex">
            <span>Show entries</span>
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

      <AddVacancyModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
