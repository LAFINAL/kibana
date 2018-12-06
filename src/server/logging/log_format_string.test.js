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

import moment from 'moment';

import {
  createListStream,
  createPromiseFromStreams,
} from '../../utils';

import KbnLoggerStringFormat from './log_format_string';

const time = +moment('2010-01-01T05:15:59Z', moment.ISO_8601);

const makeEvent = () => ({
  event: 'log',
  timestamp: time,
  tags: ['tag'],
  pid: 1,
  data: 'my log message'
});

describe('KbnLoggerStringFormat', () => {
  it('logs in UTC', async () => {
    const format = new KbnLoggerStringFormat({
      timezone: 'UTC'
    });

    const result = await createPromiseFromStreams([
      createListStream([makeEvent()]),
      format
    ]);

    expect(String(result))
      .toContain(moment.utc(time).format('HH:mm:ss.SSS'));
  });

  it('logs in local timezone when timezone is undefined', async () => {
    const format = new KbnLoggerStringFormat({});

    const result = await createPromiseFromStreams([
      createListStream([makeEvent()]),
      format
    ]);

    expect(String(result))
      .toContain(moment(time).format('HH:mm:ss.SSS'));
  });
});
