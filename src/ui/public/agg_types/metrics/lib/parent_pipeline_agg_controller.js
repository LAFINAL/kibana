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

import _ from 'lodash';
import { safeMakeLabel } from './safe_make_label';
import { i18n } from '@kbn/i18n';

const parentPipelineAggController = function ($scope) {

  $scope.safeMakeLabel = safeMakeLabel;

  $scope.$watch('responseValueAggs', updateOrderAgg);
  $scope.$watch('agg.params.metricAgg', updateOrderAgg);

  $scope.$on('$destroy', function () {
    const lastBucket = _.findLast($scope.state.aggs, agg => agg.type.type === 'buckets');
    if ($scope.aggForm && $scope.aggForm.agg) {
      $scope.aggForm.agg.$setValidity('bucket', true);
    }
    if (lastBucket && lastBucket.error) {
      delete lastBucket.error;
    }
  });

  $scope.isDisabledAgg = function (agg) {
    const invalidAggs = ['top_hits', 'percentiles', 'percentile_ranks', 'median', 'std_dev'];
    return Boolean(invalidAggs.find(invalidAgg => invalidAgg === agg.type.name));
  };

  function checkBuckets() {
    const lastBucket = _.findLast($scope.state.aggs, agg => agg.type.type === 'buckets');
    const bucketHasType = lastBucket && lastBucket.type;
    const bucketIsHistogram = bucketHasType && ['date_histogram', 'histogram'].includes(lastBucket.type.name);
    const canUseAggregation = lastBucket && bucketIsHistogram;

    // remove errors on all buckets
    _.each($scope.state.aggs, agg => { if (agg.error) delete agg.error; });

    if ($scope.aggForm.agg) {
      $scope.aggForm.agg.$setValidity('bucket', canUseAggregation);
    }
    if (canUseAggregation) {
      lastBucket.params.min_doc_count = (lastBucket.type.name === 'histogram') ? 1 : 0;
    } else {
      if (lastBucket) {
        const type = $scope.agg.type.title;
        lastBucket.error = i18n.translate('common.ui.aggTypes.metrics.wrongLastBucketTypeErrorMessage', {
          defaultMessage: 'Last bucket aggregation must be "Date Histogram" or "Histogram" when using "{type}" metric aggregation!',
          values: { type },
          description: 'Date Histogram and Histogram should not be translated'
        });
      }
    }
  }

  function updateOrderAgg() {
    const agg = $scope.agg;
    const params = agg.params;
    const metricAgg = params.metricAgg;
    const paramDef = agg.type.params.byName.customMetric;

    checkBuckets();

    // we aren't creating a custom aggConfig
    if (metricAgg !== 'custom') {
      if (!$scope.state.aggs.find(agg => agg.id === metricAgg)) {
        params.metricAgg = null;
      }
      params.customMetric = null;
      return;
    }

    params.customMetric = params.customMetric || paramDef.makeAgg(agg);
  }
};

export { parentPipelineAggController };
