/*
 *  lib/write.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
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
const errors = require("iotdb-errors")

const assert = require("assert")
const fs = require("fs")
const path = require("path")

/**
 *  Requires: self.path, self.document_encoding, self.document
 *  Produces: 
 */
const write = _.promise.make((self, done) => {
    const method = "write";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document) || _.is.String(self.document), 
        `${method}: self.document expected to be a Buffer or String`)
    assert.ok(_.is.String(self.document_encoding), `${method}: self.document_encoding is required`)

    fs.writeFile(self.path, self.document, self.document_encoding, error => done(error, self))
})

/**
 *  Requires: N/A
 *  Produces: promise
 *
 *  Node that this is a function that returns a promise.
 *
 *  Usage:
 *      .then(fs.write.document("tmp.txt", "Hello, World\n"))
 */
const write_parameterized = (_path, _document, _document_encoding) => _.promise.make((self, done) => {
    const method = "write.p";

    const path = _path || self.path;
    const document = _document || self.document;
    const document_encoding = _document_encoding || self.document_encoding;

    assert.ok(_.is.Buffer(document) || _.is.String(document), 
        `${method}: document expected to be a Buffer or String`)
    assert.ok(_.is.String(document_encoding) || _.is.String(document), 
        `${method}: document_encoding is required for Buffers`)
    assert.ok(_.is.String(path), `${method}: path is required`)

    _.promise.make(self)
        .then(_.promise.add({
            path: path,
            document: document,
            document_encoding: document_encoding || "utf-8"
        }))
        .then(exports.write)
        .then(_.promise.done(done, self))
        .catch(done);
})

/**
 *  Requires: self.path, self.document
 *  Produces: 
 */
const write_buffer = _.promise.make((self, done) => {
    const method = "write.buffer";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document), `${method}: self.document expected to be a Buffer`)

    fs.writeFile(self.path, self.document, error => done(error, self))
})

/**
 *  Requires: self.path, self.document
 *  Produces: 
 */
const write_utf8 = _.promise.make((self, done) => {
    const method = "write.utf8";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.Buffer(self.document) || _.is.String(self.document), 
        `${method}: self.document expected to be a Buffer or String`)

    fs.writeFile(self.path, self.document, "utf-8", error => done(error, self))
})

/**
 *  Requires: self.path, self.json
 *  Accepts: self.json_write_expanded
 *  Produces: 
 */
const write_json = _.promise.make((self, done) => {
    const method = "write.utf8";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(_.is.JSON(self.json), `${method}: self.json expected to be a JSON-like object`)

    if (self.json$expanded) {
        fs.writeFile(self.path, JSON.stringify(self.json, null, 2) + "\n", "utf-8", error => done(error, self))
    } else {
        fs.writeFile(self.path, JSON.stringify(self.json), "utf-8", error => done(error, self))
    }
})

/**
 *  Parameterized
 */
const write_json_p = (_path, _json) => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            path: _path,
            json: _json,
        }))
        .then(write_json)
        .then(_.promise.done(done, self))
        .catch(done);
})

/**
 *  API
 */
exports.write = write;
exports.write.p = write_parameterized;
exports.write.buffer = write_buffer;
exports.write.bytes = write_buffer;
exports.write.json = write_json;
exports.write.json.p = write_json_p;
exports.write.utf8 = write_utf8;
