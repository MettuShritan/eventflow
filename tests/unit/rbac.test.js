const assert = require('node:assert/strict');
const test = require('node:test');

test('role boundaries remain distinct', () => {
  const matrix = {
    participant: { admin: false, conductor: false, devops: false },
    conductor: { admin: false, conductor: true, devops: false },
    admin: { admin: true, conductor: true, devops: true },
  };
  assert.equal(matrix.participant.devops, false);
  assert.equal(matrix.conductor.devops, false);
  assert.equal(matrix.admin.devops, true);
});
