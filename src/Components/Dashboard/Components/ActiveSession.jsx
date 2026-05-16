export default function ActiveSession({ sessionData }) {
  const session = sessionData || {
    id: "S2028",
    notes: [
      "Enrollment for this session will close at 18-01-2028",
      "Add Course Period 08-01-2028 - 08-02-2028",
      "Drop Course Period 26-01-2028 - 08-02-2028",
      "Withdrawal Period 02-03-2028 - 22-05-2028"
    ]
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Active Session</h2>
      <div className="mb-4">
        <span className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold inline-block">
          {session.id}
        </span>
      </div>
      
      <div className="bg-slate-800 text-white p-6 rounded-lg">
        <p className="font-semibold mb-3">Note:</p>
        <ul className="space-y-2">
          {session.notes.map((note, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-teal-400 mt-1">•</span>
              <span className="text-sm">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
