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

import { ServerExtType } from 'hapi';
import Podium from 'podium';
// @ts-ignore: implicit any for JS file
import { Config, transformDeprecations } from '../../../../server/config';
// @ts-ignore: implicit any for JS file
import { setupLogging } from '../../../../server/logging';
import { LogLevel } from '../../logging/log_level';
import { LogRecord } from '../../logging/log_record';

interface PluginRegisterParams {
  plugin: {
    register: (
      server: LegacyLoggingServer,
      options: PluginRegisterParams['options']
    ) => Promise<void>;
  };
  options: Record<string, any>;
}

/**
 * Converts core log level to a one that's known to the legacy platform.
 * @param level Log level from the core.
 */
function getLegacyLogLevel(level: LogLevel) {
  const logLevel = level.id.toLowerCase();
  if (logLevel === 'warn') {
    return 'warning';
  }

  if (logLevel === 'trace') {
    return 'debug';
  }

  return logLevel;
}

/**
 *  The "legacy" Kibana uses Hapi server + even-better plugin to log, so we should
 *  use the same approach here to make log records generated by the core to look the
 *  same as the rest of the records generated by the "legacy" Kibana. But to reduce
 *  overhead of having full blown Hapi server instance we create our own "light" version.
 *  @internal
 */
export class LegacyLoggingServer {
  public connections = [];
  // Emulates Hapi's usage of the podium event bus.
  public events: Podium = new Podium(['log', 'request', 'response']);

  private onPostStopCallback?: () => void;

  constructor(legacyLoggingConfig: Readonly<Record<string, any>>) {
    // We set `ops.interval` to max allowed number and `ops` filter to value
    // that doesn't exist to avoid logging of ops at all, if turned on it will be
    // logged by the "legacy" Kibana.
    const config = {
      logging: {
        ...legacyLoggingConfig,
        events: {
          ...legacyLoggingConfig.events,
          ops: '__no-ops__',
        },
      },
      ops: { interval: 2147483647 },
    };

    setupLogging(this, Config.withDefaultSchema(transformDeprecations(config)));
  }

  public register({ plugin: { register }, options }: PluginRegisterParams): Promise<void> {
    return register(this, options);
  }

  public log({ level, context, message, error, timestamp, meta = {} }: LogRecord) {
    this.events.emit('log', {
      data: error || message,
      tags: [getLegacyLogLevel(level), ...context.split('.'), ...(meta.tags || [])],
      timestamp: timestamp.getTime(),
    });
  }

  public stop() {
    // Tell the plugin we're stopping.
    if (this.onPostStopCallback !== undefined) {
      this.onPostStopCallback();
    }
  }

  public ext(eventName: ServerExtType, callback: () => void) {
    // method is called by plugin that's being registered.
    if (eventName === 'onPostStop') {
      this.onPostStopCallback = callback;
    }
    // We don't care about any others the plugin registers
  }

  public expose() {
    // method is called by plugin that's being registered.
  }
}
