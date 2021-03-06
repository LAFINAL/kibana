/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import { handleResponse } from '../collector';
import { workpads } from '../../../__tests__/fixtures/workpads';

const getMockResponse = (mocks = workpads) => ({
  hits: {
    hits: mocks.map(workpad => ({
      _source: {
        'canvas-workpad': workpad,
      },
    })),
  },
});

describe('usage collector handle es response data', () => {
  it('should summarize workpads, pages, and elements', () => {
    const usage = handleResponse(getMockResponse());
    expect(usage).to.eql({
      workpads: {
        total: 6, // num workpad documents in .kibana index
      },
      pages: {
        total: 16, // num pages in all the workpads
        per_workpad: { avg: 2.6666666666666665, min: 1, max: 4 },
      },
      elements: {
        total: 34, // num elements in all the pages
        per_page: { avg: 2.125, min: 1, max: 5 },
      },
      functions: {
        per_element: { avg: 4, min: 2, max: 7 },
        total: 36,
        in_use: [
          'demodata',
          'ply',
          'rowCount',
          'as',
          'staticColumn',
          'math',
          'mapColumn',
          'sort',
          'pointseries',
          'plot',
          'seriesStyle',
          'filters',
          'markdown',
          'render',
          'getCell',
          'repeatImage',
          'pie',
          'table',
          'image',
          'shape',
        ],
      },
    });
  });

  it('should collect correctly if an expression has null as an argument (possible sub-expression)', () => {
    const mockEsResponse = getMockResponse([
      {
        name: 'Tweet Data Workpad 1',
        id: 'workpad-ae00567f-5510-4d68-b07f-6b1661948e03',
        width: 792,
        height: 612,
        page: 0,
        pages: [
          {
            elements: [
              {
                expression: 'toast butter=null',
              },
            ],
          },
        ],
        '@timestamp': '2018-07-26T02:29:00.964Z',
        '@created': '2018-07-25T22:56:31.460Z',
        assets: {},
      },
    ]);
    const usage = handleResponse(mockEsResponse);
    expect(usage).to.eql({
      workpads: { total: 1 },
      pages: { total: 1, per_workpad: { avg: 1, min: 1, max: 1 } },
      elements: { total: 1, per_page: { avg: 1, min: 1, max: 1 } },
      functions: { total: 1, in_use: ['toast'], per_element: { avg: 1, min: 1, max: 1 } },
    });
  });

  it('should fail gracefully if workpad has 0 pages (corrupted workpad)', () => {
    const mockEsResponseCorrupted = getMockResponse([
      {
        name: 'Tweet Data Workpad 2',
        id: 'workpad-ae00567f-5510-4d68-b07f-6b1661948e03',
        width: 792,
        height: 612,
        page: 0,
        pages: [], // pages should never be empty, and *may* prevent the ui from rendering properly
        '@timestamp': '2018-07-26T02:29:00.964Z',
        '@created': '2018-07-25T22:56:31.460Z',
        assets: {},
      },
    ]);
    const usage = handleResponse(mockEsResponseCorrupted);
    expect(usage).to.eql({
      workpads: { total: 1 },
      pages: { total: 0, per_workpad: { avg: 0, min: 0, max: 0 } },
      elements: undefined,
      functions: undefined,
    });
  });

  it('should fail gracefully in general', () => {
    const usage = handleResponse({ hits: { total: 0 } });
    expect(usage).to.eql(undefined);
  });
});
