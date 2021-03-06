/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { XPACK_INFO_API_DEFAULT_POLL_FREQUENCY_IN_MILLIS } from '../../server/lib/constants';

/**
 * User-configurable settings for xpack.monitoring via configuration schema
 * @param {Object} Joi - HapiJS Joi module that allows for schema validation
 * @return {Object} config schema
 */
export const config = (Joi) => {
  const DEFAULT_REQUEST_HEADERS = [ 'authorization' ];

  return Joi.object({
    ccs: Joi.object({
      enabled: Joi.boolean().default(true)
    }).default(),
    enabled: Joi.boolean().default(true),
    ui: Joi.object({
      enabled: Joi.boolean().default(true),
      container: Joi.object({
        elasticsearch: Joi.object({
          enabled: Joi.boolean().default(false)
        }).default(),
        logstash: Joi.object({
          enabled: Joi.boolean().default(false)
        }).default()
      }).default()
    }).default(),
    index_pattern: Joi.string().default('.monitoring-*-2-*,.monitoring-*-6-*'),
    kibana: Joi.object({
      index_pattern: Joi.string().default('.monitoring-kibana-2-*,.monitoring-kibana-6-*'),
      collection: Joi.object({
        enabled: Joi.boolean().default(true),
        interval: Joi.number().default(10000) // op status metrics get buffered at `ops.interval` and flushed to the bulk endpoint at this interval
      }).default()
    }).default(),
    logstash: Joi.object({
      index_pattern: Joi.string().default('.monitoring-logstash-2-*,.monitoring-logstash-6-*')
    }).default(),
    beats: Joi.object({
      index_pattern: Joi.string().default('.monitoring-beats-6-*')
    }).default(),
    cluster_alerts: Joi.object({
      enabled: Joi.boolean().default(true),
      index: Joi.string().default('.monitoring-alerts-6'),
      email_notifications: Joi.object({
        enabled: Joi.boolean().default(true),
        email_address: Joi.string().email(),
      }).default()
    }).default(),
    xpack_api_polling_frequency_millis: Joi.number().default(XPACK_INFO_API_DEFAULT_POLL_FREQUENCY_IN_MILLIS),
    max_bucket_size: Joi.number().default(10000),
    min_interval_seconds: Joi.number().default(10),
    show_license_expiration: Joi.boolean().default(true),
    report_stats: Joi.boolean().default(true),
    agent: Joi.object({
      interval: Joi.string().regex(/[\d\.]+[yMwdhms]/).default('10s')
    }).default(),
    elasticsearch: Joi.object({
      customHeaders: Joi.object().default({}),
      index_pattern: Joi.string().default('.monitoring-es-2-*,.monitoring-es-6-*'),
      logQueries: Joi.boolean().default(false),
      requestHeadersWhitelist: Joi.array().items().single().default(DEFAULT_REQUEST_HEADERS),
      url: Joi.string().uri({ scheme: ['http', 'https'] }), // if empty, use Kibana's connection config
      username: Joi.string(),
      password: Joi.string(),
      requestTimeout: Joi.number().default(30000),
      pingTimeout: Joi.number().default(30000),
      ssl: Joi.object({
        verificationMode: Joi.string().valid('none', 'certificate', 'full').default('full'),
        certificateAuthorities: Joi.array().single().items(Joi.string()),
        certificate: Joi.string(),
        key: Joi.string(),
        keyPassphrase: Joi.string(),
        alwaysPresentCertificate: Joi.boolean().default(false),
      }).default(),
      apiVersion: Joi.string().default('master')
    }).default()
  }).default();
};
