import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { FiSearch } from "react-icons/fi";
import { FaPlus, FaChevronDown } from "react-icons/fa6";
import Chart2 from "../components/Chart2";
import Chart4 from "../components/Chart4";
import { TableContainer, Table, Thead, Tr, Th, Tbody } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { clearToken } from "../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import JobAdd from "./job/addCommonJob";
import { RiMenuLine } from "react-icons/ri";

function Jobs() {
  type JobTemplateProp = {
    _id: string;
    jobCategoryId: string;
    job_category: string;
    jobName: string;
    jobDescription: string;
    education: string;
    job_level_name: string;
    skill: string;
    attitude: string;
  };
  // const [openJob, setOpenJob] = useState(false)
  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping);
  const [jobTemplate, setJobTemplate] = useState<JobTemplateProp[] | []>([]);
  console.log(jobTemplate);
  const [openJob, setOpenJob] = useState(false);
  useEffect(() => {
    const fetchJobTemplate = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_JOB_TEMPLATE);
        // console.log("response", response);

        const data: any = await response.json();
        setJobTemplate(data);
        // console.log("data", data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchJobTemplate();
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSidebar, setOpenSidebar] = useState(true);
  return (
    <div className="flex w-full h-[100vh] ">
      {openSidebar && (
        <div className={`${openSidebar ? "block" : "hidden"}  lg:block `}>
          <Sidebar closeSidebar={setOpenSidebar} />
        </div>
      )}

      <div
        style={{ position: "relative" }}
        className="flex flex-col w-full p-5 bg-slate-50 gap-5 relative overflow-auto"
      >
        {openJob && (
          <div
            className="h-screen bg-gradient-to-br from-blue-200 to-blue-300"
            style={{
              position: "absolute",
              width: "100%",
              left: "0%",
              top: "0%",
              zIndex: 2,
            }}
          >
            {/* <FormComponent backHome={setOpenJob}/> */}
            <JobAdd backHome={setOpenJob} />
          </div>
        )}

        <div className="flex w-full gap-5 items-center">
          <div>
            {!openSidebar && (
              <RiMenuLine
                className="block cursor-pointer lg:hidden "
                onClick={() => setOpenSidebar(!openSidebar)}
                fontSize={26}
              />
            )}
          </div>

          <div className="flex items-center w-full flex-row-reverse">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search job"
                className="rounded-md border-slate-600 bg-white text-black w-full h-10 pl-12 pr-5"
                onChange={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-500" />
            </div>
          </div>
          <div
            onClick={() => setOpenJob(!openJob)}
            className="relative w-64 h-12"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#007bff] rounded-md opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
            <button className="absolute inset-0 w-full h-full flex items-center justify-center gap-2 rounded-md text-white cursor-pointer bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 hover:bg-black hover:shadow-lg backdrop-blur-sm px-4 py-2">
              <FaPlus className="text-white" />
              <h1 className="text-white font-medium">Add Job</h1>
            </button>
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
          <button
            onClick={() => {
              dispatch(clearToken());
              navigate("/login");
            }}
          >
            logout
          </button>
        </div>
        <div className="flex w-[20vw] items-center  relative">
          <h1>Enter Date</h1>
          <input type="date" className="border px-4 py-2 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 w-full gap-4">
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Job analysis
          </h1>
          <h1 className="text-xl font-medium text-slate-500 relative left-14">
            Job analysis
          </h1>
          <h1 className="pl-14 text-xl font-medium text-slate-500 relative">
            Job locations
          </h1>
          <Chart2 />
          <Chart2 />
          <Chart4 />
        </div>
        <div className="w-full">
          <TableContainer>
            <Table variant="simple" className="border rounded-2xl">
              <Thead className="bg-slate-200 rounded-t-xl">
                <Tr>
                  <Th className="w-1/10">Id</Th>
                  <Th className="w-1/10">Job category</Th>
                  <Th className="w-1/10">Job title</Th>
                  <Th className="w-1/10">Description</Th>
                  <Th className="w-1/10">Education</Th>
                  <Th className="w-1/10">Knowledge</Th>
                  <Th className="w-1/10">Skills</Th>
                  <Th className="w-1/10">Attitude</Th>
                  <Th className="w-1/10">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {/* { jobTemplate.map((jobTemplate) => (
                  <Tr key={jobTemplate._id}>
                    <Td>{jobTemplate.jobCategoryId}</Td>
                    <Td>{jobTemplate.job_category}</Td>
                    <Td>{jobTemplate.jobName}</Td>
                    <Td>{jobTemplate.jobDescription}</Td>
                    <Td>{jobTemplate.education}</Td>
                    <Td>{jobTemplate.job_level_name}</Td>
                    <Td>{jobTemplate.skill}</Td>
                    <Td>{jobTemplate.attitude}</Td>
                    <Td>
                      {" "}
                      <MdOutlineMoreVert className="text-2xl cursor-pointer" />
                    </Td>
                  </Tr>
                ))} */}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Jobs;
