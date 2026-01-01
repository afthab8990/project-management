"use client"

import React from 'react'
import {Menu, MenuIcon, Moon, Search, Settings, Sun, User} from 'lucide-react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed, setIsDarkMode } from '@/state';
import { useGetAuthUserQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import Image from 'next/image';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed  = useAppSelector((state) => state.global.isSidebarCollapsed)
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
  const {data : currentUser} = useGetAuthUserQuery({})
  if (!currentUser) return null

  const handleSignOut = async () => {
    try{
      await signOut()
    }
    catch(error){
      console.error("error signing out ",error)
    }
  }

  if(!currentUser) return null
    const currentUserdetails = currentUser?.userDetails
  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 dark:bg-black '>
      {/* search */}
      <div className='flex items-center gap-8'>
        {!isSidebarCollapsed? null : (<button onClick={()=>{dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}}>
          <Menu className='h-8 w-8 dark:text-white'></Menu>
        </button>)}
        <div className='relative flex h-min w-[200px]'>
            <Search className='absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer dark:text-white'/> 
            <input className='w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white ' type='search' placeholder='Search...' />
        </div>
      </div>
      {/* icons */}
      <div className='flex items-center '>
        <button onClick={()=>{dispatch(setIsDarkMode(!isDarkMode)); console.log("Changed state")}} className={isDarkMode
          ?`h-min w-min rounded p-2 dark:hover:bg-gray-700` 
          : `h-min w-min rounded p-2 hover:bg-gray-100` }>
          {isDarkMode
          ? ( <Sun className='cursor-pointer h-6 w-6 dark:text-white'/>) : 
          ( <Moon className='cursor-pointer h-6 w-6 dark:text-black'/>)}
         
        </button>
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 dark:hover:bg-gray-700`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }>
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />

        </Link>
        <div className='ml-2 mr-5 hidden h-min-[2em] w-min-[0.1rem] bg-gray-200 md:inline-block'></div>
        <div className='hidden items-center justify-between md:flex'>
          <div className='align-center flex h-9 w-9 justify-center'>
            {!!currentUserdetails?.profilePictureUrl?(
              <Image src={`https://pm-s3-img-bucket.s3.ap-south-1.amazonaws.com/${currentUserdetails?.profilePictureUrl}`}
                alt={currentUserdetails?.username || "Unknown"} 
                width={100} 
                height={50} 
                className='h-full rounded-full object-cover'
              />
              
            ) : (
              <User className='h-6 w-6 cursor-pointer self-center rounded-full dark:text-white'/>
            )}
          </div>
          <span className='mx-3 text-gray-800 dark:text-white'>
            {currentUserdetails?.username}
          </span>
          <button className='hidden rounded bg-blue-400 py-2 px-4 text-xs font-bold text-white hover:bg-blue-500 md:block' onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
