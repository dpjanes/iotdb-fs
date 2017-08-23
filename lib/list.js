/*
 *  lib/list.js
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
const errors = require("iotdb-errors");

const Q = require("bluebird-q");

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path
 *  Accepts: self.filter, self.filter_path
 *  Produces: self.paths
 */
const list = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.list";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`)
    assert.ok(_.is.Function(self.filter) || _.is.Nullish(self.filter), `${method}: self.filter must be a Function or Null`)
    assert.ok(_.is.Function(self.filter_path) || _.is.Nullish(self.filter_path), 
        `${method}: self.filter_path must be a Function or Null`)

    fs.readdir(self.path, (error, names) => {
        if (error) {
            return done(error);
        }

        self.paths = names
            .filter(self.filter || (() => true))
            .map(name => path.join(self.path, name))
            .filter(self.filter_path || (() => true))

        done(null, self)
    })
}

/**
 *  API
 */
exports.list = Q.denodeify(list);
