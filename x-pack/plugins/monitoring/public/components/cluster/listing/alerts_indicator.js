/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { Tooltip } from 'plugins/monitoring/components/tooltip';
import { mapSeverity } from 'plugins/monitoring/components/alerts/map_severity';
import { EuiHealth } from '@elastic/eui';
import { FormattedMessage, injectI18n } from '@kbn/i18n/react';

const HIGH_SEVERITY = 2000;
const MEDIUM_SEVERITY = 1000;
const LOW_SEVERITY = 0;

function AlertsIndicatorUi({ alerts, intl }) {
  if (alerts && alerts.count > 0) {
    const severity = (() => {
      if (alerts.high > 0) { return HIGH_SEVERITY; }
      if (alerts.medium > 0) { return MEDIUM_SEVERITY; }
      return LOW_SEVERITY;
    })();
    const severityIcon = mapSeverity(severity);
    const tooltipText = (() => {
      switch (severity) {
        case HIGH_SEVERITY:
          return intl.formatMessage({
            id: 'xpack.monitoring.cluster.listing.alertsInticator.highSeverityTooltip',
            defaultMessage: 'There are some critical cluster issues that require your immediate attention!' });
        case MEDIUM_SEVERITY:
          return intl.formatMessage({
            id: 'xpack.monitoring.cluster.listing.alertsInticator.mediumSeverityTooltip',
            defaultMessage: 'There are some issues that might have impact on your cluster.' });
        default:
          // might never show
          return intl.formatMessage({
            id: 'xpack.monitoring.cluster.listing.alertsInticator.lowSeverityTooltip',
            defaultMessage: 'There are some low-severity cluster issues' });
      }
    })();

    return (
      <Tooltip text={tooltipText} placement="bottom" trigger="hover">
        <EuiHealth color={severityIcon.color} data-test-subj="alertIcon">
          <FormattedMessage
            id="xpack.monitoring.cluster.listing.alertsInticator.alertsTooltip"
            defaultMessage="Alerts"
          />
        </EuiHealth>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      text={intl.formatMessage({
        id: 'xpack.monitoring.cluster.listing.alertsInticator.clearStatusTooltip',
        defaultMessage: 'Cluster status is clear!' })}
      placement="bottom"
      trigger="hover"
    >
      <EuiHealth color="success" data-test-subj="alertIcon">
        <FormattedMessage
          id="xpack.monitoring.cluster.listing.alertsInticator.clearTooltip"
          defaultMessage="Clear"
        />
      </EuiHealth>
    </Tooltip>
  );
}

export const AlertsIndicator = injectI18n(AlertsIndicatorUi);
