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

import { parseLogLevel } from './log_levels';

it('parses valid log levels correctly', () => {
  expect(parseLogLevel('silent')).toMatchSnapshot('silent');
  expect(parseLogLevel('error')).toMatchSnapshot('error');
  expect(parseLogLevel('warning')).toMatchSnapshot('warning');
  expect(parseLogLevel('info')).toMatchSnapshot('info');
  expect(parseLogLevel('debug')).toMatchSnapshot('debug');
  expect(parseLogLevel('verbose')).toMatchSnapshot('verbose');
});

it('throws error for invalid levels', () => {
  expect(() => parseLogLevel('warn')).toThrowErrorMatchingSnapshot('warn');
  expect(() => parseLogLevel('foo')).toThrowErrorMatchingSnapshot('foo');
  expect(() => parseLogLevel('bar')).toThrowErrorMatchingSnapshot('bar');
});
