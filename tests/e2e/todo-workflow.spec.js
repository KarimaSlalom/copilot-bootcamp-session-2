const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('To Do App - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should display the app header', async () => {
    await expect(todoPage.heading).toBeVisible();
  });

  test('should add a new task and see it in the list', async () => {
    const taskName = `E2E Task ${Date.now()}`;
    await todoPage.addTask(taskName);

    await expect(todoPage.getTaskItem(taskName)).toBeVisible();
  });

  test('should delete a task and confirm it disappears', async () => {
    const taskName = `Task to delete ${Date.now()}`;
    await todoPage.addTask(taskName);
    await expect(todoPage.getTaskItem(taskName)).toBeVisible();

    await todoPage.deleteTask(taskName);

    await expect(todoPage.getTaskItem(taskName)).not.toBeVisible();
  });

  test('should mark a task as complete and show strikethrough', async () => {
    const taskName = `Task to complete ${Date.now()}`;
    await todoPage.addTask(taskName);

    await todoPage.toggleComplete(taskName);

    const taskText = todoPage.page.getByText(taskName, { exact: true });
    await expect(taskText).toHaveCSS('text-decoration-line', 'line-through');
  });

  test('should edit a task name', async () => {
    const originalName = `Original task ${Date.now()}`;
    const updatedName = `Updated task ${Date.now()}`;
    await todoPage.addTask(originalName);

    await todoPage.editTaskName(originalName, updatedName);

    await expect(todoPage.getTaskItem(updatedName)).toBeVisible();
    await expect(todoPage.getTaskItem(originalName)).not.toBeVisible();
  });

  test('should add a task with a due date and show the date chip', async () => {
    const taskName = `Task with due date ${Date.now()}`;
    const dueDate = '2099-06-15';
    await todoPage.addTask(taskName, dueDate);

    await expect(todoPage.getTaskItem(taskName)).toBeVisible();
    await expect(todoPage.getDueDateChip(dueDate)).toBeVisible();
  });

  test('should sort tasks by due date', async () => {
    const nearTask = `Near task ${Date.now()}`;
    const farTask = `Far task ${Date.now()}`;

    await todoPage.addTask(farTask, '2099-12-31');
    await todoPage.addTask(nearTask, '2099-01-01');

    await todoPage.setSortByDueDate();

    const taskNames = await todoPage.page.getByRole('listitem')
      .allTextContents();

    const nearIndex = taskNames.findIndex(t => t.includes(nearTask));
    const farIndex = taskNames.findIndex(t => t.includes(farTask));
    expect(nearIndex).toBeLessThan(farIndex);
  });
});
