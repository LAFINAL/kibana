/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { scaleTime } from 'd3-scale';
import * as React from 'react';
import styled from 'styled-components';

interface TimeRulerProps {
  end: number;
  height: number;
  start: number;
  tickCount: number;
  width: number;
}

export const TimeRuler: React.SFC<TimeRulerProps> = ({ end, height, start, tickCount, width }) => {
  const yScale = scaleTime()
    .domain([start, end])
    .range([0, height]);

  const ticks = yScale.ticks(tickCount);
  const formatTick = yScale.tickFormat();

  return (
    <g>
      {ticks.map((tick, tickIndex) => {
        const y = yScale(tick);
        return (
          <g key={`tick${tickIndex}`}>
            <TimeRulerTickLabel x={2} y={y - 4}>
              {formatTick(tick)}
            </TimeRulerTickLabel>
            <TimeRulerGridLine x1={0} y1={y} x2={width} y2={y} />
          </g>
        );
      })}
    </g>
  );
};

TimeRuler.displayName = 'TimeRuler';

const TimeRulerTickLabel = styled.text`
  font-size: ${props => props.theme.eui.euiFontSizeXs};
  line-height: ${props => props.theme.eui.euiLineHeight};
  color: ${props => props.theme.eui.euiTextColor};
`;

const TimeRulerGridLine = styled.line`
  stroke: ${props => props.theme.eui.euiColorMediumShade};
  stroke-dasharray: 2, 2;
  stroke-opacity: 0.5;
  stroke-width: 1px;
`;
