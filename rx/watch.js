/*
 *  rx/watch.js
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

const node_fs = require("fs")
const path = require("path")

/**
 */
const watch = _.promise(self => {
    _.promise.validate(self, watch)

    const rx = require("rxjs")
    const fs = require("..")

    self.observable = rx.Observable.create((observer) => {
        const watcher = node_fs.watch(self.path, (event_type, filename) => {
            if (self.fs$filter_name && !self.fs$filter_name(path.basename(filename))) {
                return
            }

            if (self.fs$filter_path) {
                const p = fs.join(self.path, filename)
                if (!self.fs$filter_path(path.basename(filename))) {
                    return
                }
            }

            observer.next({
                _type: event_type,
                path: filename || null,
                folder: self.path,
            })
        })

        return {
            unsubscribe: () => {
                watcher.close()
            }
        }
    })

})

watch.method = "watch"
watch.description = `
    Return an rx.observer for folder changes
    
    Each folder change looks like:

        type: the type of change (event_type from fs.watch)
        path: the filename (relative to the folder being listed)
        folder: the folder being listed

    We use "_type" to be consistent with iotdb-sqlite,
    iotdb-postgres and iotdb-mongodb. Basically: injected
    metadata that can't be saved
`
watch.requires = {
    path: _.is.String,
}
watch.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
}
watch.produces = {
    observable: _.is.Object,
}
watch.params = {
    path: _.p.normal,
}
watch.p = _.p(watch)

/**
 *  API
 */
exports.watch = watch

if (require.main === module) {
    const rxops = require("rxjs/operators")

    _.promise.make({
        path: ".",
        // fs$filter_name: name => name !== "xxx",
        fs$filter_path: name => name !== "xxx"
    })
        .then(watch)
        .make(sd => {
            const subscription = sd.observable
                .pipe(
                    rxops.debounceTime(.2 * 1000),
                    // rxops.distinctUntilChanged(),
                  )
                .subscribe({
                    next: d => console.log(d)
                })

                setTimeout(() => subscription.unsubscribe(), 30 * 1000)
        })
        .catch(error => console.log(_.error.message(error)))
}
