'use client'

import { useParams } from 'next/navigation'
import React from 'react'

const CourseDetailPage = () => {
    const { id } = useParams()
    return (
        <div>CourseDetailPage : {id}</div>
    )
}

export default CourseDetailPage