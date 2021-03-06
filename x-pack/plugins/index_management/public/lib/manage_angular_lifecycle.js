/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { unmountComponentAtNode } from 'react-dom';

export const manageAngularLifecycle = ($scope, $route, elem) => {
  const lastRoute = $route.current;

  const deregister = $scope.$on('$locationChangeSuccess', () => {
    const currentRoute = $route.current;
    if (lastRoute.$$route.template === currentRoute.$$route.template) {
      $route.current = lastRoute;
    }
  });

  $scope.$on('$destroy', () => {
    deregister && deregister();
    elem && unmountComponentAtNode(elem);
  });
};
