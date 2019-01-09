/*
 *  lib/tmpfile.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-29
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

const path = require("path")
const os = require("os")

/**
 *  Produces: self.path
 *
 *  will be deleted on process exit
 */
const tmpfile = extension => _.promise(self => {
    _.promise.validate(self, tmpfile)

    const p = path.join(os.tmpdir(), `tmp-${process.pid}-${_.random.id(12)}${extension}`)

    const _cleanup = () => {
        const fs = require("..")

        process.removeListener("beforeExit", _cleanup)
        process.removeListener("SIGINT", _cleanup)
        process.removeListener("SIGUSR1", _cleanup)
        process.removeListener("SIGUSR2", _cleanup)
        process.removeListener("uncaughtException", _cleanup)

        _.promise({
            path: p,
        })
            // .then(fs.remove.recursive)
            .make(sd => {
                console.log("-", "removed on exit", p)
            })
            .catch(error => {
            })
    }

    process.on("beforeExit", _cleanup)
    process.on("SIGINT", _cleanup)
    process.on("SIGUSR1", _cleanup)
    process.on("SIGUSR2", _cleanup)
    process.on("uncaughtException", _cleanup)

    self.path = p
})

tmpfile.method = "tmpfile"
tmpfile.description = `
    Create a temporary file name in self.path.
    The file will be delete on exit`
tmpfile.requires = {
}
tmpfile.produces = {
    path: _.is.String,
}

/**
 *  API
 */
exports.tmpfile = tmpfile("");
exports.tmpfile.extension = tmpfile;
