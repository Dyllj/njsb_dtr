function DailyAttendanceCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#e7ebf2] bg-[#f9f9f8] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]">
      <h3 className="text-lg font-semibold">Daily Attendance</h3>
      <p className="text-slate-500">View your daily attendance statistics.</p>
    </div>
  );
};
export default DailyAttendanceCard;