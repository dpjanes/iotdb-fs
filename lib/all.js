/*
 *  lib/all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-09-05
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
 *  Create a wrapper to do a whole bunch of operations.
 */
const all = f => {
    const _doit = (_self, done) => {
        const self = _.d.clone.shallow(_self)

        const ops = self.paths.map(path => inner_done => {
            Q(self)
                .then(sd => _.d.add(sd, "path", path))
                .then(f)
                .then(sd => inner_done(null, {
                    path: path,
                    json: sd.json,
                    document: sd.document,
                    document_media_type: sd.document_media_type,
                }))
                .catch(error => inner_done(null, {
                    path: path,
                    error: error,
                }))
        })

        Q(self)
            .then(sd => _.d.add(sd, "ops", ops))
            .then(_.promise.ops.series)
            .then(sd => {
                self.results = sd.results;
                done(null, self)
            })
            .catch(done)
    }

    return Q.denodeify(_doit)
}


/**
 *  API
 */
exports.all = Q.denodeify(all);
