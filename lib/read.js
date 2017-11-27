/*
 *  lib/read.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
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

const mime = require("mime")
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path, self.document_encoding
 *  Accepts: self.otherwise
 *  Produces: self.document, self.document_media_type
 */
const read = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.read";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.readFile(self.path, self.document_encoding, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise;
            error = null;
        }

        if (error) {
            return done(error);
        }

        self.document = document;
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null;
        self.document_name = path.basename(self.path)

        done(null, self)
    })
}

/**
 *  Requires: self.path
 *  Accepts: self.otherwise
 *  Produces: self.document, self.document_media_type
 */
const read_buffer = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.read.buffer";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.readFile(self.path, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise;
            error = null;
        }

        if (error) {
            return done(error);
        }

        self.document = document;
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null;
        self.document_name = path.basename(self.path)

        done(null, self)
    })
}

/**
 *  Requires: self.path
 *  Accepts: self.otherwise
 *  Produces: self.document, self.document_media_type
 */
const read_utf8 = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.read.utf8";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.readFile(self.path, "utf-8", (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise;
            error = null;
        }

        if (error) {
            return done(error);
        }

        self.document = document;
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null;
        self.document_name = path.basename(self.path)

        done(null, self)
    })
}

/**
 *  Requires: self.path
 *  Accepts: self.otherwise
 *  Produces: self.json
 */
const read_json = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.read.json";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.readFile(self.path, "utf-8", (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            self.json = self.otherwise;
            return done(null, self)
        }

        if (error) {
            return done(error);
        }

        try {
            self.json = JSON.parse(document);
        } catch (x) {
            done(x)
        }

        done(null, self)
    })
}

/**
 *  Accepts: self.document_encoding || null (default: 'utf-8')
 *  Requires: 
 *  Produces: self.document
 */
const read_stdin = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "lib.read.stdin";

    const stdin = exports.read.shims.stdin;
    let result = [];

    stdin.setEncoding(self.document_encoding || 'utf8');
    stdin.on('readable', function () {
        let chunk;

        while ((chunk = stdin.read())) {
            result.push(chunk);
        }
    });

    stdin.on('end', function () {
        self.document = result.join("");

        done(null, self);
    });
};

/**
 *  Requires: N/A
 *  Produces: promise
 *
 *  Node that this is a function that returns a promise.
 *
 *  Usage:
 *      .then(fs.read.document("tmp.txt"))
 */
const read_parameterized = (_path, _document_encoding, _otherwise) => {
    return _.promise.denodeify((_self, done) => {
        const self = _.d.clone.shallow(_self)
        const method = "lib.read.p";

        const document_path = _path || self.path;
        const document_encoding = _document_encoding || self.document_encoding;

        assert.ok(_.is.String(document_path), `${method}: path is required`)
        assert.ok(_.is.String(document_encoding) || _.is.Nullish(document_encoding), 
            `${method}: document_encoding must be String or Nullish`)

        _.promise.make(self)
            .then(_.promise.add({
                path: document_path,
                document_encoding: document_encoding,
                otherwise: _.is.Undefined(_otherwise) ? self.otherwise : _otherwise,
            }))
            .then(exports.read)
            .then(sd => {
                self.document = sd.document;
                self.document_encoding = sd.document_encoding;
                self.document_media_type = sd.document_media_type;
                self.document_name = path.basename(document_path)

                done(null, self)
                return null;
            })
            .catch(done)
    })
}

/**
 *  API
 */
exports.read = _.promise.denodeify(read);
exports.read.p = read_parameterized;
exports.read.buffer = _.promise.denodeify(read_buffer);
exports.read.json = _.promise.denodeify(read_json);
exports.read.utf8 = _.promise.denodeify(read_utf8);
exports.read.stdin = _.promise.denodeify(read_stdin);

exports.read.shims = {
    stdin: process.stdin,
}
