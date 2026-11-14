import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidTask, isValidProject, isValidComment, isValidTaskStatus } from './validation';

const task = {
  id: 't1', projectId: 'p1', title: 'Write tests', description: 'Add unit tests',
  status: 'todo', priority: 'medium', assignees: [], tags: ['backend'],
  dueDate: new Date().toISOString(), checklist: [], createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(), position: 0
};

test('accepts a valid task and rejects invalid task data', () => {
  assert.equal(isValidTask(task), true);
  assert.equal(isValidTask({ ...task, title: '   ' }), false);
  assert.equal(isValidTask({ ...task, status: 'unknown' }), false);
  assert.equal(isValidTask({ ...task, position: -1 }), false);
});

test('validates project and comment input', () => {
  assert.equal(isValidProject({ id: 'p1', name: 'Team', description: '', members: [] }), true);
  assert.equal(isValidProject({ id: 'p1', name: ' ', description: '', members: [] }), false);
  assert.equal(isValidComment({ id: 'c1', taskId: 't1', content: 'Looks good', userId: 'u1', userName: 'Sam' }), true);
  assert.equal(isValidComment({ id: 'c1', taskId: 't1', content: ' ', userId: 'u1', userName: 'Sam' }), false);
});

test('accepts only known task statuses', () => {
  assert.equal(isValidTaskStatus('in_progress'), true);
  assert.equal(isValidTaskStatus('blocked'), false);
});
