/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export const all = () => ({
  name: 'all',
  type: 'boolean',
  help: 'Return true if all of the conditions are true',
  args: {
    condition: {
      aliases: ['_'],
      types: ['boolean', 'null'],
      required: true,
      multi: true,
      help: 'One or more conditions to check',
    },
  },
  fn: (context, args) => {
    const conditions = args.condition || [];
    return conditions.every(Boolean);
  },
});
