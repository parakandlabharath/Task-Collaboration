import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidTask, isValidProject, isValidComment, isValidTaskStatus } from './validation';

const user = { id: 'u1', name: 'Sam', email: 'sam@example.com', avatar: '', color: '#fff', role: 'Developer', status: 'online' };
const task = {
  id: 't1', projectId: 'p1', title: 'Write tests', description: 'Add unit tests',
  status: 'todo', priority: 'medium', assignees: [user], tags: ['backend'],
  dueDate: new Date().toISOString(), checklist: [{ id: 'c1', text: 'Write unit tests', completed: false }],
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), position: 0
};

test('accepts a valid task and rejects invalid task data', () => {
  assert.equal(isValidTask(task), true);
  assert.equal(isValidTask({ ...task, title: '   ' }), false);
  assert.equal(isValidTask({ ...task, status: 'unknown' }), false);
  assert.equal(isValidTask({ ...task, position: -1 }), false);
});

test('rejects malformed nested assignees, checklist items and dates', () => {
  assert.equal(isValidTask({ ...task, assignees: [{ id: 'fake' }] }), false);
  assert.equal(isValidTask({ ...task, checklist: [{ id: 'c1', text: 'Bad item', completed: 'yes' }] }), false);
  assert.equal(isValidTask({ ...task, dueDate: 'not-a-date' }), false);
});

test('validates project and comment input', () => {
  const project = { id: 'p1', name: 'Team', description: '', icon: 'Rocket', color: '#fff', members: [user], createdAt: new Date().toISOString() };
  assert.equal(isValidProject(project), true);
  assert.equal(isValidProject({ ...project, name: ' ' }), false);
  const comment = { id: 'c1', taskId: 't1', content: 'Looks good', userId: 'u1', userName: 'Sam', userAvatar: '', createdAt: new Date().toISOString() };
  assert.equal(isValidComment(comment), true);
  assert.equal(isValidComment({ ...comment, content: ' ' }), false);
});

test('accepts only known task statuses', () => {
  assert.equal(isValidTaskStatus('in_progress'), true);
  assert.equal(isValidTaskStatus('blocked'), false);
});
