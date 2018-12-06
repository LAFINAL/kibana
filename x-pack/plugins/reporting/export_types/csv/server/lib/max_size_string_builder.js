/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export class MaxSizeStringBuilder {
  constructor(maxSizeBytes) {
    this._buffer = Buffer.alloc(maxSizeBytes);
    this._size = 0;
    this._maxSize = maxSizeBytes;
  }

  tryAppend(str) {
    const byteLength = Buffer.byteLength(str);
    if (this._size + byteLength <= this._maxSize) {
      this._buffer.write(str, this._size);
      this._size += byteLength;
      return true;
    }

    return false;
  }

  getString() {
    return this._buffer.slice(0, this._size).toString();
  }
}
