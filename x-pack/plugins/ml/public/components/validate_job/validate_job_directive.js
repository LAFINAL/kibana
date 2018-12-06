/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */




import 'ngreact';

import { uiModules } from 'ui/modules';
const module = uiModules.get('apps/ml', ['react']);

import { ValidateJob } from './validate_job_view';
import { mlJobService } from 'plugins/ml/services/job_service';

module.directive('mlValidateJob', function (reactDirective) {
  return reactDirective(
    ValidateJob,
    undefined,
    { restrict: 'E' },
    { mlJobService }
  );
});
