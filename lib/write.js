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

const fs = require("fs")
const path = require("path")

/**
 */
const write = _.promise((self, done) => {
    _.promise.validate(self, write)

    fs.writeFile(self.path, self.document, self.document_encoding || "utf-8", error => done(error, self))
})

write.method = "write"
write.requires = {
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}
write.accepts = {
    document_encoding: _.is.String,
}
write.produces = {
}

/**
 */
const write_p = (_path, _document, _document_encoding) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            document: _document,
            document_encoding: _document_encoding || "utf-8"
        })
        .then(exports.write)
        .end(done, self)
})

/**
 */
const write_buffer = _.promise((self, done) => {
    _.promise.validate(self, write_buffer)

    fs.writeFile(self.path, self.document, error => done(error, self))
})

write_buffer.method = "write.buffer"
write_buffer.requires = {
    path: _.is.String,
    document: _.is.Buffer,
}
write_buffer.accepts = {
}
write_buffer.produces = {
}

/**
 *  Requires: self.path, self.document
 *  Produces: 
 */
const write_utf8 = _.promise((self, done) => {
    _.promise.validate(self, write_utf8)

    fs.writeFile(self.path, self.document, "utf-8", error => done(error, self))
})

write_utf8.method = "write_utf8"
write_utf8.requires = {
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
}
write_utf8.accepts = {
    document_encoding: _.is.String,
}
write_utf8.produces = {
}

/**
 */
const write_json = _.promise((self, done) => {
    _.promise.validate(self, write_json)

    if (self.json$expanded) {
        fs.writeFile(self.path, JSON.stringify(self.json, null, 2) + "\n", "utf-8", error => done(error, self))
    } else {
        fs.writeFile(self.path, JSON.stringify(self.json), "utf-8", error => done(error, self))
    }
})

write_json.method = "write_json"
write_json.requires = {
    path: _.is.String,
    json: _.is.JSON,
}
write_json.accepts = {
    json$expanded: _.is.Boolean,
}
write_json.produces = {
}

/**
 */
const write_yaml = _.promise((self, done) => {
    const fs = require(".")
    const yaml = require("js-yaml")

    _.promise.make(self)
        .validate(write_yaml)

        .make(sd => {
            sd.document = yaml.safeDump(sd.json, {
                sortKeys: false,
            })
        })
        .then(fs.write.utf8)

        .end(done, self)
})

write_yaml.method = "write_yaml"
write_yaml.requires = {
    path: _.is.String,
    json: _.is.JSON,
}
write_yaml.accepts = {
}
write_yaml.produces = {
}

/**
 *  Parameterized
 */
const write_json_p = (_path, _json) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            json: _json,
        })
        .then(write_json)
        .end(done, self)
})

/**
 */
const write_stdout = _.promise.make((self, done) => {
    const method = "write.stdout";

    process.stdout.write(self.document)
    /*
    const stdout = exports.write.shims.stdout;
    let result = [];

    stdout.setEncoding(self.document_encoding || 'utf8');
    stdout.on('writeable', function () {
        let chunk;

        while ((chunk = stdout.write())) {
            result.push(chunk);
        }
    });

    stdout.on('end', function () {
        self.document = result.join("");

        done(null, self);
    });
    */
})

/**
 *  API
 */
exports.write = write;
exports.write.p = write_p;
exports.write.buffer = write_buffer;
exports.write.bytes = write_buffer;
exports.write.json = write_json;
exports.write.json.p = write_json_p;
exports.write.yaml = write_yaml;
exports.write.utf8 = write_utf8;
exports.write.stdout = write_stdout;
