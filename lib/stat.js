/*
 *  lib/stat.js
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

/**
 *  Accepts: self.path
 *  Produces: self.exists, self.stats
 */
const _stat = (call, method) => (_self, done) => {
    const self = _.d.clone.shallow(_self);

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);

    self.exists = false;
    self.stats = null;

    call(self.path, (error, stats) => {
        if (error) {
            if (error.code === "ENOENT") {
                return done(null, self);
            }

            return done(error);
        }

        self.exists = true;
        self.stats = stats;

        done(null, self);
    })
}

const stat = _stat(fs.stat, "fs.stat");
const stat_symbolic_link = _stat(fs.lstat, "fs.stat.symbolic_link");

/**
 *  API
 */
exports.stat = _.promise.denodeify(stat);
exports.stat.symbol_link = _.promise.denodeify(stat_symbolic_link);
