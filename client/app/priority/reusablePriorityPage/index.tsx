"use client"
import { useAppSelector } from '@/app/redux'
import Header from '@/components/Header'
import ModalNewTask from '@/components/ModalNewTask'
import TaskCard from '@/components/TaskCard'
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils'
import { Priority, Task, useGetAuthUserQuery, useGetTasksByUserQuery } from '@/state/api'
import { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { filter } from 'lodash'
import React, { useState } from 'react'

type Props = {
    priority : Priority
    
}

const columns : GridColDef[] = [
    {
        field : "title",
        headerName : "Title",
        width : 100
    },
    {
        field : "description",
        headerName : "Description",
        width : 200
    },
    {
        field : "status",
        headerName : "Status",
        width : 130,
        renderCell : (params) => (<span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 '>
            {params.value}
        </span>)
    },
    {
        field : "priority",
        headerName : "Priority",
        width : 75
    },
    {
        field : "tags",
        headerName : "Tags",
        width : 130
    },
    {
        field : "startDate",
        headerName : "StartDate",
        width : 130
    },
    {
        field : "dueDate",
        headerName : "DueDate",
        width : 130
    },
    {
        field : "author",
        headerName : "Author",
        width : 150,
        renderCell : (params) => params.value?.author || "Unknown"
    },
    {
        field : "assignee",
        headerName : "Assignee",
        width : 150,
        renderCell : (params) => params.value?.assignee || "Unassigned"
    },

]

const ReusablePriorityPage = ({priority} : Props) => {
    const [view , setView] = useState("list")
    const [isModalNewTaskOpen ,setIsModalNewTaskOpen ]=  useState(false)
    const {data : currentUser} = useGetAuthUserQuery({})

    const userId = currentUser?.userDetails?.userId ?? null
    
    
    const {data : tasks , isLoading , isError : isTaskError} = useGetTasksByUserQuery(userId || 0 , {
        skip : userId === null
    })

    const isDarkMode = useAppSelector((state)=> state.global.isDarkMode)
    const filteredTasks = tasks?.filter((task : Task ) => task.priority === priority )

    if (isLoading) return <div>Loading...</div>
    if (isTaskError || !tasks) return <div>Error Loading...</div>
  return (
    <div className='m-5 p-4'>
      <ModalNewTask isOpen = {isModalNewTaskOpen} onClose={()=> setIsModalNewTaskOpen(false)}/>
        <Header name='Priority Page' buttonComponent={
            <button 
            className='mr-3 rounded bg-blue-500 p-4 py-2 font-bold text-white ' onClick={()=>setIsModalNewTaskOpen(true)}>Add Task</button>
        } />
        <div className='mb-4 flex justify-start'>
            <button className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white "} rounded-l`} onClick={()=>setView("list")}>
                List
            </button>
            <button className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white "} rounded-l`} onClick={()=>setView("table")}>
                Table
            </button>
        </div>
        {isLoading ? (<div>Loading task</div>)  : view === "list" ? (
            <div className='grid grid-cols-1 gap-4'>
                {filteredTasks?.map((task:Task)=>(
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
        )  : (
            view === "table" && filteredTasks && (
                <div className='w-full'>
                    <DataGrid 
                    rows={filteredTasks}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row)=> row.id}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}/>
                </div>
            )
        )}
    </div>
  )
}



export default ReusablePriorityPage
