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

jest.mock('ui/kfetch', () => ({}));

import React from 'react';
import { shallowWithIntl } from 'test_utils/enzyme_helpers';

import { FieldEditorComponent } from './field_editor';

jest.mock('@elastic/eui', () => ({
  EuiButton: 'eui-button',
  EuiButtonEmpty: 'eui-button-empty',
  EuiCode: 'eui-code',
  EuiConfirmModal: 'eui-confirm-modal',
  EuiFieldNumber: 'eui-field-number',
  EuiFieldText: 'eui-field-text',
  EuiFlexGroup: 'eui-flex-group',
  EuiFlexItem: 'eui-flex-item',
  EuiForm: 'eui-form',
  EuiFormRow: 'eui-form-row',
  EuiIcon: 'eui-icon',
  EuiLink: 'eui-link',
  EuiOverlayMask: 'eui-overlay-mask',
  EuiSelect: 'eui-select',
  EuiSpacer: 'eui-spacer',
  EuiText: 'eui-text',
  EuiTextArea: 'eui-textArea',
}));

jest.mock('ui/scripting_languages', () => ({
  GetEnabledScriptingLanguagesProvider: jest.fn().mockImplementation(() => () => ['painless', 'testlang']),
  getSupportedScriptingLanguages: () => ['painless'],
  getDeprecatedScriptingLanguages: () => ['testlang'],
}));

jest.mock('ui/registry/field_formats', () => {
  class Format {
    static id = 'test_format'; static title = 'Test format';
    params() {}
  }

  return {
    fieldFormats: {
      getDefaultType: () => {
        return Format;
      },
      byFieldType: {
        'number': [Format],
      },
    },
  };
});

jest.mock('ui/documentation_links', () => ({
  getDocLink: (doc) => `(docLink for ${doc})`,
}));

jest.mock('ui/notify', () => ({
  toastNotifications: {
    addSuccess: jest.fn(),
  }
}));

jest.mock('./components/scripting_call_outs', () => ({
  ScriptingDisabledCallOut: 'scripting-disabled-callOut',
  ScriptingWarningCallOut: 'scripting-warning-callOut',
  ScriptingHelpFlyout: 'scripting-help-flyout',
}));

jest.mock('./components/field_format_editor', () => ({
  FieldFormatEditor: 'field-format-editor'
}));

const fields = [{
  name: 'foobar',
}];
fields.byName = {
  foobar: {
    name: 'foobar',
  },
};

class Format {
  static id = 'test_format'; static title = 'Test format';
  params() {}
}

const field = {
  scripted: true,
  type: 'number',
  lang: 'painless',
  format: new Format(),
};

const helpers = {
  Field: () => {},
  getConfig: () => {},
  $http: () => {},
  fieldFormatEditors: {},
  redirectAway: () => {},
};

describe('FieldEditor', () => {
  let indexPattern;

  beforeEach(() => {
    indexPattern = {
      fields,
    };
  });

  it('should render create new scripted field correctly', async () => {
    const component = shallowWithIntl(
      <FieldEditorComponent
        indexPattern={indexPattern}
        field={field}
        helpers={helpers}
      />
    );

    await new Promise(resolve => process.nextTick(resolve));
    component.update();
    expect(component).toMatchSnapshot();
  });

  it('should render edit scripted field correctly', async () => {
    const testField = {
      ...field,
      name: 'test',
      script: 'doc.test.value',
    };
    indexPattern.fields.push(testField);
    indexPattern.fields.byName[testField.name] = testField;

    const component = shallowWithIntl(
      <FieldEditorComponent
        indexPattern={indexPattern}
        field={testField}
        helpers={helpers}
      />
    );

    await new Promise(resolve => process.nextTick(resolve));
    component.update();
    expect(component).toMatchSnapshot();
  });

  it('should show deprecated lang warning', async () => {
    const testField = {
      ...field,
      name: 'test',
      script: 'doc.test.value',
      lang: 'testlang'
    };
    indexPattern.fields.push(testField);
    indexPattern.fields.byName[testField.name] = testField;

    const component = shallowWithIntl(
      <FieldEditorComponent
        indexPattern={indexPattern}
        field={testField}
        helpers={helpers}
      />
    );

    await new Promise(resolve => process.nextTick(resolve));
    component.update();
    expect(component).toMatchSnapshot();
  });

  it('should show conflict field warning', async () => {
    const testField = { ...field };
    const component = shallowWithIntl(
      <FieldEditorComponent
        indexPattern={indexPattern}
        field={testField}
        helpers={helpers}
      />
    );

    await new Promise(resolve => process.nextTick(resolve));
    component.instance().onFieldChange('name', 'foobar');
    component.update();
    expect(component).toMatchSnapshot();
  });
});
