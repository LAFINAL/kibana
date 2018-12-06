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

import React from 'react';
import { render } from 'enzyme';

import 'test_utils/static_html_id_generator';

import { EuiButtonIcon } from '@elastic/eui';
import { EditorOptionsGroup } from './editor_options_group';

describe('<EditorOptionsGroup/>', () => {
  it('renders as expected', () => {
    const group = render(
      <EditorOptionsGroup
        title="Some options"
      >
        <span>Children</span>
        <span>within the editor group</span>
      </EditorOptionsGroup>
    );
    expect(group).toMatchSnapshot();
  });

  it('renders as expected with actions', () => {
    const group = render(
      <EditorOptionsGroup
        title="Some actions"
        actions={
          <EuiButtonIcon
            iconType="trash"
            color="text"
            aria-label="Remove"
          />
        }
      >
        <span>Some children</span>
      </EditorOptionsGroup>
    );
    expect(group).toMatchSnapshot();
  });

  it('renders as expected with initial collapsed', () => {
    const group = render(
      <EditorOptionsGroup
        title="Some options"
        initialIsCollapsed={true}
      >
        <span>Children</span>
        <span>within the editor group</span>
      </EditorOptionsGroup>
    );
    expect(group).toMatchSnapshot();
  });
});
