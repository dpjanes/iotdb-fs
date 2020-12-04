/*
 *  rx/observe.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-11-18
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
const _merge = _.promise((self, done) => {
    const rx = require("rxjs")
    const rxops = require("rxjs/operators")

    _.promise(self)
        .validate(_merge)

        .make(sd => {
            sd.observable = rx.concat(
                rx.of({
                    __type: "start",
                    path: null,
                    folder: self.path,
                }),
                sd.list_observable,
                rx.of({
                    __type: "end",
                    path: null,
                    folder: self.path,
                }),
                sd.watch_observable
            )
        })

        .end(done, self, _merge)
})

_merge.method = "rx.observe/_merge"
_merge.description = ``
_merge.requires = {
    path: _.is.String,
    list_observable: _.is.rx.Observable,
    watch_observable: _.is.rx.Observable,
}
_merge.produces = {
    observable: _.is.rx.Observable,
}

/**
 */
const observe = _.promise((self, done) => {
    const fs = require("..")

    _.promise(self)
        .validate(observe)

        .then(fs.rx.list)
        .add("observable:list_observable")

        .then(fs.rx.watch)
        .add("observable:watch_observable")

        .then(_merge)

        .end(done, self, observe)
})

observe.method = "observe"
observe.description = `Return an rx.observer to a Folder.
    This will list all existing files and all modifications
    in the futre.

    __type="start" will be emitted at beginning
    __type="exists" will be emitted for existing files
    __type="end" will be emitted when end of existing files
`
observe.requires = {
    path: _.is.String,
}
observe.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
observe.produces = {
    observable: _.is.rx.Observable,
}
observe.params = {
    path: _.p.normal,
}
observe.p = _.p(observe)

/**
 */
const recursive = _.promise((self, done) => {
    const fs = require("..")

    _.promise(self)
        .validate(recursive)

        .then(fs.rx.list.recursive)
        .add("observable:list_observable")

        .then(fs.rx.watch)
        .add("observable:watch_observable")

        .then(_merge)

        .end(done, self, recursive)
})

recursive.method = "rx.observable.recursive"
recursive.description = `List ex.observe, but recursive

    Until fs.list.recursive, relative paths are returned.
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
    observable: _.is.rx.Observable,
}
recursive.params = {
    path: _.p.normal,
}
recursive.p = _.p(recursive)

/**
 *  API
 */
exports.observe = observe
exports.observe.recursive = recursive

if (require.main === module) {
    const rxops = require("rxjs/operators")
    const os = require("os")
    const path = require("path")

    _.promise.make({
        path: path.join(os.homedir(), "Downloads")
        // fs$filter_path: name => name !== "xxx"
    })
        .then(observe)
        .make(sd => {
            const subscription = sd.observable
                .subscribe({
                    next: d => console.log(d)
                });

            setTimeout(() => subscription.unsubscribe(), 30 * 1000)
        })
        .catch(error => console.log(_.error.message(error)))
}
