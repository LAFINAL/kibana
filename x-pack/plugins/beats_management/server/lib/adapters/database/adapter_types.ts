/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { FrameworkRequest, FrameworkUser } from '../framework/adapter_types';
export interface DatabaseAdapter {
  putTemplate(user: FrameworkUser, params: DatabasePutTemplateParams): Promise<any>;
  get<Source>(
    user: FrameworkUser,
    params: DatabaseGetParams
  ): Promise<DatabaseGetDocumentResponse<Source>>;
  create(
    user: FrameworkUser,
    params: DatabaseCreateDocumentParams
  ): Promise<DatabaseCreateDocumentResponse>;
  index<T>(
    user: FrameworkUser,
    params: DatabaseIndexDocumentParams<T>
  ): Promise<DatabaseIndexDocumentResponse>;
  delete(
    user: FrameworkUser,
    params: DatabaseDeleteDocumentParams
  ): Promise<DatabaseDeleteDocumentResponse>;
  mget<T>(user: FrameworkUser, params: DatabaseMGetParams): Promise<DatabaseMGetResponse<T>>;
  bulk(
    user: FrameworkUser,
    params: DatabaseBulkIndexDocumentsParams
  ): Promise<DatabaseBulkResponse>;
  search<T>(user: FrameworkUser, params: DatabaseSearchParams): Promise<DatabaseSearchResponse<T>>;
}

export interface DatabaseKbnESCluster {
  callWithInternalUser(esMethod: string, options: {}): Promise<any>;
  callWithRequest(req: FrameworkRequest, esMethod: string, options: {}): Promise<any>;
}

export interface DatabaseKbnESPlugin {
  getCluster(clusterName: string): DatabaseKbnESCluster;
}

export interface DatabaseSearchParams extends DatabaseGenericParams {
  analyzer?: string;
  analyzeWildcard?: boolean;
  defaultOperator?: DefaultOperator;
  df?: string;
  explain?: boolean;
  storedFields?: DatabaseNameList;
  docvalueFields?: DatabaseNameList;
  fielddataFields?: DatabaseNameList;
  from?: number;
  ignoreUnavailable?: boolean;
  allowNoIndices?: boolean;
  expandWildcards?: ExpandWildcards;
  lenient?: boolean;
  lowercaseExpandedTerms?: boolean;
  preference?: string;
  q?: string;
  routing?: DatabaseNameList;
  scroll?: string;
  searchType?: 'query_then_fetch' | 'dfs_query_then_fetch';
  size?: number;
  sort?: DatabaseNameList;
  _source?: DatabaseNameList;
  _sourceExcludes?: DatabaseNameList;
  _sourceIncludes?: DatabaseNameList;
  terminateAfter?: number;
  stats?: DatabaseNameList;
  suggestField?: string;
  suggestMode?: 'missing' | 'popular' | 'always';
  suggestSize?: number;
  suggestText?: string;
  timeout?: string;
  trackScores?: boolean;
  version?: boolean;
  requestCache?: boolean;
  index?: DatabaseNameList;
  type?: DatabaseNameList;
}

export interface DatabaseSearchResponse<T> {
  took: number;
  timed_out: boolean;
  _scroll_id?: string;
  _shards: DatabaseShardsResponse;
  hits: {
    total: number;
    max_score: number;
    hits: Array<{
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: T;
      _version?: number;
      _explanation?: DatabaseExplanation;
      fields?: any;
      highlight?: any;
      inner_hits?: any;
      sort?: string[];
    }>;
  };
  aggregations?: any;
}

export interface DatabaseExplanation {
  value: number;
  description: string;
  details: DatabaseExplanation[];
}

export interface DatabaseShardsResponse {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

export interface DatabaseGetDocumentResponse<Source> {
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  found: boolean;
  _source: Source;
}

export interface DatabaseBulkResponse {
  took: number;
  errors: boolean;
  items: Array<
    DatabaseDeleteDocumentResponse | DatabaseIndexDocumentResponse | DatabaseUpdateDocumentResponse
  >;
}

export interface DatabaseBulkIndexDocumentsParams extends DatabaseGenericParams {
  waitForActiveShards?: string;
  refresh?: DatabaseRefresh;
  routing?: string;
  timeout?: string;
  type?: string;
  fields?: DatabaseNameList;
  _source?: DatabaseNameList;
  _sourceExcludes?: DatabaseNameList;
  _sourceIncludes?: DatabaseNameList;
  pipeline?: string;
  index?: string;
}

export interface DatabaseMGetParams extends DatabaseGenericParams {
  storedFields?: DatabaseNameList;
  preference?: string;
  realtime?: boolean;
  refresh?: boolean;
  _source?: DatabaseNameList;
  _sourceExcludes?: DatabaseNameList;
  _sourceIncludes?: DatabaseNameList;
  index: string;
  type?: string;
}

export interface DatabaseMGetResponse<T> {
  docs?: Array<DatabaseGetResponse<T>>;
}

export interface DatabasePutTemplateParams extends DatabaseGenericParams {
  name: string;
  body: any;
}

export interface DatabaseDeleteDocumentParams extends DatabaseGenericParams {
  waitForActiveShards?: string;
  parent?: string;
  refresh?: DatabaseRefresh;
  routing?: string;
  timeout?: string;
  version?: number;
  versionType?: DatabaseVersionType;
  index: string;
  type: string;
  id: string;
}

export interface DatabaseIndexDocumentResponse {
  found: boolean;
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
}

export interface DatabaseUpdateDocumentResponse {
  found: boolean;
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
}

export interface DatabaseDeleteDocumentResponse {
  found: boolean;
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
}

export interface DatabaseIndexDocumentParams<T> extends DatabaseGenericParams {
  waitForActiveShards?: string;
  opType?: 'index' | 'create';
  parent?: string;
  refresh?: string;
  routing?: string;
  timeout?: string;
  timestamp?: Date | number;
  ttl?: string;
  version?: number;
  versionType?: DatabaseVersionType;
  pipeline?: string;
  id?: string;
  index: string;
  type: string;
  body: T;
}

export interface DatabaseGetResponse<T> {
  found: boolean;
  _source: T;
}
export interface DatabaseCreateDocumentParams extends DatabaseGenericParams {
  waitForActiveShards?: string;
  parent?: string;
  refresh?: DatabaseRefresh;
  routing?: string;
  timeout?: string;
  timestamp?: Date | number;
  ttl?: string;
  version?: number;
  versionType?: DatabaseVersionType;
  pipeline?: string;
  id?: string;
  index: string;
  type: string;
}

export interface DatabaseCreateDocumentResponse {
  created: boolean;
  result: string;
}

export interface DatabaseDeleteDocumentParams extends DatabaseGenericParams {
  waitForActiveShards?: string;
  parent?: string;
  refresh?: DatabaseRefresh;
  routing?: string;
  timeout?: string;
  version?: number;
  versionType?: DatabaseVersionType;
  index: string;
  type: string;
  id: string;
}

export interface DatabaseGetParams extends DatabaseGenericParams {
  storedFields?: DatabaseNameList;
  parent?: string;
  preference?: string;
  realtime?: boolean;
  refresh?: boolean;
  routing?: string;
  _source?: DatabaseNameList;
  _sourceExcludes?: DatabaseNameList;
  _sourceIncludes?: DatabaseNameList;
  version?: number;
  versionType?: DatabaseVersionType;
  id: string;
  index: string;
  type: string;
}

export type DatabaseNameList = string | string[] | boolean;
export type DatabaseRefresh = boolean | 'true' | 'false' | 'wait_for' | '';
export type DatabaseVersionType = 'internal' | 'external' | 'external_gte' | 'force';
export type ExpandWildcards = 'open' | 'closed' | 'none' | 'all';
export type DefaultOperator = 'AND' | 'OR';
export type DatabaseConflicts = 'abort' | 'proceed';

export interface DatabaseGenericParams {
  requestTimeout?: number;
  maxRetries?: number;
  method?: string;
  body?: any;
  ignore?: number | number[];
  filterPath?: string | string[];
}

export interface DatabaseDeleteDocumentResponse {
  found: boolean;
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
}
