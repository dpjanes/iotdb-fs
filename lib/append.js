/*
 *  lib/append.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-04-29
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

const fs = require("fs")
const path = require("path")

/**
 */
const append = _.promise((self, done) => {
    _.promise.validate(self, append)

    fs.appendFile(self.path, self.document, self.document_encoding || buffer, error => done(error, self))
})

append.method = "append"
append.requires = {
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}
append.accepts = {
    document_encoding: _.is.String,
}
append.produces = {
}

/**
 */
const append_p = (_path, _document, _document_encoding) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            document: _document,
            document_encoding: _document_encoding || "utf-8"
        })
        .then(exports.append)
        .end(done, self)
})

/**
 */
const append_line = (_path, _document, _document_encoding) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            document: _document + "\n",
            document_encoding: _document_encoding || "utf-8"
        })
        .then(exports.append)
        .end(done, self)
})

/**
 */
const append_json = _.promise((self, done) => {
    _.promise.validate(self, append_json)

    fs.appendFile(self.path, JSON.stringify(self.json, null, 2) + "\n", "utf-8", error => done(error, self))
})

append_json.method = "append_json"
append_json.requires = {
    path: _.is.String,
    json: _.is.JSON,
}
append_json.accepts = {
}
append_json.produces = {
}

/**
 *  Parameterized
 */
const append_json_p = (_path, _json) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            json: _json,
        })
        .then(append_json)
        .end(done, self)
})

/**
 *  API
 */
exports.append = append;
exports.append.p = append_p;
exports.append.line = append_line;
exports.append.json = append_json;
exports.append.json.p = append_json_p;
