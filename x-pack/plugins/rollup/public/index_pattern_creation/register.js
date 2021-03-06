/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { IndexPatternCreationConfigRegistry } from 'ui/management/index_pattern_creation';
import { RollupIndexPatternCreationConfig } from './rollup_index_pattern_creation_config';

export function initIndexPatternCreation() {
  IndexPatternCreationConfigRegistry.register(() => RollupIndexPatternCreationConfig);
}
