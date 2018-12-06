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

import { Link } from 'react-router';

import { renderToHtml } from '../../services';

import {
  GuideCode,
  GuideDemo,
  GuidePage,
  GuideSection,
  GuideSectionTypes,
  GuideText,
} from '../../components';

import PanelSimple from './panel_simple';
const panelSimpleSource = require('!!raw-loader!./panel_simple');
const panelSimpleHtml = renderToHtml(PanelSimple);

export default props => (
  <GuidePage title={props.route.name}>
    <GuideSection
      title="PanelSimple"
      source={[{
        type: GuideSectionTypes.JS,
        code: panelSimpleSource,
      }, {
        type: GuideSectionTypes.HTML,
        code: panelSimpleHtml,
      }]}
    >
      <GuideText>
        <GuideCode>PanelSimple</GuideCode> is a simple wrapper component to add
        depth to a contained layout. It it commonly used as a base for
        other larger components like <Link className="guideLink" to="/popover">Popover</Link>.
      </GuideText>

      <GuideDemo>
        <PanelSimple />
      </GuideDemo>
    </GuideSection>
  </GuidePage>
);
