import { useAppSelector } from '@/app/redux'
import Header from '@/components/Header'
import { useGetTasksQuery } from '@/state/api'
import React from 'react'
import {DataGrid , GridColDef } from "@mui/x-data-grid" 
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils'
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';



type Props = {
    id: string  
    setIsModalNewTaskOpen: (isOpen: boolean) => void 
}
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});
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

    const TableView = ({id, setIsModalNewTaskOpen}: Props) => {
        const projectId = Number(id)
        
        if (isNaN(projectId) || !id) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="text-red-600 dark:text-red-400">
                        Invalid project ID
                    </div>
                </div>
            )
        }
    const {data: tasks, error, isLoading} = useGetTasksQuery({projectId})
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
        if (isLoading) return <div className="p-4">Loading...</div> 
        
    if (error) {
        console.error('Error fetching tasks:', error)
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-600 dark:text-red-400">
                    Error loading tasks
                </div>
            </div>
        )
    }
  return (
    <div className='h-[540px] px-4 pb-8 w-full xl:p-6'>
      <div className='pt-5 '>
        <Header name="Table"  buttonComponent={
          <button className='flex items-center bg-blue-primary px-3 py-2 text-white hover:bg-blue-600' 
          onClick={()=>setIsModalNewTaskOpen(true)}>Add Task</button>
        }
        isSmallText/>

        <DataGrid rows={tasks || []}  
        columns={columns} 
        className={dataGridClassNames} 
        sx={dataGridSxStyles(isDarkMode)}
        />

      </div>
    </div>
  )
}

export default TableView



// Theeeeem


