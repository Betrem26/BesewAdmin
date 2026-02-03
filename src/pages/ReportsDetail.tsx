import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import Sidebar from "../common/Sidebar";

export default function ReportsDetail() {
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
              {""}
              <FaChevronDown className=" cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex flex-col px-20">
          <div className="flex justify-between w-full">
            <h1 className="w-[30vw] font-semibold text-xl my-4">
              Report Details
            </h1>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex justify-between w-[50vw]">
              <div className="flex-col w-full">
                <div className="grid grid-cols-3  w-full gap-5">
                  <div className="flex-col">
                    <h1 className="text-lg text-slate-500">Report ID:</h1>
                    <h1 className="text-xl font-medium">123</h1>
                  </div>
                  <div className="flex-col">
                    <h1 className="text-lg text-slate-500">Category: </h1>
                    <h1 className="text-xl font-medium">Harassment</h1>
                  </div>
                  <div className="flex-col">
                    <h1 className="text-lg text-slate-500">Reporting User:</h1>
                    <h1 className="text-xl font-medium">UserA</h1>
                  </div>
                  <div className="flex-col">
                    <h1 className="text-lg text-slate-500">Reported User:</h1>
                    <h1 className="text-xl font-medium">UserB</h1>
                  </div>
                  <div className="flex-col">
                    <h1 className="text-lg text-slate-500">Status: </h1>
                    <h1 className="text-xl font-medium">Pending</h1>
                  </div>
                </div>
                <h1 className="my-6 text-xl font-medium text-slate-500">
                  Incident Details:{" "}
                </h1>
                <div className="grid grid-cols-2 w-full gap-5">
                  <div className="flex flex-col">
                    <h1 className="text-lg text-slate-500">Date and Time: </h1>
                    <h1 className="text-xl font-medium">
                      January 15, 2023, 14:30
                    </h1>
                  </div>
                  <div className="flex flex-col relative left-36">
                    <h1 className="text-lg text-slate-500">Location: </h1>
                    <h1 className="text-xl font-medium">#General</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex px-20 gap-5 py-10">
          <Button colorScheme="yellow" width={40} variant="solid">
            Warn
          </Button>
          <Button
            colorScheme="red"
            width={40}
            textColor="white"
            variant="solid"
          >
            Block
          </Button>
          <Button
            colorScheme="blackAlpha"
            width={40}
            textColor="white"
            variant="solid"
          >
            Suspend
          </Button>
        </div>

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
