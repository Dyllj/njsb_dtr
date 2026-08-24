function WeeklyAttendanceCard() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="mt-10 w-full max-w-[calc(100vw-18rem)] flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <h3 className="text-lg font-semibold">Weekly Attendance</h3>
      <p className="text-slate-500">View your weekly attendance statistics.</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-left text-sm">
          <thead>
            <tr className="divide-x divide-slate-100 border-b border-slate-200">
              <th className="py-2 pr-4 font-medium text-slate-500">Name</th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2 text-center font-medium text-slate-500">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* map intern attendance rows here, e.g.:
            {interns.map((intern) => (
              <tr key={intern.id} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-medium text-slate-900">{intern.name}</td>
                {days.map((day) => (
                  <td key={day} className="px-4 py-2 text-center text-slate-700">
                    {intern.attendance[day] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeeklyAttendanceCard;