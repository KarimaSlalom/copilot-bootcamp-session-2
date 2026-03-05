import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskForm from '../components/AddTaskForm';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AddTaskForm', () => {
  test('renders the name input and submit button', () => {
    render(<AddTaskForm onAdd={jest.fn()} />);
    expect(screen.getByRole('textbox', { name: /task name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  test('calls onAdd with trimmed name and null due date when no date provided', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={onAdd} />);

    await user.type(screen.getByRole('textbox', { name: /task name/i }), '  My Task  ');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith('My Task', null);
  });

  test('calls onAdd with name and due date when both are provided', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={onAdd} />);

    await user.type(screen.getByRole('textbox', { name: /task name/i }), 'Task with date');
    await user.type(screen.getByLabelText(/due date/i), '2099-12-31');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).toHaveBeenCalledWith('Task with date', '2099-12-31');
  });

  test('does not call onAdd when name is empty', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={onAdd} />);

    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  test('does not call onAdd when name is whitespace only', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={onAdd} />);

    await user.type(screen.getByRole('textbox', { name: /task name/i }), '   ');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  test('clears name and date inputs after successful submit', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(<AddTaskForm onAdd={onAdd} />);

    const nameInput = screen.getByRole('textbox', { name: /task name/i });
    const dateInput = screen.getByLabelText(/due date/i);
    await user.type(nameInput, 'A task');
    await user.type(dateInput, '2099-01-01');
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(nameInput).toHaveValue('');
    expect(dateInput).toHaveValue('');
  });
});
