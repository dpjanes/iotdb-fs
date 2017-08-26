/*
 *  lib/truncate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const _ = require("iotdb-helpers");

const Q = require("bluebird-q");

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path, 
 *  Accepts: self.document_length
 *  Produces: N/A
 */
const truncate = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.truncate";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.truncate(self.path, self.document_length || 0, error => done(error, self))
}

/**
 *  API
 */
exports.truncate = Q.denodeify(truncate);
