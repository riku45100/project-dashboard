import { useState } from 'react';
import { demoJobs, demoTasks, demoToday, formatDate, isOverdue, statuses } from './data';
import type { Status, Task, View } from './data';

const views: View[] = ['Overview', 'Kanban', 'Jobs', 'Staff', 'Imports'];
const colours: Record<Status, string> = {
  'To Do': 'border-t-slate-500', 'In Progress': 'border-t-cyan-400',
  Blocked: 'border-t-rose-400', Review: 'border-t-amber-400', Done: 'border-t-emerald-400',
};

function TaskCard({ task, onStatus }: { task: Task; onStatus: (id: string, status: Status) => void }) {
  return <article className="rounded-xl border border-slate-700 bg-slate-950/80 p-4">
    <div className="flex items-center justify-between gap-2 text-xs text-slate-400"><span>{task.project}</span><span>{task.id}</span></div>
    <h3 className="mt-3 font-medium text-slate-100">{task.title}</h3>
    <p className="mt-3 text-sm text-slate-400">{task.assignee}</p>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs"><span className="text-slate-400">Due {formatDate(task.due)}</span>{isOverdue(task) && <span className="rounded bg-rose-500/15 px-2 py-1 text-rose-300">Overdue</span>}</div>
    <label className="mt-4 block text-xs text-slate-400">Schedule progress: {task.progress}%<progress className="mt-2 block h-2 w-full accent-cyan-400" value={task.progress} max={100} /></label>
    <label className="mt-4 block text-xs text-slate-400">Board status<select className="field mt-1 w-full" value={task.status} onChange={event => onStatus(task.id, event.target.value as Status)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
    <p className="mt-3 text-xs text-slate-500">{task.source} · demo record</p>
  </article>;
}

export default function App() {
  const [view, setView] = useState<View>('Overview');
  const [tasks, setTasks] = useState<Task[]>(() => demoTasks.map(task => ({ ...task })));
  const [search, setSearch] = useState('');
  const [project, setProject] = useState('all');
  const matchesProject = (id: string) => project === 'all' || project === id;
  const query = search.trim().toLowerCase();
  const filtered = tasks.filter(task => matchesProject(task.project) && `${task.title} ${task.assignee} ${task.id} ${task.project}`.toLowerCase().includes(query));
  const filteredJobs = demoJobs.filter(job => matchesProject(job.id) && `${job.id} ${job.name} ${job.customer}`.toLowerCase().includes(query));
  const staff = [...new Set(tasks.map(task => task.assignee))].map(name => ({ name, assignments: filtered.filter(task => task.assignee === name) })).filter(person => person.assignments.length > 0);
  const stats = [
    { label: 'Projects in view', value: new Set(filtered.map(task => task.project)).size },
    { label: 'Tasks in view', value: filtered.length },
    { label: 'Overdue schedule tasks', value: filtered.filter(isOverdue).length },
    { label: 'Blocked cards', value: filtered.filter(task => task.status === 'Blocked').length },
  ];
  function updateStatus(id: string, status: Status) { setTasks(current => current.map(task => task.id === id ? { ...task, status } : task)); }

  return <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-slate-950 focus:p-3">Skip to content</a>
    <aside className="border-b border-slate-800 bg-slate-950/70 p-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 font-bold text-cyan-300">FZ</span><div><p className="font-semibold tracking-wide">FourZero</p><p className="text-xs text-slate-400">Project workspace</p></div></div>
      <nav aria-label="Main navigation" className="mt-7 flex flex-wrap gap-2 lg:flex-col">{views.map(item => <button key={item} type="button" aria-current={view === item ? 'page' : undefined} onClick={() => setView(item)} className={`rounded-xl px-4 py-3 text-left text-sm transition-colors ${view === item ? 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>{item}</button>)}</nav>
      <div className="mt-7 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-200">Frontend preview<br />Sample data only. No live connections or authentication.</div>
    </aside>
    <div className="min-w-0">
      <header className="border-b border-slate-800 px-5 py-5 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Operations workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">{view}</h1></div><button type="button" onClick={() => setView('Imports')} className="rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200">View data sources</button></div></header>
      <main id="main" className="space-y-6 p-5 sm:p-8">
        <div className="panel flex flex-wrap items-end gap-4 p-4"><label className="min-w-0 flex-1 text-xs text-slate-400">Search tasks, jobs or staff<input className="field mt-2 w-full" type="search" placeholder="Search demo records…" value={search} onChange={event => setSearch(event.target.value)} /></label><label className="text-xs text-slate-400">Project<select className="field mt-2 block w-full sm:w-48" value={project} onChange={event => setProject(event.target.value)}><option value="all">All projects</option>{demoJobs.map(job => <option key={job.id} value={job.id}>{job.id}</option>)}</select></label><button type="button" className="field hover:border-cyan-400" onClick={() => { setTasks(demoTasks.map(task => ({ ...task }))); setSearch(''); setProject('all'); }}>Reset demo</button></div>
        <p className="text-xs leading-5 text-slate-400">Demo reference date: {formatDate(demoToday)}. Overdue means finish date before this date and schedule progress below 100%. Status changes are temporary and do not change schedule progress.</p>
        {view === 'Overview' && <>
          <section aria-label="Project summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(stat => <div key={stat.label} className="panel p-5"><p className="text-sm text-slate-400">{stat.label}</p><p className="mt-3 text-3xl font-semibold text-cyan-200">{stat.value}</p></div>)}</section>
          <section className="panel p-5"><h2 className="text-lg font-semibold">Board distribution</h2><p className="mt-1 text-sm text-slate-400">Counts use the current task filters.</p><div className="mt-5 grid gap-3 sm:grid-cols-5">{statuses.map(status => <button key={status} type="button" onClick={() => setView('Kanban')} className={`rounded-xl border border-slate-800 border-t-2 p-4 text-left hover:bg-slate-800 ${colours[status]}`}><p className="text-xs text-slate-400">{status}</p><p className="mt-2 text-2xl">{filtered.filter(task => task.status === status).length}</p></button>)}</div></section>
          <section className="panel p-5"><h2 className="text-lg font-semibold">Needs attention</h2><div className="mt-4 space-y-3">{filtered.filter(task => isOverdue(task) || task.status === 'Blocked').map(task => <div key={task.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-slate-800 p-3 text-sm"><span>{task.project} · {task.title}</span><span className="text-amber-300">{task.status} · Due {formatDate(task.due)}</span></div>)}{!filtered.some(task => isOverdue(task) || task.status === 'Blocked') && <p className="text-sm text-slate-400">No matching tasks need attention.</p>}</div></section>
        </>}
        {view === 'Kanban' && <section aria-label="Kanban board"><p className="mb-4 text-sm text-slate-400">Change status using each card’s selector. Drag-and-drop and persistence are not implemented yet.</p><div className="overflow-x-auto pb-4"><div className="grid min-w-[1400px] grid-cols-5 gap-4">{statuses.map(status => <section key={status} aria-label={status} className={`panel min-h-80 border-t-2 p-3 ${colours[status]}`}><h2 className="mb-4 flex items-center justify-between px-1 text-sm font-semibold">{status}<span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">{filtered.filter(task => task.status === status).length}</span></h2><div className="space-y-3">{filtered.filter(task => task.status === status).map(task => <TaskCard key={task.id} task={task} onStatus={updateStatus} />)}{!filtered.some(task => task.status === status) && <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">No matching tasks</p>}</div></section>)}</div></div></section>}
        {view === 'Jobs' && <section className="panel overflow-hidden"><h2 className="p-5 text-lg font-semibold">Jobs directory</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Sample jobs matching the current filters</caption><thead className="bg-slate-950 text-slate-400"><tr>{['Reference', 'Job', 'Customer', 'Tasks', 'Source'].map(label => <th key={label} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{filteredJobs.map(job => <tr key={job.id} className="border-t border-slate-800"><td className="px-5 py-4 text-cyan-300">{job.id}</td><td className="px-5 py-4">{job.name}</td><td className="px-5 py-4 text-slate-400">{job.customer}</td><td className="px-5 py-4">{tasks.filter(task => task.project === job.id).length}</td><td className="px-5 py-4 text-slate-400">{job.source}</td></tr>)}</tbody></table></div>{filteredJobs.length === 0 && <p className="p-5 text-sm text-slate-400">No matching jobs.</p>}</section>}
        {view === 'Staff' && <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{staff.map(person => <article key={person.name} className="panel p-5"><h2 className="font-semibold">{person.name}</h2><p className="mt-2 text-sm text-cyan-300">{person.assignments.length} matching assignments</p><ul className="mt-4 space-y-2 text-sm text-slate-400">{person.assignments.map(task => <li key={task.id}>{task.project} · {task.title}</li>)}</ul><p className="mt-4 text-xs text-slate-500">Task counts only; not a capacity or hours calculation.</p></article>)}{staff.length === 0 && <p className="text-sm text-slate-400">No matching staff assignments.</p>}</section>}
        {view === 'Imports' && <section className="panel p-6"><h2 className="text-lg font-semibold">Data connections</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">No files have been imported. This frontend has no backend, credentials, or file-processing functionality. Filters do not apply to this setup view.</p><div className="mt-6 grid gap-4 md:grid-cols-2">{['Microsoft Project · .mpp', 'Excel workbook · .xlsx'].map(label => <div key={label} className="rounded-xl border border-dashed border-slate-700 p-5"><h3 className="font-medium">{label}</h3><p className="mt-2 text-sm text-slate-400">Not connected</p><p className="mt-3 text-xs text-slate-500">Upload, validation and column mapping will be added with the backend.</p></div>)}</div></section>}
        <footer className="border-t border-slate-800 pt-5 text-xs text-slate-500">FourZero Project Dashboard · Frontend foundation · Changes reset on reload · Not a secure production deployment</footer>
      </main>
    </div>
  </div>;
}
