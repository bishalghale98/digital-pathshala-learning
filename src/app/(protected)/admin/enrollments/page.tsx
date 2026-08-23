'use client'

import PaymentModal from '@/components/enrollment/payment-modal'
import { EnrollmentStatus } from '@/schemas/enrollmentSchema'
import {
  useChangeEnrollmentStatusMutation,
  useGetEnrollmentsQuery,
  type Enrollment,
} from '@/store/enrollment/enrollmentApi'
import { getErrorMessage } from '@/store/api/base'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Search, X, CheckCircle, XCircle, ClipboardList } from 'lucide-react'

const getStudent = (enrollment: Enrollment) =>
  typeof enrollment.studentId === 'object' ? enrollment.studentId : null
const getCourse = (enrollment: Enrollment) =>
  typeof enrollment.courseId === 'object' ? enrollment.courseId : null

type StatusFilter = 'all' | 'Approved' | 'Pending' | 'Rejected'

const EnrollmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedId, setSelectedId] = useState('')

  const { data: enrollments = [], isLoading } = useGetEnrollmentsQuery()
  const [changeEnrollmentStatus] = useChangeEnrollmentStatusMutation()

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesSearch =
        !searchTerm ||
        getStudent(enrollment)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCourse(enrollment)?.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || enrollment.enrollmentStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [enrollments, searchTerm, statusFilter])

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

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage student course enrollments
          </p>
        </div>
      </div>

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
      <div className="relative w-full sm:w-72 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student or course..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading enrollments...
                  </td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <ClipboardList className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-900">
                        {searchTerm || statusFilter !== 'all' ? 'No enrollments found' : 'No enrollments yet'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your filters'
                          : 'Enrollments will appear here when students enroll'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => {
                  const student = getStudent(enrollment)
                  const course = getCourse(enrollment)
                  return (
                    <tr key={enrollment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{student?.name || '—'}</p>
                        <p className="text-xs text-gray-500">{student?.email || ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{course?.title || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{enrollment.whatsapp || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={enrollment.enrollmentStatus} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedId(enrollment._id)
                              setIsOpenModal(true)
                            }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          {enrollment.enrollmentStatus !== EnrollmentStatus.Approved && (
                            <button
                              onClick={() => handleApprove(enrollment._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {enrollment.enrollmentStatus !== EnrollmentStatus.Rejected && (
                            <button
                              onClick={() => handleReject(enrollment._id)}
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
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing <span className="font-medium">{filteredEnrollments.length}</span> of{' '}
              <span className="font-medium">{enrollments.length}</span> enrollments
            </p>
          </div>
        )}
      </div>

      {isOpenModal && (
        <PaymentModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          selectedId={selectedId}
        />
      )}
    </div>
  )
}

const StatusBadge = ({ status }: { status: EnrollmentStatus }) => {
  const styles: Record<string, string> = {
    [EnrollmentStatus.Approved]: 'bg-green-50 text-green-700',
    [EnrollmentStatus.Pending]: 'bg-yellow-50 text-yellow-700',
    [EnrollmentStatus.Rejected]: 'bg-red-50 text-red-700',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-700'}`}>
      {status}
    </span>
  )
}

export default EnrollmentPage
