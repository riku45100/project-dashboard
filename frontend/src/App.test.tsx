import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App navigation', () => {
  it('shows the overview by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Project summary' })).toBeInTheDocument();
  });

  it('switches to the Kanban view', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Kanban' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Kanban' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Kanban board' })).toBeInTheDocument();
  });

  it('switches to the Imports view from the header button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'View data sources' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Imports' })).toBeInTheDocument();
    expect(screen.getByText('Microsoft Project · .mpp')).toBeInTheDocument();
  });

  it('marks the active navigation item', async () => {
    const user = userEvent.setup();
    render(<App />);
    const jobsButton = screen.getByRole('button', { name: 'Jobs' });
    await user.click(jobsButton);
    expect(jobsButton).toHaveAttribute('aria-current', 'page');
  });
});

describe('Overview', () => {
  it('shows summary statistics', () => {
    render(<App />);
    expect(screen.getByText('Projects in view')).toBeInTheDocument();
    expect(screen.getByText('Tasks in view')).toBeInTheDocument();
    expect(screen.getByText('Overdue schedule tasks')).toBeInTheDocument();
    expect(screen.getByText('Blocked cards')).toBeInTheDocument();
  });

  it('lists overdue and blocked tasks under needs attention', () => {
    render(<App />);
    const attention = screen.getByRole('heading', { name: 'Needs attention' }).closest('section');
    expect(attention).not.toBeNull();
    expect(within(attention as HTMLElement).getByText(/Approve equipment order/)).toBeInTheDocument();
    expect(within(attention as HTMLElement).getByText(/Resolve access requirements/)).toBeInTheDocument();
  });
});

describe('Kanban board', () => {
  it('renders all five columns', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Kanban' }));
    for (const column of ['To Do', 'In Progress', 'Blocked', 'Review', 'Done']) {
      expect(screen.getByRole('region', { name: column })).toBeInTheDocument();
    }
  });

  it('changes a task status without changing schedule progress', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Kanban' }));
    const card = screen.getByText('Confirm installation schedule').closest('article');
    expect(card).not.toBeNull();
    const selector = within(card as HTMLElement).getByLabelText('Board status');
    await user.selectOptions(selector, 'In Progress');
    expect(within(screen.getByRole('region', { name: 'In Progress' })).getByText('Confirm installation schedule')).toBeInTheDocument();
    expect(within(card as HTMLElement).getByText('Schedule progress: 0%')).toBeInTheDocument();
  });

  it('moves a blocked task to Review', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Kanban' }));
    const card = screen.getByText('Approve equipment order').closest('article');
    const selector = within(card as HTMLElement).getByLabelText('Board status');
    await user.selectOptions(selector, 'Review');
    expect(within(screen.getByRole('region', { name: 'Review' })).getByText('Approve equipment order')).toBeInTheDocument();
  });
});

describe('Filtering', () => {
  it('filters tasks by project', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Project'), 'JOB-001');
    expect(screen.getByText('Confirm installation schedule')).toBeInTheDocument();
    expect(screen.queryByText('Approve equipment order')).not.toBeInTheDocument();
  });

  it('filters tasks by search text', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/Search tasks, jobs or staff/i), 'drawings');
    expect(screen.getByText('Prepare site drawings')).toBeInTheDocument();
    expect(screen.queryByText('Confirm installation schedule')).not.toBeInTheDocument();
  });

  it('restores the demo data with Reset demo', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText('Project'), 'JOB-001');
    await user.click(screen.getByRole('button', { name: 'Reset demo' }));
    expect(screen.getByLabelText('Project')).toHaveValue('all');
    expect(screen.getByText('Approve equipment order')).toBeInTheDocument();
  });
});

describe('Jobs and staff views', () => {
  it('shows the jobs directory', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Jobs' }));
    expect(screen.getByRole('heading', { name: 'Jobs directory' })).toBeInTheDocument();
    expect(screen.getByText('North site installation')).toBeInTheDocument();
  });

  it('shows staff assignment cards', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Staff' }));
    expect(screen.getByRole('heading', { name: 'Alex Morgan' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sam Taylor' })).toBeInTheDocument();
  });
});
