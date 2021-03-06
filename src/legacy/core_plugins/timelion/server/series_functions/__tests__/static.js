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

const filename = require('path').basename(__filename);
const fn = require(`../${filename}`);

import _ from 'lodash';
const expect = require('chai').expect;
import invoke from './helpers/invoke_series_fn.js';

describe(filename, () => {
  it('returns a series in which all numbers are the same', () => {
    return invoke(fn, [5]).then((r) => {
      expect(_.unique(_.map(r.output.list[0].data, 1))).to.eql([5]);
    });
  });

  it('plots a provided series', () => {
    return invoke(fn, ['4:3:2:1']).then((r) => {
      expect(_.map(r.output.list[0].data, 1)).to.eql([4, 3, 2, 1]);
    });
  });

  it('leaves interpolation up to the data source wrapper', () => {
    return invoke(fn, ['1:4']).then((r) => {
      expect(_.map(r.output.list[0].data, 1)).to.eql([1, 4]);
    });
  });
});
