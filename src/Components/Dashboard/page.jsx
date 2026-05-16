import StudentInfo from "./Components/StudentInfo"
import ActiveSession from "./Components/ActiveSession"
import CoursesTable from "./Components/CoursesTable"
import { LogOut } from 'lucide-react'

const Dashboard = () => {
  const studentData = {
    name: "Muhammad Abdullah Zahid",
    rollNumber: "BSCS22111",
    cnic: "35202-7001251-7",
    section: "A"
  }

  const offeredCourses = [
    { srno: 1, code: "CS309", name: "Advanced Algorithms Analysis", crHrs: 3, section: "A", instructor: "Dr. Abid Ullah", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 2, code: "CS501", name: "Advanced Operating Systems", crHrs: 3, section: "A", instructor: "Dr. Khawaja M. Umar Sulaiman", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 3, code: "CY322", name: "Applied Cryptography", crHrs: 3, section: "A", instructor: "Dr. Muhammad Ali Humayun", offeredBy: "CS", status: "Not Uploaded", action: "Not Applicable" },
    { srno: 4, code: "CS320", name: "Blockchain", crHrs: 3, section: "A", instructor: "Dr. Umar Janjua", offeredBy: "CS", status: "Status Approved", action: "Not Applicable" },
  ]

  const additionalCourses = [
    { srno: 1, code: "MG452", name: "Business Finance", crHrs: 3, section: "A", instructor: "Dr. Saud Ahmad", offeredBy: "CS", status: "Status Approved", action: "Not Applicable" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logout */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
        <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-6">
        <StudentInfo student={studentData} />
        <ActiveSession />
        <CoursesTable title="Offered Courses" courses={offeredCourses} />
        <CoursesTable title="Additional Courses" courses={additionalCourses} />
      </div>
    </div>
  )
}

export default Dashboard