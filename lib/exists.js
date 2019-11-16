/*
 *  lib/exists.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-09
 *
 *  Copyright (2013-2020) David P. Janes
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

const assert = require("assert")

const fs = require("fs")
const path = require("path")


/**
 *  Accepts: self.path
 *  Produces: self.exists
 */
const exists = _.promise.make((self, done) => {
    const method = "fs.exists";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`);

    self.exists = false;

    fs.access(self.path, fs.constants.F_OK, (error) => {
        if (error) {
            if (error.code === "ENOENT") {
                return done(null, self);
            }

            return done(error);
        }

        self.exists = true;

        done(null, self);
    })
})

/**
 *  API
 */
exports.exists = exists;
