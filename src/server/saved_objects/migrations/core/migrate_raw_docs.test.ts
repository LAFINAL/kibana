/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';
import sinon from 'sinon';
import { SavedObjectsSchema } from '../../schema';
import { ROOT_TYPE, SavedObjectsSerializer } from '../../serialization';
import { migrateRawDocs } from './migrate_raw_docs';

describe('migrateRawDocs', () => {
  test('converts raw docs to saved objects', async () => {
    const transform = sinon.spy((doc: any) => _.set(doc, 'attributes.name', 'HOI!'));
    const result = migrateRawDocs(new SavedObjectsSerializer(new SavedObjectsSchema()), transform, [
      { _id: 'a:b', _source: { type: 'a', a: { name: 'AAA' } } },
      { _id: 'c:d', _source: { type: 'c', c: { name: 'DDD' } } },
    ]);

    expect(result).toEqual([
      {
        _id: 'a:b',
        _source: { type: 'a', a: { name: 'HOI!' }, migrationVersion: {} },
        _type: ROOT_TYPE,
      },
      {
        _id: 'c:d',
        _source: { type: 'c', c: { name: 'HOI!' }, migrationVersion: {} },
        _type: ROOT_TYPE,
      },
    ]);

    sinon.assert.calledTwice(transform);
  });

  test('passes invalid docs through untouched', async () => {
    const transform = sinon.spy((doc: any) => _.set(_.cloneDeep(doc), 'attributes.name', 'TADA'));
    const result = migrateRawDocs(new SavedObjectsSerializer(new SavedObjectsSchema()), transform, [
      { _id: 'foo:b', _source: { type: 'a', a: { name: 'AAA' } } },
      { _id: 'c:d', _source: { type: 'c', c: { name: 'DDD' } } },
    ]);

    expect(result).toEqual([
      { _id: 'foo:b', _source: { type: 'a', a: { name: 'AAA' } } },
      {
        _id: 'c:d',
        _source: { type: 'c', c: { name: 'TADA' }, migrationVersion: {} },
        _type: ROOT_TYPE,
      },
    ]);

    expect(transform.args).toEqual([
      [
        {
          id: 'd',
          type: 'c',
          attributes: {
            name: 'DDD',
          },
          migrationVersion: {},
        },
      ],
    ]);
  });
});
