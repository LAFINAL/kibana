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

const Generator = require('yeoman-generator');

const documentationGenerator = require.resolve('../documentation/index.js');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      message: 'What do you want to create?',
      name: 'fileType',
      type: 'list',
      choices: [{
        name: 'Page',
        value: 'documentation',
      }, {
        name: 'Page demo',
        value: 'demo',
      }, {
        name: 'Sandbox',
        value: 'sandbox',
      }],
    }]).then(answers => {
      this.config = answers;
    });
  }

  writing() {
    this.composeWith(documentationGenerator, {
      fileType: this.config.fileType,
    });
  }
};
