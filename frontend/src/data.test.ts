import { describe, expect, it } from 'vitest';
import { demoTasks, demoToday, formatDate, isOverdue } from './data';

describe('formatDate', () => {
  it('formats ISO dates as DD/MM/YYYY', () => {
    expect(formatDate('2026-11-04')).toBe('04/11/2026');
  });

  it('keeps leading zeroes in day and month', () => {
    expect(formatDate('2026-01-05')).toBe('05/01/2026');
  });
});

describe('isOverdue', () => {
  const task = {
    id: 'test-task',
    project: 'JOB-TEST',
    title: 'Test task',
    assignee: 'Test person',
    due: '2026-10-30',
    progress: 0,
    status: 'To Do' as const,
    source: 'Test',
  };

  it('marks an incomplete past task as overdue', () => {
    expect(isOverdue({ ...task, due: '2026-10-30', progress: 20 })).toBe(true);
  });

  it('does not mark a complete past task as overdue', () => {
    expect(isOverdue({ ...task, due: '2026-10-30', progress: 100 })).toBe(false);
  });

  it('does not mark an incomplete future task as overdue', () => {
    expect(isOverdue({ ...task, due: '2026-11-30', progress: 20 })).toBe(false);
  });

  it('uses the deterministic demo reference date', () => {
    expect(demoToday).toBe('2026-10-31');
  });
});

describe('demoTasks', () => {
  it('contains at least one task in each board status', () => {
    const statuses = new Set(demoTasks.map(task => task.status));
    expect(statuses).toEqual(new Set(['To Do', 'In Progress', 'Blocked', 'Review', 'Done']));
  });

  it('has unique task IDs', () => {
    const ids = demoTasks.map(task => task.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
