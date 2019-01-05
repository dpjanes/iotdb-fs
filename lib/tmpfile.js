/*
 *  lib/tmpfile.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-29
 *
 *  Copyright [2013-2019] David P. Janes
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

"use strict"

const _ = require("iotdb-helpers")

const tmp = require("tmp")

const assert = require("assert")

/**
 *  Produces: self.path
 *
 *  Create a temporary file name. The file
 *  will be deleted on process exit
 */
const tmpfile = _.promise.make((self, done) => {
    const method = "lib.tmpfile";

    tmp.file((error, path) => {
        if (error) {
            return done(error)
        }

        self.path = path;

        done(null, self)
    })
})

/**
 *  API
 */
exports.tmpfile = tmpfile;
