/*
 *  rx/list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-11-17
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

/**
 */
const list = _.promise((self, done) => {
    _.promise.validate(self, list)

    const rx = require("rxjs")
    const rxops = require("rxjs/operators")
    const fs = require("..")

    _.promise(self)
        .then(fs.list)
        .make(sd => {
            sd.observable = rx.from(sd.paths)
                .pipe(
                    rxops.map(p => ({
                        __type: "exists",
                        path: p,
                        folder: self.path,
                    }))
                )
        })
        .end(done, self, list)
})

list.method = "list"
list.description = `Return an rx.observer to list folder
    
    Right now we just us normal fs.list in the background,
    but this will be made more efficient in the future
`
list.requires = {
    path: _.is.String,
}
list.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
list.produces = {
    observable: _.is.rx.Observable,
}
list.params = {
    path: _.p.normal,
}
list.p = _.p(list)

/**
 */
const recursive = _.promise((self, done) => {
    _.promise.validate(self, recursive)

    const rx = require("rxjs")
    const rxops = require("rxjs/operators")
    const fs = require("..")

    _.promise(self)
        .then(fs.list.recursive)
        .make(sd => {
            sd.observable = rx.from(sd.paths)
                .pipe(
                    rxops.map(p => ({
                        __type: "exists",
                        path: p,
                        folder: self.path,
                    }))
                )
        })
        .end(done, self, recursive)
})

recursive.method = "rx.list.recursive"
recursive.description = `Return an rx.observer to recursively list folder
    
    Right now we just us normal fs.recursive in the background,
    but this will be made more efficient in the future
`
recursive.requires = {
    path: _.is.String,
}
recursive.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
recursive.produces = {
    observable: _.is.Object,
}
recursive.params = {
    path: _.p.normal,
}
recursive.p = _.p(recursive)

/**
 *  API
 */
exports.list = list
exports.list.recursive = recursive

if (require.main === module) {
    const rxops = require("rxjs/operators")

    _.promise.make({
        path: "/Users/david/iotdb/iot/iotdb-fs/",
    })
        .then(list.recursive)
        .make(sd => {
            try {
                const subscription = sd.observable
                    .subscribe({
                        next: d => console.log(d)
                    });

            } catch (x) {
                console.log("X", x)
            }
        })
        .catch(error => console.log(_.error.message(error)))
}
