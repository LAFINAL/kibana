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

import expect from 'expect.js';

export default function ({ getService, getPageObjects }) {
  const retry = getService('retry');
  const PageObjects = getPageObjects(['common', 'header', 'home', 'dashboard']);

  describe('add data tutorials', function describeIndexTests() {

    it('directory should display registered tutorials', async ()=> {
      await PageObjects.common.navigateToUrl('home', 'tutorial_directory');
      await PageObjects.header.waitUntilLoadingHasFinished();
      await retry.try(async () => {
        const tutorialExists = await PageObjects.home.doesSynopsisExist('netflow');
        expect(tutorialExists).to.be(true);
      });
    });

    describe('apm', function describeIndexTests() {

      it('should install saved objects', async ()=> {
        await PageObjects.common.navigateToUrl('home', 'tutorial_directory');
        await PageObjects.header.waitUntilLoadingHasFinished();
        await retry.try(async () => {
          await PageObjects.home.clickSynopsis('apm');
        });

        await PageObjects.home.loadSavedObjects();

        await PageObjects.common.navigateToApp('dashboard');

        await PageObjects.dashboard.searchForDashboardWithName('APM');
        const countOfDashboards = await PageObjects.dashboard.getCountOfDashboardsInListingTable();
        expect(countOfDashboards).to.equal(5);
      });

    });

  });
}
