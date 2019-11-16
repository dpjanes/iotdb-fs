/*
 *  lib/read.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
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

const mime = require("mime")
mime.getType = mime.getType || mime.lookup; // 2.0.3 vs 1.6.0 

const assert = require("assert")
const fs = require("fs")
const path = require("path")

/**
 */
const read = _.promise((self, done) => {
    _.promise.validate(self, read)

    fs.readFile(self.path, self.document_encoding, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise
            error = null
        }

        if (error) {
            return done(error)
        }

        self.document = document
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null
        self.document_name = path.basename(self.path)

        done(null, self)
    })
})

read.method = "read"
read.requires = {
    path: _.is.String,
}
read.accepts = {
    document_encoding: _.is.String,
    otherwise: _.is.Anything,
}
read.produces = {
    document: _.is.Anything,
    document_media_type: _.is.String,
    document_encoding: _.is.Null,
    document_name: _.is.String,
}

/**
 */
const read_buffer = _.promise((self, done) => {
    _.promise.validate(self, read_buffer)

    fs.readFile(self.path, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise
            error = null
        }

        if (error) {
            return done(error)
        }

        self.document = document
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null
        self.document_name = path.basename(self.path)

        done(null, self)
    })
})

read_buffer.method = "read.buffer"
read_buffer.requires = {
    path: _.is.String,
}
read_buffer.accepts = {
    document_encoding: _.is.String,
    otherwise: _.is.Anything,
}
read_buffer.produces = {
    document: _.is.Anything,
    document_media_type: _.is.String,
    document_encoding: _.is.Null,
    document_name: _.is.String,
}

/**
 */
const read_utf8 = _.promise((self, done) => {
    _.promise.validate(self, read_utf8)

    fs.readFile(self.path, "utf-8", (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            document = self.otherwise
            error = null
        }

        if (error) {
            return done(error)
        }

        self.document = document
        self.document_media_type = mime.getType(self.path)
        self.document_encoding = null
        self.document_name = path.basename(self.path)

        done(null, self)
    })
})

read_utf8.method = "read.utf8"
read_utf8.requires = {
    path: _.is.String,
}
read_utf8.accepts = {
    document_encoding: _.is.String,
    otherwise: _.is.Anything,
}
read_utf8.produces = {
    document: _.is.Anything,
    document_media_type: _.is.String,
    document_encoding: _.is.Null,
    document_name: _.is.String,
}

/**
 */
const read_json = _.promise((self, done) => {
    fs.readFile(self.path, "utf-8", (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            self.json = self.otherwise
            return done(null, self)
        }

        if (error) {
            return done(error)
        }

        try {
            self.json = JSON.parse(document)
        } catch (x) {
            if (_.is.Undefined(self.otherwise)) {
                return done(x)
            }

            self.json = self.otherwise
        }

        done(null, self)
    })
})

read_json.method = "read.json"
read_json.requires = {
    path: _.is.String,
}
read_json.accepts = {
    otherwise: _.is.Anything,
}
read_json.produces = {
    json: _.is.Anything,
}

/**
 */
const read_jsons = _.promise((self, done) => {
    _.promise.validate(self, read_jsons)

    fs.readFile(self.path, "utf-8", (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            self.json = self.otherwise
            return done(null, self)
        }

        let jsons = null
        try {
            jsons = JSON.parse(document)
        } catch (x) {
            if (_.is.Undefined(self.otherwise)) {
                return done(x)
            }

            self.json = self.otherwise
        }

        if (_.is.Array(jsons)) {
            self.jsons = jsons
        } else if (_.is.Undefined(self.otherwise)) {
            return done(new errors.Invalid("expected an Array"))
        } else {
            self.jsons = self.otherwise
        }

        done(null, self)
    })
})

read_jsons.method = "read.jsons"
read_jsons.requires = {
    path: _.is.String,
}
read_jsons.accepts = {
    otherwise: _.is.Anything,
}
read_jsons.produces = {
    jsons: _.is.Anything,
}

/**
 *  This will read YAML file with one thing in it
 */
const read_yaml = _.promise((self, done) => {
    const yaml = require("js-yaml")

    _.promise.validate(self, read_yamls)

    fs.readFile(self.path, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            self.json = self.otherwise

            return done(null, self)
        }

        if (error) {
            return done(error)
        }

        try {
            self.json = yaml.safeLoad(document)

            done(null, self)
        } catch (x) {
            if (_.is.Undefined(self.otherwise)) {
                return done(x)
            } else {
                self.json = self.otherwise

                return done(null, self)
            }
        }
    })
})

read_yaml.method = "read.yaml"
read_yaml.requires = {
    path: _.is.String,
}
read_yaml.accepts = {
    otherwise: _.is.Anything,
}
read_yaml.produces = {
    jsons: _.is.Anything,
}

/**
 *  This will read YAML file with multiple things in it
 */
const read_yamls = _.promise((self, done) => {
    const yaml = require("js-yaml")

    _.promise.validate(self, read_yamls)

    fs.readFile(self.path, (error, document) => {
        if (error && (error.code === "ENOENT") && !_.is.Undefined(self.otherwise)) {
            self.jsons = self.json = self.otherwise

            return done(null, self)
        }

        if (error) {
            return done(error)
        }

        try {
            self.jsons = self.json = yaml.safeLoadAll(document)

            done(null, self)
        } catch (x) {
            if (_.is.Undefined(self.otherwise)) {
                return done(x)
            } else {
                self.jsons = self.json = self.otherwise

                return done(null, self)
            }
        }
    })
})

read_yamls.method = "read.yamls"
read_yamls.requires = {
    path: _.is.String,
}
read_yamls.accepts = {
    otherwise: _.is.Anything,
}
read_yamls.produces = {
    jsons: _.is.Anything,
}

/**
 */
const read_stdin = _.promise((self, done) => {
    const method = "read.stdin"

    const stdin = exports.read.shims.stdin
    let result = []

    stdin.setEncoding(self.document_encoding || 'utf8')
    stdin.on('readable', function () {
        let chunk

        while ((chunk = stdin.read())) {
            result.push(chunk)
        }
    })

    stdin.on('end', function () {
        self.document = result.join("")

        done(null, self)
    })
})

read_stdin.method = "read.yamls"
read_stdin.requires = {
    path: _.is.String,
}
read_stdin.accepts = {
    document_encoding: _.is.String,
}
read_stdin.produces = {
    document: _.is.String,
}

/**
 *  Usage:
 *      .then(fs.read.document("tmp.txt"))
 */
const read_parameterized = (_path, _document_encoding, _otherwise) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            document_encoding: _document_encoding || self.document_encoding,
            otherwise: _.is.Undefined(_otherwise) ? self.otherwise : _otherwise,
        })
        .then(exports.read)
        .make(sd => {
            sd.document_name = path.basename(sd.path)
        })
        .end(done, self, "document,document_encoding,document_media_type,document_name")
})

const read_json_p = (_path, _otherwise) => _.promise((self, done) => {
    _.promise(self)
        .add({
            path: _path || self.path,
            otherwise: _.is.Undefined(_otherwise) ? self.otherwise : _otherwise,
        })
        .then(read_json)
        .end(done, self, "json")
})

/**
 *  API
 */
exports.read = read
exports.read.p = read_parameterized
exports.read.buffer = read_buffer
exports.read.json = read_json
exports.read.jsons = read_jsons
exports.read.json.p = read_json_p
exports.read.yaml = read_yaml
exports.read.yamls = read_yamls
exports.read.utf8 = read_utf8
exports.read.stdin = read_stdin

exports.read.shims = {
    stdin: process.stdin,
}
