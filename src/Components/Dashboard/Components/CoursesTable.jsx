import { MoreVertical } from 'lucide-react'

export default function CoursesTable({ title, courses }) {
  const defaultCourses = [
    { srno: 1, code: "CS309", name: "Advanced Algorithms Analysis", crHrs: 3, section: "A", instructor: "Dr. Abid Ullah", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 2, code: "CS501", name: "Advanced Operating Systems", crHrs: 3, section: "A", instructor: "Dr. Khawaja M. Umar Sulaiman", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 3, code: "CY322", name: "Applied Cryptography", crHrs: 3, section: "A", instructor: "Dr. Muhammad Ali Humayun", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 4, code: "CS320", name: "Blockchain", crHrs: 3, section: "A", instructor: "Dr. Umar Janjua", offeredBy: "CS", status: "Status Approved", action: "Not Applicable" },
  ]

  const data = courses || defaultCourses

  const getStatusColor = (status) => {
    if (status.includes("Approved")) return "bg-teal-600"
    if (status.includes("Not Uploaded")) return "bg-orange-500"
    return "bg-gray-600"
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold">Sr.no</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Course Code</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Course Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Cr-Hrs</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Section</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Instructor</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Offered by</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((course, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-sm text-gray-800">{course.srno}</td>
                <td className="px-4 py-3 text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                  {course.code}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{course.name}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{course.crHrs}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{course.section}</td>
                <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer hover:underline">
                  {course.instructor}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{course.offeredBy}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`${getStatusColor(course.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {course.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
