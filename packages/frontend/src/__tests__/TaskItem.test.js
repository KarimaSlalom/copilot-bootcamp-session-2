import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../components/TaskItem';

const baseTask = {
  id: 1,
  name: 'Test Task',
  completed: 0,
  due_date: null,
};

const noop = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaskItem', () => {
  test('renders task name', () => {
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('renders due date chip when due_date is set', () => {
    const task = { ...baseTask, due_date: '2099-06-15' };
    render(<TaskItem task={task} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);
    expect(screen.getByText('2099-06-15')).toBeInTheDocument();
  });

  test('does not render due date chip when due_date is null', () => {
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);
    expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
  });

  test('renders with strikethrough when task is completed', () => {
    const task = { ...baseTask, completed: 1 };
    render(<TaskItem task={task} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);
    expect(screen.getByText('Test Task')).toHaveStyle({ textDecoration: 'line-through' });
  });

  test('calls onToggleComplete with true when uncompleted task checkbox is clicked', async () => {
    const onToggleComplete = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={onToggleComplete} onEditName={noop} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggleComplete).toHaveBeenCalledWith(1, true);
  });

  test('calls onToggleComplete with false when completed task checkbox is clicked', async () => {
    const onToggleComplete = jest.fn();
    const user = userEvent.setup();
    const task = { ...baseTask, completed: 1 };
    render(<TaskItem task={task} onDelete={noop} onToggleComplete={onToggleComplete} onEditName={noop} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggleComplete).toHaveBeenCalledWith(1, false);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const onDelete = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={onDelete} onToggleComplete={noop} onEditName={noop} />);
    await user.click(screen.getByRole('button', { name: /delete "Test Task"/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('enters edit mode and shows text field when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);
    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    expect(screen.getByRole('textbox', { name: /edit task name/i })).toBeInTheDocument();
  });

  test('calls onEditName and exits edit mode when save is clicked', async () => {
    const onEditName = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={onEditName} />);

    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    const input = screen.getByRole('textbox', { name: /edit task name/i });
    await user.clear(input);
    await user.type(input, 'Updated Name');
    await user.click(screen.getByRole('button', { name: /save edit/i }));

    expect(onEditName).toHaveBeenCalledWith(1, 'Updated Name');
    expect(screen.queryByRole('textbox', { name: /edit task name/i })).not.toBeInTheDocument();
  });

  test('does not call onEditName when name is unchanged', async () => {
    const onEditName = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={onEditName} />);

    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    await user.click(screen.getByRole('button', { name: /save edit/i }));

    expect(onEditName).not.toHaveBeenCalled();
  });

  test('cancels edit and restores name when cancel is clicked', async () => {
    const onEditName = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={onEditName} />);

    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    const input = screen.getByRole('textbox', { name: /edit task name/i });
    await user.clear(input);
    await user.type(input, 'Something else');
    await user.click(screen.getByRole('button', { name: /cancel edit/i }));

    expect(onEditName).not.toHaveBeenCalled();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('saves edit on Enter key', async () => {
    const onEditName = jest.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={onEditName} />);

    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    const input = screen.getByRole('textbox', { name: /edit task name/i });
    await user.clear(input);
    await user.type(input, 'Enter Name{Enter}');

    expect(onEditName).toHaveBeenCalledWith(1, 'Enter Name');
  });

  test('cancels edit on Escape key', async () => {
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onDelete={noop} onToggleComplete={noop} onEditName={noop} />);

    await user.click(screen.getByRole('button', { name: /edit "Test Task"/i }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('textbox', { name: /edit task name/i })).not.toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
