"use client"
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { useGetProjectsQuery, useGetTasksQuery } from '@/state/api'
import React, { useMemo, useState } from 'react'
import "@wamra/gantt-task-react/dist/style.css";
import { DisplayOption, Gantt, ViewMode } from "@wamra/gantt-task-react"
import Header from '@/components/Header';

type Props = {
    id: string  
    setIsModalNewTaskOpen: (isOpen: boolean) => void 
}

type TaskTypeItems = "task" | "milestone" | "project"

const TimeLine = () => {
    // Validate ID


    const isDarkMode = useAppSelector((state) => state.global.isDarkMode)
    const {data: projects, error, isError , isLoading} = useGetProjectsQuery()
    
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
    })

    const ganttTasks = useMemo(() => {
        return projects?.map((project) => ({
            start: new Date(project.startDate as string),
            end: new Date(project.endDate as string),
            name: project.name,
            id: `Project-${project.id}`,
            type: "project" as TaskTypeItems,
            progress: 50 ,
            isDisabled: false,
        })) || []
    }, [projects])
  
    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev, 
            viewMode: event.target.value as ViewMode
        }))
    }

    if (isLoading) return <div className="p-4">Loading...</div> 
    
    if (isError || !projects) {
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
        <div className='max-w-full p-8'>
            <header className='mb-4 flex items-center justify-between'>
                <Header name='Projects Timeline'/>
                <div className='relative inline-block w-64'>
                    <select 
                        className='focus:shadow-outline block w-full appearance-none rounded border border-gray-400 px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white' 
                        value={displayOptions.viewMode} 
                        onChange={handleViewModeChange}
                    >
                        <option value={ViewMode.Day}>Day</option>
                        <option value={ViewMode.Week}>Week</option>
                        <option value={ViewMode.Month}>Month</option>
                    </select>
                </div>
            </header>

            <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
                <div className='timeline' style={{
                    height: 'auto',
                    minHeight: '400px',
                }}>
                    {ganttTasks.length > 0 ? (
                <Gantt
                    tasks={ganttTasks}
                    viewMode={displayOptions.viewMode}
                    {...({
                        columnWidth: displayOptions.viewMode === ViewMode.Month ? 150 : 100,
                        listCellWidth: "155px",
                        fontSize: "14",
                        rowHeight: 50,
                        headerHeight: 50,
                    } as any)}
                    projectBackgroundColor={isDarkMode}
                />
                    ) : (
                        <div className="flex h-64 items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                No tasks to display
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default TimeLine