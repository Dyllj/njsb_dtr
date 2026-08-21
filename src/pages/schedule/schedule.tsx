const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

type ScheduleEntry = {
  intern: string;
  shift: string;
};

const schedule: Record<string, ScheduleEntry[]> = {
  Mon: [{ intern: 'Juan Dela Cruz', shift: '8:00 AM - 5:00 PM' }],
  Tue: [{ intern: 'Juan Dela Cruz', shift: '8:00 AM - 5:00 PM' }],
  Wed: [{ intern: 'Maria Santos', shift: '1:00 PM - 5:00 PM' }],
  Thu: [{ intern: 'Juan Dela Cruz', shift: '8:00 AM - 5:00 PM' }],
  Fri: [{ intern: 'Pedro Reyes', shift: '8:00 AM - 12:00 PM' }],
};

function Schedule() {
  return (
    <>
      <h2 className="text-xl font-semibold">Schedule</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {days.map((day) => {
          const entries = schedule[day] ?? [];
          return (
            <div key={day} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{day}</p>
              <div className="mt-3 space-y-2">
                {entries.map((entry, index) => (
                  <div key={index} className="rounded-lg bg-red-800/5 px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{entry.intern}</p>
                    <p className="text-xs text-slate-500">{entry.shift}</p>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-xs text-slate-400">No interns scheduled</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Schedule;