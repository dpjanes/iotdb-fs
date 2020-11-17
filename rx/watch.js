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

const fs = require("fs")

const rx = require("rxjs")
const rxops = require("rxjs/operators")

/**
 */
const watch = _.promise(self => {
    _.promise.validate(self, watch)

    self.observable = rx.Observable.create((observer) => {
            const watcher = fs.watch(self.path, (event_type, filename) => {
                observer.next({
                    path: filename || null,
                    event_type: event_type,
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
watch.description = `Return an rx.observer for folder changes`
watch.requires = {
    path: _.is.String,
}
watch.accepts = {
    watcher: _.is.Function,
}
watch.produces = {
    observable: _.is.Object,
}
watch.params = {
    path: _.p.normal,
    watcher: _.p.normal,
}
watch.p = _.p(watch)

/**
 *  API
 */
exports.watch = watch

/*
_.promise.make({
    path: ".",
})
    .then(watch)
    .make(sd => {
        try {
        const subscription = sd.observable
            .pipe(
                rxops.debounceTime(20 * 1000),
                // rxops.distinctUntilChanged(),
              )
            .subscribe({
                next: d => console.log(d)
            })

        // setTimeout(() => subscription.unsubscribe(), 2000)
        } catch (x) {
            console.log("X", x)
        }
    })
    .catch(error => _.error.message(error))
*/
