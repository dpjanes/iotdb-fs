/*
 *  lib/magic.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-01-22
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
const fs = require("iotdb-fs")
const assert = require("assert")

let yaml = null
try {
    yaml = require("js-yaml")
} catch (x) {
}

/**
 *  This will read a stdin file
 */
const _read_csv = _.promise((self, done) => {
    const csvtojson = require("csvtojson")
    const lines = []

    csvtojson({
        flatKeys: true,
        checkType: true,
        trim: true,
    })
        .fromFile(self.path)
        .subscribe(
            json => lines.push(json),
            error => done(error),
            () => {
                self.json = lines;
                done(error, self)
            }
        );
})

/**
 *  This will read JSON or YAML from stdin
 */
const _read_stdin = _.promise((self, done) => {
    const fs = require(".")

    _.promise(self)
        .then(fs.read.stdin)
        .make(sd => {
            if (yaml) {
                sd.json = yaml.safeLoad(sd.document)
            } else {
                sd.json = JSON.load(sd.document)
            }
        })
        .end(done, self, "json")
})

/**
 */
const read = _.promise((self, done) => {
    const fs = require(".")

    _.promise.validate(self, read)

    let f = fs.read.json
    if (self.path.endsWith(".csv")) {
        f = _read_csv
    } else if (self.path === "-") {
        f = _read_stdin
    } else if (self.path.endsWith(".json")) {
        f = fs.read.json
    } else if (self.path.endsWith(".yaml")) {
        f = fs.read.yaml
    }

    _.promise(self)
        .then(f)
        .end(done, self, "json")
})

read.method = "fs.read.json.magic"
read.description = `This will "do the right thing" depending on the file type`
read.requires = {
    path: _.is.String,
}
read.accepts = {
    otherwise: _.is.Anything,
}
read.produces = {
    json: _.is.Anything,
}

/**
 *  Parameterized
 */
const read_p = (_path, _otherwise) => _.promise((self, done) => {
    _.promise(self)
        .then(_.promise.add({
            path: _path || self.path,
            otherwise: _.is.Undefined(_otherwise) ? self.otherwise : _otherwise,
        }))
        .then(read)
        .end(done, self, "json")
})

/**
 *  API
 */
exports.read = read;
exports.read.p = read_p;
