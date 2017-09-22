/*
 *  lib/mkdir.js
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

const mkdirp = require("mkdirp");

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path
 *  Produces: N/A
 */
const mkdir = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.mkdir";

    assert.ok(_.is.String(self.path), `${method}: path is required`)

    mkdirp(self.path, error => {
        if (error) {
            return done(error);
        }

        done(null, _self)
    })
}

/**
 *  Requires: self.path
 *  Produces: N/A
 */
const mkdir_parent = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.mkdir.parent";

    assert.ok(_.is.String(self.path), `${method}: path is required`)

    _.promise.make(self)
        .then(sd => _.d.add(sd, "path", path.dirname(self.path)))
        .then(exports.mkdir)
        .then(() => done(null, _self))
        .catch(done);
}

/**
 *  API
 */
exports.mkdir = _.promise.denodeify(mkdir);
exports.mkdir.parent = _.promise.denodeify(mkdir_parent);
