'use client'

import { fetchEnrollements } from '@/store/enrollment/enrollmentSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { useEffect } from 'react'

const EnrollmentPage = () => {

    const { Enrollments } = useAppSelector((store) => store.enrollments)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchEnrollements())
    }, [dispatch])

    console.log(Enrollments)

    return (
        <div>EnrollmentPage</div>
    )
}

export default EnrollmentPage