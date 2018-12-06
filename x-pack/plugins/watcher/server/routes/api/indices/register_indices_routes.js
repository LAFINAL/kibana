/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { registerGetRoute } from './register_get_route';

export function registerIndicesRoutes(server) {
  registerGetRoute(server);
}
