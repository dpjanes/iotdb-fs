/*
 *  lib/stat.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-11-12
 *
 *  Copyright [2013-2019] David P. Janes
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


const fs = require("fs")
const path = require("path")

/**
 */
const _stat = (call, method) => {
    const f = _.promise.make((self, done) => {
        _.promise.validate(self, done)

        self.exists = false
        self.stats = null

        call(self.path, (error, stats) => {
            if (error) {
                if (error.code === "ENOENT") {
                    return done(null, self)
                }

                return done(error)
            }

            self.exists = true
            self.stats = stats

            done(null, self)
        })
    })

    f.method = method
    f.requires = {
        path: _.is.String,
    }
    f.produces = {
        exists: _.is.Boolean,
        stats: _.is.Object,
    }

    return f
}

const stat = _stat(fs.stat, "fs.stat")
const stat_symbolic_link = _stat(fs.lstat, "fs.stat.symbolic_link")

const stat_p = _path => _.promise((self, done) => {
    _.promise(self)
        .add("path", _path || self.path)
        .then(stat)
        .end(done, self, "exists,stats")
})

const stat_symbolic_link_p = _path => _.promise((self, done) => {
    _.promise(self)
        .add("path", _path || self.path)
        .then(stat_symbolic_link)
        .end(done, self, "exists,stats")
})

/**
 *  API
 */
exports.stat = stat
exports.stat.p = stat_p
exports.stat.symbolic = stat_symbolic_link
exports.stat.symbolic.p = stat_symbolic_link_p
exports.stat.symbolic_link = stat_symbolic_link
exports.stat.symbolic_link.p = stat_symbolic_link_p
