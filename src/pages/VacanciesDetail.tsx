import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../common/Sidebar";

export default function VacanciesDetail() {
  return (
    <div className="flex w-full h-[100vh]">
      <Sidebar />
      <div className="flex flex-col w-full p-5 bg-slate-50 gap-5">
        <div className="flex w-full gap-5 items-center">
          <div className="flex items-center w-full flex-row-reverse">
            <input
              type="text"
              className=" rounded-md border-slate-600 bg-white w-full h-10 relative right-5"
            />
            <FiSearch className="text-2xl relative left-5 text-slate-500" />
          </div>
          <div className="flex items-center justify-end gap-16  w-full">
            <div className="flex bg-white px-5 items-center gap-16 py-1">
              <div className="flex items-center gap-3">
                <div className="flex rounded-full w-10 bg-slate-300 h-10"></div>
                <h1>Bruk</h1>
              </div>
              <FaChevronDown className=" cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex flex-col px-20">
          <div className="flex justify-between w-full">
            <h1 className="w-[30vw] font-semibold text-xl my-4">
              Vacancy details
            </h1>
            <h1 className="w-[30vw] font-semibold text-xl my-4">
              Employer details
            </h1>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex justify-between w-[30vw]">
              <div className=" w-full flex-col gap-1 justify-start items-start inline-flex">
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal">
                    Job title
                  </div>
                  <div className="text-black font-normal">Driver</div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal capitalize">
                    Job Category
                  </div>
                  <div className="text-black font-normal">Driver</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal">
                    Job description
                  </div>
                  <div className="text-black font-normal">-</div>
                </div>
                <div className="self-stretch h-7 justify-between items-center inline-flex">
                  <div className="w-36 text-zinc-700 text-base font-normal">
                    Behaviour
                  </div>
                  <div className="p-2.5 flex-col justify-start items-start gap-2.5 inline-flex">
                    <div className="justify-start items-start gap-[37px] inline-flex">
                      <div className="text-zinc-700 font-normal capitalize">
                        Adaptability
                      </div>
                      <div className="text-zinc-700 font-normal capitalize">
                        Work Ethic
                      </div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal capitalize">
                    Skills
                  </div>
                  <div className="text-black font-normal">-</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal capitalize">
                    Location:
                  </div>
                  <div className="text-zinc-700 text-base font-normal capitalize">
                    Addis Ababa
                  </div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal capitalize">
                    Education
                  </div>
                  <div className="text-black text-base font-normal capitalize">
                    10+
                  </div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">
                    Employment type
                  </div>
                  <div className="text-black font-normal">Permanent</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">Experience</div>
                  <div className="text-black font-normal">4 years</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 font-normal">Gender</div>
                  <div className="text-black font-normal">Male</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">Vacancies</div>
                  <div className="text-black font-normal">2</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">Deadline</div>
                  <div className="text-black font-normal">Jan 30</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">Currency</div>
                  <div className="text-black font-normal">ETB</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className=" text-zinc-700 font-normal">Salary</div>
                  <div className="text-black font-normal">5000</div>
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="text-zinc-700 font-normal">
                    Requires point of contact
                  </div>
                  <Checkbox size="lg" colorScheme="green" defaultChecked />
                </div>
                <div className="self-stretch h-7 justify-between items-start inline-flex">
                  <div className="w-[261px] h-[17px] text-zinc-700 font-normal">
                    Is there a job interview?
                  </div>
                  <Checkbox size="lg" colorScheme="green" />
                </div>
              </div>
            </div>
            <div className="flex justify-between w-[30vw]">
              <div className="w-full flex-col justify-start items-start gap-3 inline-flex">
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="text-zinc-700 text-base font-normal ">
                    Company Name
                  </div>
                  <div className="text-zinc-700 text-base font-normal ">
                    Noah real estate
                  </div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className=" text-zinc-700 text-base font-normal ">
                    Company Location
                  </div>
                  <div className="text-zinc-700 text-base font-normal ">
                    Stadium
                  </div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className=" text-zinc-700 text-base font-normal ">
                    Phone nunber
                  </div>
                  <div className="text-zinc-700 text-base font-normal ">
                    +251-89121212
                  </div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className=" text-zinc-700 text-base font-normal ">
                    Region
                  </div>
                  <div className="text-zinc-700 text-base font-normal ">AA</div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className=" text-zinc-700 text-base font-normal ">
                    City
                  </div>
                  <div className="text-zinc-700 text-base font-normal ">AA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex px-20 gap-5">
          <Button colorScheme="yellow" width={40} variant="solid">
            Suspend user
          </Button>
          <Button
            colorScheme="red"
            width={40}
            textColor="white"
            variant="solid"
          >
            Deactivate user
          </Button>
          <Button
            colorScheme="blackAlpha"
            width={40}
            textColor="white"
            variant="solid"
          >
            Delete job
          </Button>
        </div>

        <div className="w-full h-20 justify-center items-center gap-80 inline-flex">
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
