/*
 *  lib/write.js
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
const mime = require("mime")

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path, self.document_encoding, self.document
 *  Produces: 
 */
const write = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.write";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document) || _.is.String(self.document), `${method}: self.document expected to be a Buffer or String`)

    fs.writeFile(self.path, self.document_encoding, error => done(error, self))
}

/**
 *  Requires: self.path, self.document
 *  Produces: 
 */
const write_buffer = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.write.buffer";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document), `${method}: self.document expected to be a Buffer`)

    fs.writeFile(self.path, self.document, error => done(error, self))
}

/**
 *  Requires: self.path, self.document
 *  Produces: 
 */
const write_utf8 = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.write.utf8";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document) || _.is.String(self.document), `${method}: self.document expected to be a Buffer or String`)

    fs.writeFile(self.path, self.document, "utf-8", error => done(error, self))
}

/**
 *  Requires: self.path, self.json
 *  Produces: 
 */
const write_json = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.write.json";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.JSON(self.json), `${method}: self.json expected to be a JSON-like object`)

    fs.writeFile(self.path, JSON.stringify(self.json), "utf-8", error => done(error, self))
}

/**
 *  API
 */
exports.write = Q.denodeify(write);
exports.write.buffer = Q.denodeify(write_buffer);
exports.write.bytes = Q.denodeify(write_buffer);
exports.write.json = Q.denodeify(write_json);
exports.write.utf8 = Q.denodeify(write_utf8);
