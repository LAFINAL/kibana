/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { createInitialDataSelector } from './helpers';
import { Request } from 'react-redux-request';
import { loadServiceDetails } from '../../services/rest/apm/services';

const ID = 'serviceDetails';
const INITIAL_DATA = { types: [] };
const withInitialData = createInitialDataSelector(INITIAL_DATA);

export function getServiceDetails(state) {
  return withInitialData(state.reactReduxRequest[ID]);
}

export function getDefaultTransactionType(state) {
  const types = _.get(state.reactReduxRequest[ID], 'data.types');
  return _.first(types);
}

export function ServiceDetailsRequest({ urlParams, render }) {
  const { serviceName, start, end, kuery } = urlParams;

  if (!(serviceName && start && end)) {
    return null;
  }

  return (
    <Request
      id={ID}
      fn={loadServiceDetails}
      args={[{ serviceName, start, end, kuery }]}
      selector={getServiceDetails}
      render={render}
    />
  );
}

ServiceDetailsRequest.propTypes = {
  urlParams: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired
};
