import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList';

const defaultProps = {
  tasks: [],
  loading: false,
  error: null,
  onDismissError: jest.fn(),
  sort: 'created_at',
  onSortChange: jest.fn(),
  onDelete: jest.fn(),
  onToggleComplete: jest.fn(),
  onEditName: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskList', () => {
  test('shows loading spinner when loading is true', () => {
    render(<TaskList {...defaultProps} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('does not show task list while loading', () => {
    const tasks = [{ id: 1, name: 'Hidden Task', completed: 0, due_date: null }];
    render(<TaskList {...defaultProps} loading={true} tasks={tasks} />);
    expect(screen.queryByText('Hidden Task')).not.toBeInTheDocument();
  });

  test('shows error alert when error is provided', () => {
    render(<TaskList {...defaultProps} error="Something went wrong" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('calls onDismissError when alert close button is clicked', async () => {
    const onDismissError = jest.fn();
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} error="An error" onDismissError={onDismissError} />);
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onDismissError).toHaveBeenCalled();
  });

  test('shows empty state message when tasks array is empty', () => {
    render(<TaskList {...defaultProps} tasks={[]} />);
    expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
  });

  test('renders all provided tasks', () => {
    const tasks = [
      { id: 1, name: 'Task Alpha', completed: 0, due_date: null },
      { id: 2, name: 'Task Beta', completed: 0, due_date: null },
    ];
    render(<TaskList {...defaultProps} tasks={tasks} />);
    expect(screen.getByText('Task Alpha')).toBeInTheDocument();
    expect(screen.getByText('Task Beta')).toBeInTheDocument();
  });

  test('calls onSortChange with due_date when due date button is clicked', async () => {
    const onSortChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} onSortChange={onSortChange} />);
    await user.click(screen.getByRole('button', { name: /sort by due date/i }));
    expect(onSortChange).toHaveBeenCalledWith('due_date');
  });

  test('calls onSortChange with created_at when newest button is clicked', async () => {
    const onSortChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} sort="due_date" onSortChange={onSortChange} />);
    await user.click(screen.getByRole('button', { name: /sort by newest/i }));
    expect(onSortChange).toHaveBeenCalledWith('created_at');
  });

  test('does not call onSortChange when already-active button is clicked', async () => {
    const onSortChange = jest.fn();
    const user = userEvent.setup();
    render(<TaskList {...defaultProps} sort="created_at" onSortChange={onSortChange} />);
    // Clicking the already-selected toggle returns null from MUI, guarded by `val &&`
    await user.click(screen.getByRole('button', { name: /sort by newest/i }));
    expect(onSortChange).not.toHaveBeenCalled();
  });
});
