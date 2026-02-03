import React from 'react'
import { useDispatch } from "react-redux";
import { clearToken } from "./../store/features/userSlice";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaChevronDown } from "react-icons/fa6";


function Header() {
    const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
   <>
   <header>
   <div className=" font-bold flex items-center justify-end gap-16 w-full text-black mt-4">
            <div className="flex bg-white px-5 items-center gap-16 py-1">
              <div className="flex items-center gap-3">
                <div className="flex rounded-full w-10 bg-slate-300 h-10"></div>
                <p>Welcome Back!</p>
                <h1 className="text-black">Bruk</h1>

              </div>
              <FaChevronDown className="text-black cursor-pointer" />
            </div>
            <button className='bg-white h-10 w-20 rounded-md  ' onClick={() => {
            dispatch(clearToken())
            navigate('/login')
          }}>logout</button>
          </div>
   </header>
   </>
  )
}

export default Header