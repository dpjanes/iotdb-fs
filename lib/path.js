/*
 *  lib/path.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-10-22
 *
 *  Copyright [2013-2018] [David P. Janes]
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

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: N/A
 *  Produces: promise
 *
 *  Node that this is a function that returns a promise.
 *
 *  Usage:
 *      .then(fs.path("tmp.txt"))
 */
const path_parameterized = _path => _.promise.make((self, done) => {
    const method = "lib.path.p";

    assert.ok(_.is.String(_path), `${method}: expected _path to be a String`)

    self.path = _path;

    done(null, self)
})


/**
 *  API
 */
exports.path = path_parameterized;
