"use client"
import { useSearchQuery } from '@/state/api'
import React, { useEffect, useState } from 'react'
import {debounce} from "lodash"
import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'
import ProjectCard from '@/components/ProjectCard'
import UserCard from '@/components/UserCard'


const Search = () => {
    const [searchTerm , setSearchTerm] = useState("")
    const {data : searchResults  , isLoading , isError} = useSearchQuery(searchTerm, {
        skip:searchTerm.length <3
    })

    const handleSearch = debounce(
       ( events : React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(events.target.value)
        } , 500,)
        
    useEffect(()=>{
        return handleSearch.cancel()
    },[ handleSearch.cancel])
  return (
    <div className='p-8 '>
      <Header name="Search"/>
      <div>
        <input type="text" placeholder='Search ...' className='w-1/2 rounded border p-3 shadow' onChange={handleSearch}/>
      </div>
      <div className='p-5'>
        {isLoading && <p>Loading...</p> }
        {isError && <p>Error occourred while searching result</p>}
        {!isLoading && !isError && searchResults && (
            <div>
                {searchResults.tasks && searchResults.tasks?.length > 0 && (
                    <h2>Tasks</h2>
                )}
                {searchResults.tasks?.map((task)=>(
                    <TaskCard key={task.id} task={task}/>
                )) }

            </div>
        )}

        {!isLoading && !isError && searchResults && (
            <div>
                {searchResults.projects && searchResults.projects?.length > 0 && (
                    <h2>Projects</h2>
                )}
                {searchResults.projects?.map((project)=>(
                    <ProjectCard key={project.id} project={project}/>
                )) }

            </div>
        )}

        {!isLoading && !isError && searchResults && (
            <div>
                {searchResults.users && searchResults.users?.length > 0 && (
                    <h2>USers</h2>
                )}
                {searchResults.users?.map((user)=>(
                    <UserCard key={user.userId} user={user}/>
                )) }

            </div>
        )}
      </div>
    </div>
  )
}

export default Search
