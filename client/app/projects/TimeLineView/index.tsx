import { useAppDispatch, useAppSelector } from '@/app/redux'
import { useGetTasksQuery } from '@/state/api'
import React, { useMemo, useState } from 'react'
import "@wamra/gantt-task-react/dist/style.css";
import { DisplayOption, Gantt, ViewMode } from "@wamra/gantt-task-react"

type Props = {
    id: string  
    setIsModalNewTaskOpen: (isOpen: boolean) => void 
}

type TaskTypeItems = "task" | "milestone" | "project"

const TimeLine = ({id, setIsModalNewTaskOpen}: Props) => {
    // Validate ID
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
    
    const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
        viewMode: ViewMode.Month,
        // locale: "en-US",
    })

    const ganttTasks = useMemo(() => {
        return tasks?.map((task) => ({
            start: new Date(task.startDate as string),
            end: new Date(task.dueDate as string),
            name: task.title,
            id: `Task-${task.id}`,
            type: "task" as TaskTypeItems, // Use "task" not "tasks"
            progress: task.points ? (task.points / 10) * 100 : 0,
            styles: {
                backgroundColor: isDarkMode ? "#3b82f6" : "#3b82f6",
                backgroundSelectedColor: isDarkMode ? "#2563eb" : "#1d4ed8",
                progressColor: isDarkMode ? "#1e40af" : "#1e3a8a",
                progressSelectedColor: isDarkMode ? "#1e3a8a" : "#1e3a8a",
            },
            isDisabled: false,
        })) || []
    }, [tasks])
  
    const handleViewModeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setDisplayOptions((prev) => ({
            ...prev, 
            viewMode: event.target.value as ViewMode
        }))
    }

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
        <div className='px-4 xl:px-6'>
            <div className='flex flex-wrap items-center justify-between gap-2 py-5'>
                <h1 className='me-2 text-lg font-bold dark:text-white'>
                    Project Task Timeline
                </h1>
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
            </div>

            <div className='overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white'>
                <div className='timeline' style={{
                    height: 'auto',
                    minHeight: '400px',
                }}>
                    {ganttTasks.length > 0 ? (
                        <Gantt
                            tasks={ganttTasks}
                            viewMode={displayOptions.viewMode}
                            // locale={displayOptions.locale}
                            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
                            listCellWidth="155px"
                            fontSize="14"
                            rowHeight={50}
                            headerHeight={50}
                        />
                    ) : (
                        <div className="flex h-64 items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                No tasks to display
                            </p>
                        </div>
                    )}
                </div>
                <div className='px-4 pb-5 pt-1'>
                    <button 
                        className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
                        onClick={() => setIsModalNewTaskOpen(true)}
                    >
                        Add New Task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TimeLine