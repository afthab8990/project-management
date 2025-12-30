import Header from '@/components/Header'
import React from 'react'

const Settings = () => {
    const userSetting = {
        userName : "JohnDoe",
        email : "abc@xyz.com",
        teamName : "Development team",
        roleName : "Developer"
    }

    const labelStyles = "block text-sm font-medium dark:text-white"
    const textStyles = "mt-1 block w-full border border-gray-300 shadow-sm p-2 dark:text-white "
  return (
    <div className='p-8 '>
      <Header name="Settings"/>
      <div className='space-y-4'>
        <label htmlFor="" className={labelStyles}>Username</label>
        <div className={textStyles}>{userSetting.userName}</div>
      </div>
      <div className='space-y-4'>
        <label htmlFor="" className={labelStyles}>Email</label>
        <div className={textStyles}>{userSetting.email}</div>
      </div>
      <div className='space-y-4'>
        <label htmlFor="" className={labelStyles}>teamName</label>
        <div className={textStyles}>{userSetting.teamName}</div>
      </div>
      <div className='space-y-4'>
        <label htmlFor="" className={labelStyles}>Role</label>
        <div className={textStyles}>{userSetting.roleName}</div>
      </div>
    </div>
  )
}

export default Settings
