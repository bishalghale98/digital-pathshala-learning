'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useGetStudentsQuery } from '@/store/student/studentApi'

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data: students = [], isLoading } = useGetStudentsQuery()

    const filterStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex flex-col">
            <div className=" overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                    <div className="relative  text-gray-500 focus-within:text-gray-900 mb-4">
                        <div className="absolute inset-y-0 left-1 flex items-center pl-3 pointer-events-none ">
                            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="#9CA3AF" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                                <path d="M17.5 17.5L15.4167 15.4167M15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0005 15.8333 12.6614 15.0929 13.8667 13.8947C15.0814 12.6872 15.8333 11.0147 15.8333 9.16667Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </div>
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" id="default-search" className="block w-80 h-11 pr-5 pl-12 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none" placeholder="Search students..." />
                    </div>
                    <div className="overflow-hidden ">
                        <table className=" min-w-full rounded-xl">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th scope="col" className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"> Students Id</th>
                                    <th scope="col" className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"> Name </th>
                                    <th scope="col" className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize"> Email </th>
                                    <th scope="col" className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 capitalize rounded-t-xl"> Image </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 ">

                                {
                                    isLoading && (
                                        <tr className="bg-white">
                                            <td colSpan={5} className="p-5 text-center text-sm text-gray-500">Loading students...</td>
                                        </tr>
                                    )
                                }
                                {
                                    filterStudents.map((student) => (
                                        <tr key={student._id} className="bg-white transition-all duration-500 hover:bg-gray-50">
                                            <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 truncate max-w-[120px] "> {student._id}</td>
                                            <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900"> {student.name} </td>
                                            <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900"> {student.email}</td>
                                            <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900"> {student.image && <Image src={student.image} alt={student.name} width={40} height={40} />}</td>
                                        </tr>
                                    ))
                                }



                            </tbody>
                        </table>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default StudentsPage