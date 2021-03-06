/*
 *  lib/truncate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
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

const fs = require("fs")

/**
 */
const truncate = _.promise.make((self, done) => {
    _.promise.validate(self, truncate)

    fs.truncate(self.path, self.fs$length || 0, error => done(error, self))
})

truncate.method = "truncate"
truncate.requires = {
    path: _.is.String,
}
truncate.accepts = {
    fs$length: _.is.Integer,
}
truncate.produces = {
}
truncate.params = {
    path: _.p.normal,
    fs$length: _.p.normal,
}
truncate.p = _.p(truncate)

/**
 *  API
 */
exports.truncate = truncate
