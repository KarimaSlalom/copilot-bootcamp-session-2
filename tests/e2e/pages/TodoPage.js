/**
 * Page Object Model for the To Do App.
 * Encapsulates all selectors and interactions to keep E2E tests maintainable.
 */
class TodoPage {
  constructor(page) {
    this.page = page;

    // Header
    this.heading = page.getByRole('heading', { name: 'To Do App' });

    // Add task form
    this.taskNameInput = page.getByRole('textbox', { name: /task name/i });
    this.dueDateInput = page.locator('input[type="date"]');
    this.addButton = page.getByRole('button', { name: /add task/i });

    // Task list
    this.taskList = page.getByRole('list');
    this.emptyState = page.getByText('No items found. Add some!');

    // Sort controls
    this.sortNewest = page.getByRole('button', { name: /sort by newest/i });
    this.sortDueDate = page.getByRole('button', { name: /sort by due date/i });
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async addTask(name, dueDate = '') {
    await this.taskNameInput.fill(name);
    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }
    await this.addButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteTask(name) {
    const deleteBtn = this.page.getByRole('button', { name: new RegExp(`delete "${name}"`, 'i') });
    await deleteBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async toggleComplete(name) {
    const checkbox = this.page.getByRole('checkbox', { name: new RegExp(`Mark "${name}"`, 'i') });
    await checkbox.click();
    await this.page.waitForLoadState('networkidle');
  }

  async editTaskName(currentName, newName) {
    const editBtn = this.page.getByRole('button', { name: new RegExp(`edit "${currentName}"`, 'i') });
    await editBtn.click();
    const editInput = this.page.getByRole('textbox', { name: /edit task name/i });
    await editInput.fill(newName);
    const saveBtn = this.page.getByRole('button', { name: /save edit/i });
    await saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setSortByDueDate() {
    await this.sortDueDate.click();
    await this.page.waitForLoadState('networkidle');
  }

  async setSortByNewest() {
    await this.sortNewest.click();
    await this.page.waitForLoadState('networkidle');
  }

  getTaskItem(name) {
    return this.page.getByText(name, { exact: true });
  }

  getDueDateChip(date) {
    return this.page.getByText(date, { exact: true });
  }
}

module.exports = { TodoPage };
