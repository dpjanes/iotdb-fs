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

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Create a wrapper to do a whole bunch of operations.
 *
 *  e.g.:
 *
 *      .then(fs.all(fs.read.json))
 */
const all = f => _.promise.denodeify((_self, done) => {
    const self = _.d.clone.shallow(_self)

    /**
     *  Do one operation and collection the result
     */
    const _one = _.promise.denodeify((_sd, done) => {
        _.promise.make(_sd)
            .then(f)
            .then(_.promise.block(sd => {
                done(null, {
                    path: _sd.path,
                    json: sd.json,
                    exists: sd.exists,
                    document: sd.document,
                    document_name: sd.document_name,
                    document_media_type: sd.document_media_type,
                })
            }))
            .catch(error => {
                done(null, {
                    path: _sd.path,
                    error: error,
                    exists: false,
                })
                return null;
            });
    });

    _.promise.make(self)
        .then(_.promise.series({
            method: _one,
            inputs: "paths:path",
            outputs: "outputs",
        }))
        .then(_.promise.block(sd => {
            self.outputs = sd.outputs;
            self.jsons = sd.outputs.map(result => result.json)
            self.documents = sd.outputs.map(result => result.document)

            done(null, self)
        }))
        .catch(done)
})

/**
 *  API
 */
exports.all = all;
