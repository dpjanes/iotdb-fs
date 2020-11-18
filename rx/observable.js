/*
 *  rx/observable.js
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
const observable = _.promise((self, done) => {
    _.promise.validate(self, observable)

    const rx = require("rxjs")
    const rxops = require("rxjs/operators")
    const fs = require("..")

    _.promise(self)
        .then(fs.rx.list)
        .add("observable:list_observable")

        .then(fs.rx.watch)
        .add("observable:watch_observable")

        .make(sd => {
            sd.list_observable = sd.list_observable
                .pipe(
                    rxops.map(p => ({
                        _type: "exists",
                        path: p,
                        folder: self.path,
                    }))
                )

            sd.observable = rx.concat(
                sd.list_observable,
                rx.of({
                    _type: "listed",
                    path: null,
                    folder: self.path,
                }),
                sd.watch_observable
            )
        })

        .end(done, self, observable)
})

observable.method = "observable"
observable.description = `Return an rx.observer to a Folder.
    This will list all existing files and all modifications
    in the futre.

    _type="exists" will be emitted for existing files
    _type="listed" will be emitted when end of existing files
`
observable.requires = {
    path: _.is.String,
}
observable.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
observable.produces = {
    observable: _.is.Object,
}
observable.params = {
    path: _.p.normal,
}
observable.p = _.p(observable)

/**
 */
const recursive = _.promise((self, done) => {
    _.promise.validate(self, recursive)

    const rx = require("rxjs")
    const rxops = require("rxjs/operators")
    const fs = require("..")

    _.promise(self)
        .then(fs.rx.list.recursive)
        .add("observable:list_observable")

        .then(fs.rx.watch)
        .add("observable:watch_observable")

        .make(sd => {
            sd.list_observable = sd.list_observable
                .pipe(
                    rxops.map(p => ({
                        _type: "exists",
                        path: p,
                        folder: self.path,
                    }))
                )

            sd.observable = rx.concat(
                sd.list_observable,
                rx.of({
                    _type: "listed",
                    path: null,
                    folder: self.path,
                }),
                sd.watch_observable
            )
        })
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
    observable: _.is.Object,
}
recursive.params = {
    path: _.p.normal,
}
recursive.p = _.p(recursive)

/**
 *  API
 */
exports.observable = observable
exports.observable.recursive = recursive

if (require.main === module) {
    const rxops = require("rxjs/operators")

    _.promise.make({
        path: "..",
        fs$filter_path: name => name !== "xxx"
    })
        .then(observable.recursive)
        .make(sd => {
            const subscription = sd.observable
                .subscribe({
                    next: d => console.log(d)
                });

            setTimeout(() => subscription.unsubscribe(), 30 * 1000)
        })
        .catch(error => console.log(_.error.message(error)))
}
