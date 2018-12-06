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
import moment from 'moment';
import { timeNavigation } from '../time_navigation';

describe('timeNavigation', () => {
  let bounds;

  beforeEach(() => {
    bounds = {
      min: moment('2016-01-01T00:00:00.000Z'),
      max: moment('2016-01-01T00:15:00.000Z')
    };
  });

  it('should step forward by the amount of the duration', () => {
    const { from, to, mode } = timeNavigation.stepForward(bounds);
    expect(from).to.be('2016-01-01T00:15:00.001Z');
    expect(to).to.be('2016-01-01T00:30:00.001Z');
    expect(mode).to.be('absolute');
  });

  it('should step backward by the amount of the duration', () => {
    const { from, to, mode } = timeNavigation.stepBackward(bounds);
    expect(from).to.be('2015-12-31T23:44:59.999Z');
    expect(to).to.be('2015-12-31T23:59:59.999Z');
    expect(mode).to.be('absolute');
  });

  it('should zoom out to be double the original duration', () => {
    const { from, to, mode } = timeNavigation.zoomOut(bounds);
    expect(from).to.be('2015-12-31T23:52:30.000Z');
    expect(to).to.be('2016-01-01T00:22:30.000Z');
    expect(mode).to.be('absolute');
  });

  it('should zoom in to be half the original duration', () => {
    const { from, to, mode } = timeNavigation.zoomIn(bounds);
    expect(from).to.be('2016-01-01T00:03:45.000Z');
    expect(to).to.be('2016-01-01T00:11:15.000Z');
    expect(mode).to.be('absolute');
  });
});
