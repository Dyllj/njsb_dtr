function Settings() {
  return (
    <>
      <h2 className="text-xl font-semibold">Settings</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Company Information</h3>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-slate-500">Company Name</span>
              <input
                type="text"
                defaultValue="NJSB"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-red-800 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500">Office Location</span>
              <input
                type="text"
                placeholder="Set geofence location"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-red-800 focus:outline-none"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">Attendance Rules</h3>
          <div className="mt-4 space-y-3">
            <label className="block text-sm">
              <span className="text-slate-500">Grace Period (minutes)</span>
              <input
                type="number"
                defaultValue={15}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-red-800 focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500">Required OJT Hours</span>
              <input
                type="number"
                defaultValue={486}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-red-800 focus:outline-none"
              />
            </label>
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
          Save Changes
        </button>
      </div>
    </>
  );
}

export default Settings;