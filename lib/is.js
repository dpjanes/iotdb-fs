/*
 *  lib/exists.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-11-12
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

const assert = require('assert'); 

const fs = require('fs');
const path = require('path');

const iotdb_fs = {
    stat: require("./stat").stat,
}

/**
 *  Accepts: self.path
 *  Produces: self.exists
 */
const _is = (statter, tester, method) => (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);

    _.promise.make(self)
        .then(statter)
        .then(_.promise.block(sd => {
            if (sd.exists && !tester(sd)) {
                sd.exists = false;
            }
        }))
        .then(_.promise.done(done, self, "exists"))
        .catch(done);
}

/**
 *  API
 */
exports.is = {}
exports.is.file = _.promise.denodeify(_is(iotdb_fs.stat, 
    sd => sd.stats.isFile(), "fs.is.file"));
exports.is.directory = _.promise.denodeify(_is(iotdb_fs.stat, 
    sd => sd.stats.isDirectory(), "fs.is.directory"));
exports.is.symbolic_link = _.promise.denodeify(_is(iotdb_fs.stat.symbolic_link, 
    sd => sd.stats.isSymbolicLink(), "fs.is.symbolic_link"));