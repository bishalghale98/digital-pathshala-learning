'use client'

import React, { useState, useMemo } from 'react'
import { useGetStudentsQuery } from '@/store/student/studentApi'
import { PageHeader } from '@/components/common/page-header'
import { SearchInput } from '@/components/common/search-input'
import { Avatar } from '@/components/common/avatar'
import { TableLoading, TableEmptyState, TableFooter } from '@/components/common/data-table'
import { Users } from 'lucide-react'

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: students = [], isLoading } = useGetStudentsQuery()

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm])

  return (
    <div>
      <PageHeader title="Students" subtitle="Manage all registered students" />

      <div className="relative w-full sm:w-72 mb-6">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <TableLoading colSpan={4} message="Loading students..." />
              ) : filteredStudents.length === 0 ? (
                <TableEmptyState
                  icon={Users}
                  colSpan={4}
                  hasFilter={!!searchTerm}
                  filteredLabel="No students found"
                  emptyLabel="No students yet"
                  filteredSubtitle="Try adjusting your search"
                  emptySubtitle="Students will appear here once they register"
                />
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={student.image} name={student.name} />
                        <span className="text-sm font-medium text-gray-900">{student.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{student.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        Student
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 font-mono truncate max-w-[120px] block" title={student.id}>
                        {student.id}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredStudents.length > 0 && (
          <TableFooter filteredCount={filteredStudents.length} totalCount={students.length} label="students" />
        )}
      </div>
    </div>
  )
}

export default StudentsPage
