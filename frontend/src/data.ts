export const statuses = ['To Do', 'In Progress', 'Blocked', 'Review', 'Done'] as const;
export type Status = typeof statuses[number];
export type View = 'Overview' | 'Kanban' | 'Jobs' | 'Staff' | 'Imports';
export interface Task {
  id: string; project: string; title: string; assignee: string;
  due: string; progress: number; status: Status; source: string;
}
export const demoToday = '2026-10-31';
export const demoTasks: Task[] = [
  { id: 'T-101', project: 'JOB-001', title: 'Confirm installation schedule', assignee: 'Alex Morgan', due: '2026-11-04', progress: 0, status: 'To Do', source: 'Sample .mpp' },
  { id: 'T-102', project: 'JOB-001', title: 'Prepare site drawings', assignee: 'Sam Taylor', due: '2026-11-02', progress: 55, status: 'In Progress', source: 'Sample .mpp' },
  { id: 'T-103', project: 'JOB-002', title: 'Approve equipment order', assignee: 'Jamie Lee', due: '2026-10-29', progress: 30, status: 'Blocked', source: 'Sample .mpp' },
  { id: 'T-104', project: 'JOB-002', title: 'Review handover checklist', assignee: 'Alex Morgan', due: '2026-11-01', progress: 100, status: 'Review', source: 'Sample .mpp' },
  { id: 'T-105', project: 'JOB-003', title: 'Complete initial survey', assignee: 'Sam Taylor', due: '2026-10-28', progress: 100, status: 'Done', source: 'Sample .mpp' },
  { id: 'T-106', project: 'JOB-003', title: 'Resolve access requirements', assignee: 'Jamie Lee', due: '2026-10-30', progress: 20, status: 'In Progress', source: 'Sample .mpp' },
];
export const demoJobs = [
  { id: 'JOB-001', name: 'North site installation', customer: 'Sample Customer A', source: 'Sample jobs.xlsx' },
  { id: 'JOB-002', name: 'Workshop upgrade', customer: 'Sample Customer B', source: 'Sample jobs.xlsx' },
  { id: 'JOB-003', name: 'Service programme', customer: 'Sample Customer C', source: 'Sample jobs.xlsx' },
];
export function isOverdue(task: Task) { return task.due < demoToday && task.progress < 100; }
export function formatDate(value: string) { const [year, month, day] = value.split('-'); return `${day}/${month}/${year}`; }
