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

import { download } from './download';
import Promise from 'bluebird';
import path from 'path';
import { cleanPrevious, cleanArtifacts } from './cleanup';
import { extract, getPackData } from './pack';
import { renamePlugin } from './rename';
import { sync as rimrafSync } from 'rimraf';
import { errorIfXPackInstall } from '../lib/error_if_x_pack';
import { existingInstall, rebuildCache, assertVersion } from './kibana';
import { prepareExternalProjectDependencies } from '@kbn/pm';
import mkdirp from 'mkdirp';

const mkdir = Promise.promisify(mkdirp);

export default async function install(settings, logger) {
  try {
    errorIfXPackInstall(settings, logger);

    await cleanPrevious(settings, logger);

    await mkdir(settings.workingPath);

    await download(settings, logger);

    await getPackData(settings, logger);

    await extract(settings, logger);

    rimrafSync(settings.tempArchiveFile);

    existingInstall(settings, logger);

    assertVersion(settings);

    await prepareExternalProjectDependencies(settings.workingPath);

    await renamePlugin(settings.workingPath, path.join(settings.pluginDir, settings.plugins[0].name));

    if (settings.optimize) {
      await rebuildCache(settings, logger);
    }

    logger.log('Plugin installation complete');
  } catch (err) {
    logger.error(`Plugin installation was unsuccessful due to error "${err.message}"`);
    cleanArtifacts(settings);
    process.exit(70); // eslint-disable-line no-process-exit
  }
}
