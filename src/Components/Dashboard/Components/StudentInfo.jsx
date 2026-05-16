import { Users, Banknote, Hash, BookOpen } from 'lucide-react'

export default function StudentInfo({ student }) {
  return (
    <div className="bg-slate-800 text-white p-6 rounded-lg mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5" />
          <div>
            <p className="text-sm text-gray-300">Student Name</p>
            <p className="font-semibold">{student?.name || "Muhammad Abdullah Zahid"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5" />
          <div>
            <p className="text-sm text-gray-300">Roll Number</p>
            <p className="font-semibold">{student?.rollNumber || "BSCS22111"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Banknote className="w-5 h-5" />
          <div>
            <p className="text-sm text-gray-300">CNIC</p>
            <p className="font-semibold">{student?.cnic || "35202-7001251-7"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" />
          <div>
            <p className="text-sm text-gray-300">Section</p>
            <p className="font-semibold">{student?.section || "A"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
