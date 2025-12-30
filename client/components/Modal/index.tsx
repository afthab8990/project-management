import React from 'react'
import ReactDOM from "react-dom"
import Header from '../Header';
import { X } from 'lucide-react';

type Props = {
    children : React.ReactNode;
    isOpen : boolean
    onClose : ()=>void
    name : string

}

const Modal = ({children , isOpen , onClose , name}:Props) => {
    if (!isOpen) return null  
  return ReactDOM.createPortal(
    <div className='fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600/50 p-4'>
        <div className='w-full max-w-2xl p-4 rounded-lg bg-white shadow-lg dark:bg-dark-secondary'>
            <Header 
            name={name}
            buttonComponent={
                <button className='flex items-center h-7 w-7 justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600'
                onClick={onClose} >
                    <X size={18}/>
                </button>
            }
            isSmallText
            />
            {children}
        </div>
    </div>,
    document.body
  )
}

export default Modal
