import React, { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LiaSuitcaseSolid } from "react-icons/lia";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { TbUsers } from "react-icons/tb";
import { LuBuilding2 } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import { GrAnnounce } from "react-icons/gr";
import { RiFileList3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import besewLogo from '../assets/besew-logo.jpg';



const Sidebar: React.FC<{ closeSidebar?: any }> = ({ }) => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  return (
    <>
      {

        !isSidebarOpen ? <aside
          className={`bg-[#022657] w-[280px] h-full overflow-auto ${!isSidebarOpen && "none md:block"
            }`}
          style={{ position: 'relative', transition: "all 500ms" }}
        >
          <IoMdClose onClick={() => setIsSidebarOpen(true)} style={{ fontSize: "25px", color: "white", position: "absolute", left: "80%", top: "20px" }} />

          {/* <button
    className="md:hidden text-white mt-2 ml-2"
    onClick={toggleSidebar}
  >
    {/* {isSidebarOpen ? "Hide" : "Show"} */}

          {/* </button> */}
          <div className="flex flex-row items-center justify-center pt-10">
            <img src={besewLogo} alt="BESEW logo" style={{ height: 36, width: 36, marginRight: 10, borderRadius: 6 }} />
            <h1 className="font-medium text-3xl text-white">BESEW</h1>
          </div>
          <div className="flex flex-col w-full justify-center items-center mt-10">
            <NavItem
              to="/"
              icon={<RxDashboard />}
              label="Dashboard"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}



            />
            <NavItem
              to="/jobs"
              icon={<LiaSuitcaseSolid />}
              label="Jobs"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/vacancies"
              icon={<HiOutlineDocumentDuplicate />}
              label="Vacancies"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            {/* <NavItem
              to="/accounts"
              icon={<TbUsers />}
              label="Accounts"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            /> */}
            <NavItem
              to="/agencies"
              icon={<LuBuilding2 />}
              label="Agencies"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/Users"
              icon={<HiOutlineUsers />}
              label="Users"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/payments"
              icon={<IoWalletOutline />}
              label="Payments"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/ad-management"
              icon={<GrAnnounce />}
              label="Ad Management"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/reports"
              icon={<RiFileList3Line />}
              label="Reports"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/fraud"
              icon={<RiFileList3Line />}
              label="Fraud"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}


            />
            <NavItem
              to="/settings"
              icon={<IoSettingsOutline />}
              label="Settings"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(true)}

            />
          </div>
        </aside> : <aside
          className={`bg-[#022657] w-[55px] h-full overflow-auto ${!isSidebarOpen && "none md:block"
            }`}
          style={{ position: 'relative', transition: "all 500ms" }}
        >
          <IoIosMenu style={{ position: "fixed", fontSize: "50px", marginTop: "20px", color: "white", marginBottom: "10%" }} onClick={() => setIsSidebarOpen(false)} />



          <div className="flex fixed  flex-col w-[55px] justify-start items-start mt-20 ">
            <NavItem
              to="/"
              icon={<RxDashboard />}
              // label="Dashboard"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}
              label=""

            />
            <NavItem
              to="/jobs"
              icon={<LiaSuitcaseSolid />}
              // label="Jobs"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}
              label=""

            />
            <NavItem
              to="/vacancies"
              icon={<HiOutlineDocumentDuplicate />}
              // label="Vacancies"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}
              label=""

            />
            <NavItem
              to="/accounts"
              icon={<TbUsers />}
              // label="Accounts"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}

              label=""
            />
            <NavItem
              to="/agencies"
              icon={<LuBuilding2 />}
              // label="Agencies"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}
              label=""

            />
            <NavItem
              to="/Users"
              icon={<HiOutlineUsers />}
              // label="Users"
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}
              label=""

            />
            <NavItem
              to="/payments"
              icon={<IoWalletOutline />}
              // label="Payments"
              label=""
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}


            />
            <NavItem
              to="/ad-management"
              icon={<GrAnnounce />}
              // label="Ad Management"
              label=""
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}


            />
            <NavItem
              to="/reports"
              icon={<RiFileList3Line />}
              // label="Reports"
              label=""
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}


            />
            <NavItem
              to="/fraud"
              icon={<RiFileList3Line />}
              // label="Fraud"
              label=""
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}


            />
            <NavItem
              to="/settings"
              icon={<IoSettingsOutline />}
              label=""
              currentPath={pathname}
              handelclick={() => setIsSidebarOpen(false)}

            />
          </div>
        </aside>

      }

    </>
  );
}

interface NavItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
  currentPath: string;
  handelclick: any

}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, currentPath, handelclick }) => {
  const isActive = currentPath === to;

  return (
    <NavLink
      to={to}
      className={`flex  font-medium text-2xl w-[85%] rounded-md px-2 py-3  items-center text-start gap-4 ${isActive ? "bg-white text-[#022657]" : "text-white"
        } ${handelclick === true ? "" : " w-[80%] mx-1 rounded-full"}`}
      onClick={handelclick}

    //   activeClassName="bg-white text-[#022657]"
    >
      <h2>{icon}</h2>
      <h1 className="text-lg">{label}</h1>

    </NavLink>
  );
};

export default Sidebar
