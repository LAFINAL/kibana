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

import expect from 'expect.js';
import { propFilter } from '../_prop_filter';

describe('prop filter', function () {
  let nameFilter;

  beforeEach(function () {
    nameFilter = propFilter('name');
  });

  function getObjects(...names) {
    const count = new Map();
    const objects = [];

    for (const name of names) {
      if (!count.has(name)) {
        count.set(name, 1);
      }
      objects.push({
        name: name,
        title: `${name} ${count.get(name)}`
      });
      count.set(name, count.get(name) + 1);
    }
    return objects;
  }

  it('returns list when no filters are provided', function () {
    const objects = getObjects('table', 'table', 'pie');
    expect(nameFilter(objects)).to.eql(objects);
  });

  it('returns list when empty list of filters is provided', function () {
    const objects = getObjects('table', 'table', 'pie');
    expect(nameFilter(objects, [])).to.eql(objects);
  });

  it('should keep only the tables', function () {
    const objects = getObjects('table', 'table', 'pie');
    expect(nameFilter(objects, 'table')).to.eql(getObjects('table', 'table'));
  });

  it('should support comma-separated values', function () {
    const objects = getObjects('table', 'line', 'pie');
    expect(nameFilter(objects, 'table,line')).to.eql(getObjects('table', 'line'));
  });

  it('should support an array of values', function () {
    const objects = getObjects('table', 'line', 'pie');
    expect(nameFilter(objects, [ 'table', 'line' ])).to.eql(getObjects('table', 'line'));
  });

  it('should return all objects', function () {
    const objects = getObjects('table', 'line', 'pie');
    expect(nameFilter(objects, '*')).to.eql(objects);
  });

  it('should allow negation', function () {
    const objects = getObjects('table', 'line', 'pie');
    expect(nameFilter(objects, [ '!line' ])).to.eql(getObjects('table', 'pie'));
  });

  it('should support a function for specifying what should be kept', function () {
    const objects = getObjects('table', 'line', 'pie');
    const line = (value) => value === 'line';
    expect(nameFilter(objects, line)).to.eql(getObjects('line'));
  });

  it('gracefully handles a filter function with zero arity', function () {
    const objects = getObjects('table', 'line', 'pie');
    const rejectEverything = () => false;
    expect(nameFilter(objects, rejectEverything)).to.eql([]);
  });
});
