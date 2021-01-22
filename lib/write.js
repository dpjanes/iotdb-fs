/*
 *  lib/write.js
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
write.params = {
    path: _.p.normal,
    document: _.p.normal,
    document_encoding: _.p.normal,
}
write.p = _.p(write)

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
write_buffer.params = {
    path: _.p.normal,
    document: _.p.normal,
}
write_buffer.p = _.p(write_buffer)

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
write_utf8.params = {
    path: _.p.normal,
    document: _.p.normal,
}
write_utf8.p = _.p(write_utf8)

/**
 */
const write_json = _.promise((self, done) => {
    _.promise.validate(self, write_json)

    if (self.json$expanded || self.fs$pretty) {
        fs.writeFile(self.path, JSON.stringify(self.json, null, 2) + "\n", "utf-8", error => done(error, self))
    } else {
        fs.writeFile(self.path, JSON.stringify(self.json), "utf-8", error => done(error, self))
    }
})

write_json.method = "write_json"
write_json.description = `
    Write JSON.
`
write_json.requires = {
    path: _.is.String,
    json: _.is.JSON,
}
write_json.accepts = {
    json$expanded: _.is.Boolean, // depreciated
    fs$pretty: _.is.Boolean, 
}
write_json.produces = {
}
write_json.params = {
    path: _.p.normal,
    json: _.p.normal,
}
write_json.p = _.p(write_json)

/**
 */
const write_json_pretty = _.promise((self, done) => {
    _.promise.validate(self, write_json_pretty)

    fs.writeFile(self.path, JSON.stringify(self.json, null, 2) + "\n", "utf-8", error => done(error, self))
})

write_json_pretty.method = "write.json.pretty"
write_json_pretty.description = `
    Write JSON pretty printed
`
write_json_pretty.requires = {
    path: _.is.String,
    json: _.is.JSON,
}
write_json_pretty.accepts = {
}
write_json_pretty.produces = {
}
write_json_pretty.params = {
    path: _.p.normal,
    json: _.is.JSON,
}
write_json_pretty.p = _.p(write_json_pretty)

/**
 */
const write_yaml = _.promise((self, done) => {
    const fs = require(".")
    const yaml = require("js-yaml")

    _.promise.make(self)
        .validate(write_yaml)

        .make(sd => {
            sd.document = yaml.dump(sd.json, {
                sortKeys: false,
                noRefs: true,
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
write_yaml.params = {
    path: _.p.normal,
}
write_yaml.p = _.p(write_yaml)

/**
 */
const write_stdout = _.promise.make(self => {
    _.promise.validate(self, write_stdout)

    process.stdout.write(self.document)
})

write_stdout.method = "write.stdout"
write_stdout.requires = {
    document: _.is.String, 
}
write_stdout.accepts = {
}
write_stdout.produces = {
}
write_stdout.params = {
    document: _.p.normal,
}
write_stdout.p = _.p(write_stdout)

/**
 *  API
 */
exports.write = write
exports.write.buffer = write_buffer
exports.write.bytes = write_buffer
exports.write.json = write_json
exports.write.json.pretty = write_json_pretty
exports.write.yaml = write_yaml
exports.write.utf8 = write_utf8
exports.write.stdout = write_stdout
