/*
 *  lib/magic.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-01-22
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

/*
 *  reports/read.js
 *
 *  David Janes
 *  Consensas
 *
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

let yaml = null;
try {
    yaml = require("js-yaml")
} catch (x) {
}

/**
 *  This will read a stdin file
 */
const _read_csv = _.promise.make((self, done) => {
    const csvtojson = require("csvtojson")
    const lines = []

    csvtojson({
        checkType: true,
        trim: true,
    })
        .fromFile(self.path)
        .on("json", json => {
            lines.push(json)
        })
        .on("done", error => {
            self.json = lines;
            done(error, self)
        })
})

/**
 *  This will read JSON or YAML from stdin
 */
const _read_stdin = _.promise.make((self, done) => {
    const fs = require(".")

    _.promise.make(self)
        .then(fs.read.stdin)
        .then(_.promise.make(sd => {
            if (yaml) {
                sd.json = yaml.safeLoad(sd.document)
            } else {
                sd.json = JSON.load(sd.document)
            }
        }))
        .then(_.promise.done(done, self, "json"))
        .catch(done)
})

/**
 *  This will read YAML file
 */
const _read_yaml = _.promise.make((self, done) => {
    const fs = require(".")

    _.promise.make(self)
        .then(fs.read.utf8)
        .then(_.promise.add("json", sd => yaml.safeLoad(sd.document)))
        .then(_.promise.done(done, self, "json"))
        .catch(done)
})

/**
 *  This will "do the right thing" depending on the file type
 */
const read = _.promise.make((self, done) => {
    const fs = require(".")

    _.promise.make(self)
        .then(_.promise.add("json", null))
        .then(_.promise.conditional(self.path.endsWith(".csv"), _read_csv))
        .then(_.promise.conditional(self.path === "-", _read_stdin))
        .then(_.promise.conditional(self.path.endsWith(".json"), fs.read.json))
        .then(_.promise.conditional(self.path.endsWith(".yaml"), _read_yaml))
        .then(_.promise.done(done, self, "json"))
        .catch(done)
})

/**
 *  Parameterized
 */
const read_p = (_path, _otherwise) => _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("path", _path || self.path))
        .then(_.promise.add("otherwise", _.is.Undefined(_otherwise) ? self.otherwise : _otherwise))
        .then(read)
        .then(_.promise.done(done, self, "json"))
        .catch(done);
})

/**
 *  API
 */
exports.read = read;
exports.read.p = read_p;
