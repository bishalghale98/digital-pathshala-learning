'use client'

import PaymentModal from '@/components/enrollment/payment-modal'
import { EnrollmentStatus } from '@/schemas/enrollmentSchema'
import {
  useChangeEnrollmentStatusMutation,
  useGetEnrollmentsQuery,
} from '@/store/enrollment/enrollmentApi'
import { useGetStudentsQuery } from '@/store/student/studentApi'
import { useGetCoursesQuery } from '@/store/course/courseApi'
import { getEnrolledStudent, getEnrolledCourse } from '@/lib/utils/enrollment'
import { getErrorMessage } from '@/store/api/base'
import { formatDate } from '@/lib/utils/format'
import { PageHeader } from '@/components/common/page-header'
import { SearchInput } from '@/components/common/search-input'
import { StatusBadge, enrollmentStatusVariant } from '@/components/common/status-badge'
import { TableLoading, TableEmptyState, TableFooter } from '@/components/common/data-table'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle, ClipboardList } from 'lucide-react'
import { useModal } from '@/hooks/use-modal'

type StatusFilter = 'all' | 'Approved' | 'Pending' | 'Rejected'

const EnrollmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { isOpen, open, close } = useModal()
  const [selectedId, setSelectedId] = useState('')

  const { data: enrollments = [], isLoading } = useGetEnrollmentsQuery()
  const { data: students = [] } = useGetStudentsQuery()
  const { data: courses = [] } = useGetCoursesQuery()
  const [changeEnrollmentStatus] = useChangeEnrollmentStatusMutation()

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const student = getEnrolledStudent(students, enrollment)
      const course = getEnrolledCourse(courses, enrollment)
      const matchesSearch =
        !searchTerm ||
        student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || enrollment.enrollmentStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [enrollments, students, courses, searchTerm, statusFilter])

  const stats = useMemo(() => {
    let approved = 0
    let pending = 0
    let rejected = 0
    for (const e of enrollments) {
      if (e.enrollmentStatus === EnrollmentStatus.Approved) approved++
      if (e.enrollmentStatus === EnrollmentStatus.Pending) pending++
      if (e.enrollmentStatus === EnrollmentStatus.Rejected) rejected++
    }
    return { approved, pending, rejected, total: enrollments.length }
  }, [enrollments])

  const handleApprove = async (id: string) => {
    try {
      await changeEnrollmentStatus({ id, body: { enrollmentStatus: EnrollmentStatus.Approved } }).unwrap()
      toast.success('Enrollment approved')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleReject = async (id: string) => {
    try {
      await changeEnrollmentStatus({ id, body: { enrollmentStatus: EnrollmentStatus.Rejected } }).unwrap()
      toast.success('Enrollment rejected')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const hasFilter = !!searchTerm || statusFilter !== 'all'

  return (
    <div>
      <PageHeader title="Enrollments" subtitle="Manage student course enrollments" />

      {/* Stats */}
      {!isLoading && enrollments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3 rounded-lg border text-left transition-colors ${
              statusFilter === 'all' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </button>
          <button
            onClick={() => setStatusFilter('Approved')}
            className={`p-3 rounded-lg border text-left transition-colors ${
              statusFilter === 'Approved' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500">Approved</p>
            <p className="text-lg font-bold text-green-600">{stats.approved}</p>
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`p-3 rounded-lg border text-left transition-colors ${
              statusFilter === 'Pending' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
          </button>
          <button
            onClick={() => setStatusFilter('Rejected')}
            className={`p-3 rounded-lg border text-left transition-colors ${
              statusFilter === 'Rejected' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-xs text-gray-500">Rejected</p>
            <p className="text-lg font-bold text-red-600">{stats.rejected}</p>
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by student or course..." />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <TableLoading colSpan={6} message="Loading enrollments..." />
              ) : filteredEnrollments.length === 0 ? (
                <TableEmptyState
                  icon={ClipboardList}
                  colSpan={6}
                  hasFilter={hasFilter}
                  filteredLabel="No enrollments found"
                  emptyLabel="No enrollments yet"
                  filteredSubtitle="Try adjusting your filters"
                  emptySubtitle="Enrollments will appear here when students enroll"
                />
              ) : (
                filteredEnrollments.map((enrollment) => {
                  const student = getEnrolledStudent(students, enrollment)
                  const course = getEnrolledCourse(courses, enrollment)
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{student?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{student?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{course?.title || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(enrollment.enrolledAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{enrollment.whatsapp || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge label={enrollment.enrollmentStatus} variant={enrollmentStatusVariant(enrollment.enrollmentStatus)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedId(enrollment.id)
                              open()
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          {enrollment.enrollmentStatus !== EnrollmentStatus.Approved && (
                            <button
                              onClick={() => handleApprove(enrollment.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {enrollment.enrollmentStatus !== EnrollmentStatus.Rejected && (
                            <button
                              onClick={() => handleReject(enrollment.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredEnrollments.length > 0 && (
          <TableFooter filteredCount={filteredEnrollments.length} totalCount={enrollments.length} label="enrollments" />
        )}
      </div>

      {isOpen && (
        <PaymentModal
          isOpen={isOpen}
          onClose={close}
          selectedId={selectedId}
        />
      )}
    </div>
  )
}

export default EnrollmentPage
