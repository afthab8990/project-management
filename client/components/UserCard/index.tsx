import { Project, User } from '@/state/api'
import Image from 'next/image'
import React from 'react'

type Props = {
    user : User
}

const UserCard = ({user}:Props) => {
  return (
    <div className='flex items-center p-4 rounded border shadow'>
        {user.profilePictureUrl && (
            <Image src={`/p1.jpeg`} alt='Profile pic' width={32} height={32} className='rounded-full'/>
        )}
        <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        </div>
    </div>
  )
}

export default UserCard
