import React from 'react'
import ArrowIcon from '../common/arrow-icon'
import { redirect } from 'next/navigation'

interface CourseCardProps {
  id: string
  title: string
  description: string
  price: number
  duration: string
  category: string
}


const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  price,
  duration,
  category,
}) => {

  return (
    <div className={`
  group relative overflow-hidden rounded-2xl 
  bg-linear-to-br from-gray-700 to-gray-900
  shadow-lg hover:shadow-2xl 
  transition-all duration-500 
  hover:-translate-y-1
  transform
`}>
      {/* Decorative top corner */}
      <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 rounded-full bg-white/10" />

      {/* Card content */}
      <div className="relative p-6 h-full flex flex-col">
        {/* Icon and title row */}
        <div className="mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white leading-tight line-clamp-2">{title}</h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="inline-flex px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20 hover:bg-white/15 transition-colors duration-300">
                  {category}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-white">₹{price}</p>
                <div className="flex items-center gap-1 text-white/60 text-sm mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 grow">
          <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Action button */}
        <button onClick={() => redirect(`/student/courses/${id}`)} className="
      flex items-center justify-between 
      w-full px-5 py-4 
      bg-white/10 hover:bg-white/20 
      backdrop-blur-sm 
      rounded-xl 
      text-white 
      transition-all duration-300 
      group/btn
      border border-white/20 hover:border-white/30
      hover:scale-[1.02]
    ">
          <span className="font-semibold text-sm tracking-wide">VIEW COURSE DETAILS</span>
          <div className="flex items-center">
            <ArrowIcon />
          </div>
        </button>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500  pointer-events-none" />
      </div>
    </div>
  )
}

export default CourseCard