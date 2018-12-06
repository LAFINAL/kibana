/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EuiFormRow, EuiAccordion, EuiText, EuiToolTip } from '@elastic/eui';
// This is what is being generated by render() from the Arg class. It is called in FunctionForm

export const ArgLabel = props => {
  const { argId, className, label, help, expandable, children, simpleArg, initialIsOpen } = props;

  return (
    <div className={`canvasArg--header${className && ` ${className}`}`}>
      {expandable ? (
        <EuiAccordion
          id={`accordion-${argId}`}
          className="canvasArg__accordion"
          buttonContent={
            <EuiToolTip content={help} position="left" className="canvasArg__tooltip">
              <EuiText size="s" color="subdued" htmlFor={`accordion-${argId}`}>
                {label}
              </EuiText>
            </EuiToolTip>
          }
          extraAction={simpleArg}
          initialIsOpen={initialIsOpen}
        >
          <div className="canvasArg__content">{children}</div>
        </EuiAccordion>
      ) : (
        simpleArg && (
          <EuiFormRow label={label} helpText={help} id={argId}>
            {simpleArg}
          </EuiFormRow>
        )
      )}
    </div>
  );
};

ArgLabel.propTypes = {
  argId: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
  expandable: PropTypes.bool,
  initialIsOpen: PropTypes.bool,
  simpleArg: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.element]).isRequired,
  className: PropTypes.string,
};
