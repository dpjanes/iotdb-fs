/*
 *  lib/all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-09-05
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
 *  Do one operation and collection the result
 */
const _one = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(self.f)
        .then(_.promise.make(sd => {
            done(null, {
                path: self.path,
                json: sd.json,
                exists: sd.exists,
                document: sd.document,
                document_name: sd.document_name,
                document_media_type: sd.document_media_type,
            })
        }))
        .catch(error => {
            done(null, {
                path: self.path,
                error: error,
                exists: false,
            })
            return null;
        });
});


/**
 *  Create a wrapper to do a whole bunch of operations.
 *
 *  e.g.:
 *
 *      .then(fs.all(fs.read.json))
 */
const all = f => _.promise.make((self, done) => {
    const method = "all"

    assert.ok(_.is.Array.of.String(self.paths), `${method}: expected self.path to be an Array of String`)

    _.promise.make(self)
        .then(_.promise.add({
            "f": f,
        }))
        .then(_.promise.series({
            method: _one,
            inputs: "paths:path",
            outputs: "outputs",
        }))
        .then(_.promise.make(sd => {
            sd.jsons = sd.outputs.map(result => result.json)
            sd.documents = sd.outputs.map(result => result.document)
        }))
        .then(_.promise.done(done, self, "outputs,jsons,documents"))
        .catch(done)
})

/**
 *  API
 */
exports.all = all;
