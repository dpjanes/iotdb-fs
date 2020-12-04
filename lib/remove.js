/*
 *  lib/remove.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-29
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

const assert = require("assert")
const node_fs = require("fs")
const path = require("path")

/**
 *  Requires: self.path
 *  Produces: N/A
 *
 */
const remove = _.promise((self, done) => {
    _.promise.validate(self, remove)

    node_fs.unlink(self.path, error => {
        if (error && (error.code !== "ENOENT")) {
            return done(error)
        }

        done(null, self)
    })
})

remove.method = "remove"
remove.description = `
    Remove a file. If the file does not exist, no error will be reported
`
remove.requires = {
    path: _.is.String,
}
remove.produces = {
}
remove.params = {
    path: _.p.normal,
}
remove.p = _.p(remove)

/**
 */
const remove_directory = _.promise((self, done) => {
    _.promise.validate(self, remove_directory)

    node_fs.rmdir(self.path, error => {
        if (error && (error.code !== "ENOENT")) {
            return done(error)
        }

        done(null, self)
    })
})

remove_directory.method = "remove.directory"
remove_directory.description = `
    Remove a directory. If the directory does not exist, no error will be reported
`
remove_directory.requires = {
    path: _.is.String,
}
remove_directory.produces = {
}
remove_directory.params = {
    path: _.p.normal,
}
remove_directory.p = _.p(remove_directory)

/**
 */
const remove_recursive = _.promise((self, done) => {
    _.promise.validate(self, remove_recursive)

    assert.ok(path.resolve(self.path) !== "/", `${remove_recursive.method}: I'm not letting you remove /, find something else`)

    const fs = require("..")
    const folders = []
    let stack = [ self.path ]

    const _handle_folder = _.promise((self, done) => {
        _.promise(self)
            .add("fs$otherwise_paths", [])
            .then(fs.list)

            .each({
                method: _handle_folder,
                inputs: "paths:path",
                error: () => {},
            })

            // .log("remove", "path")
            .then(_.promise.optional(fs.remove.directory))
            .then(_.promise.optional(fs.remove))

            .end(done, self)
    })

    _.promise(self)
        .then(fs.is.directory.really)
        .conditional(sd => sd.exists, _handle_folder, _.promise.optional(fs.remove))
        .end(done, self)
})

remove_recursive.method = "remove.recursive"
remove_recursive.description = ``
remove_recursive.requires = {
    path: _.is.String,
}
remove_recursive.produces = {
}
remove_recursive.params = {
    path: _.p.normal,
}
remove_recursive.p = _.p(remove_recursive)

/**
 *  API
 */
exports.remove = remove
exports.remove.directory = remove_directory
exports.remove.recursive = remove_recursive
