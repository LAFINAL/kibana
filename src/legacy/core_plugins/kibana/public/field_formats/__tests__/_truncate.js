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
import { fieldFormats } from 'ui/registry/field_formats';
describe('String Truncate Format', function () {


  it('truncate large string', function () {
    const Truncate = fieldFormats.getType('truncate');
    const truncate = new Truncate({ fieldLength: 4 });

    expect(truncate.convert('This is some text')).to.be('This...');
  });

  it('does not truncate large string when field length is not a string', function () {
    const Truncate = fieldFormats.getType('truncate');
    const truncate = new Truncate({ fieldLength: 'not number' });

    expect(truncate.convert('This is some text')).to.be('This is some text');
  });

  it('does not truncate large string when field length is null', function () {
    const Truncate = fieldFormats.getType('truncate');
    const truncate = new Truncate({ fieldLength: null });

    expect(truncate.convert('This is some text')).to.be('This is some text');
  });

  it('does not truncate large string when field length larger than the text', function () {
    const Truncate = fieldFormats.getType('truncate');
    const truncate = new Truncate({ fieldLength: 100000 });

    expect(truncate.convert('This is some text')).to.be('This is some text');
  });
});
