/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import isEqual from 'lodash/fp/isEqual';
import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface Measurement {
  width?: number;
  height?: number;
}

interface Measurements {
  bounds: Measurement;
  content: Measurement;
}

interface AutoSizerProps {
  detectAnyWindowResize?: boolean;
  bounds?: boolean;
  content?: boolean;
  onResize?: (size: Measurements) => void;
  children: (
    args: { measureRef: (instance: HTMLElement | null) => any } & Measurements
  ) => React.ReactNode;
}

interface AutoSizerState {
  boundsMeasurement: Measurement;
  contentMeasurement: Measurement;
}

export class AutoSizer extends React.PureComponent<AutoSizerProps, AutoSizerState> {
  public element: HTMLElement | null = null;
  public resizeObserver: ResizeObserver | null = null;
  public windowWidth: number = -1;

  public readonly state = {
    boundsMeasurement: {
      height: void 0,
      width: void 0,
    },
    contentMeasurement: {
      height: void 0,
      width: void 0,
    },
  };

  constructor(props: AutoSizerProps) {
    super(props);
    if (this.props.detectAnyWindowResize) {
      window.addEventListener('resize', this.updateMeasurement);
    }
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === this.element) {
          this.measure(entry);
        }
      });
    });
  }

  public componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.props.detectAnyWindowResize) {
      window.removeEventListener('resize', this.updateMeasurement);
    }
  }

  public measure = (entry: ResizeObserverEntry | null) => {
    if (!this.element) {
      return;
    }

    const { content = true, bounds = false } = this.props;
    const {
      boundsMeasurement: previousBoundsMeasurement,
      contentMeasurement: previousContentMeasurement,
    } = this.state;

    const boundsRect = bounds ? this.element.getBoundingClientRect() : null;
    const boundsMeasurement = boundsRect
      ? {
          height: this.element.getBoundingClientRect().height,
          width: this.element.getBoundingClientRect().width,
        }
      : previousBoundsMeasurement;

    if (
      this.props.detectAnyWindowResize &&
      boundsMeasurement &&
      boundsMeasurement.width &&
      this.windowWidth !== -1 &&
      this.windowWidth > window.innerWidth
    ) {
      const gap = this.windowWidth - window.innerWidth;
      boundsMeasurement.width = boundsMeasurement.width - gap;
    }
    this.windowWidth = window.innerWidth;
    const contentRect = content && entry ? entry.contentRect : null;
    const contentMeasurement =
      contentRect && entry
        ? {
            height: entry.contentRect.height,
            width: entry.contentRect.width,
          }
        : previousContentMeasurement;

    if (
      isEqual(boundsMeasurement, previousBoundsMeasurement) &&
      isEqual(contentMeasurement, previousContentMeasurement)
    ) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.resizeObserver) {
        return;
      }

      this.setState({ boundsMeasurement, contentMeasurement });

      if (this.props.onResize) {
        this.props.onResize({
          bounds: boundsMeasurement,
          content: contentMeasurement,
        });
      }
    });
  };

  public render() {
    const { children } = this.props;
    const { boundsMeasurement, contentMeasurement } = this.state;

    return children({
      bounds: boundsMeasurement,
      content: contentMeasurement,
      measureRef: this.storeRef,
    });
  }

  private updateMeasurement = () => {
    window.setTimeout(() => {
      this.measure(null);
    }, 0);
  };

  private storeRef = (element: HTMLElement | null) => {
    if (this.element && this.resizeObserver) {
      this.resizeObserver.unobserve(this.element);
    }

    if (element && this.resizeObserver) {
      this.resizeObserver.observe(element);
    }

    this.element = element;
  };
}
