/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */


import React from 'react';

import {
  EuiTitle,
  EuiSpacer,
} from '@elastic/eui';

import { MLJobEditor, EDITOR_MODE } from '../../../jobs/jobs_list/components/ml_job_editor';

export function FileContents({ data, format, numberOfLines }) {
  let mode = EDITOR_MODE.TEXT;
  if (format === EDITOR_MODE.JSON) {
    mode = EDITOR_MODE.JSON;
  }

  const formattedData = limitByNumberOfLines(data, numberOfLines);

  return (
    <React.Fragment>
      <EuiTitle size="s">
        <h3>File contents</h3>
      </EuiTitle>

      <div>First {numberOfLines} line{(numberOfLines > 1) ? 's' : ''}</div>

      <EuiSpacer size="s" />

      <MLJobEditor
        mode={mode}
        readOnly={true}
        value={formattedData}
        height="200px"
        syntaxChecking={false}
      />
    </React.Fragment>
  );
}

function limitByNumberOfLines(data, numberOfLines) {
  return data.split('\n').slice(0, numberOfLines).join('\n');
}
