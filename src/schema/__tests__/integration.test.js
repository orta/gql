/* @flow */

import path from 'path';

export function getSchema(fixture: string) {
  jest.mock('../../shared/watch');
  const watch = require('../../shared/watch').default;
  const { GQLService } = require('../../');
  const gql = new GQLService({ cwd: path.resolve(__dirname, 'fixtures', fixture) });
  // $FlowDisableNextLine
  watch.__triggerChange();
  return gql._schemaBuilder.getSchema();
}

test('field type: ObjectType', () => {
  const schema = getSchema('artsy');
  debugger;
});
