/*
 *  lib/watch.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
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

/**
 */
const watch = _.promise(self => {
    _.promise.validate(self, watch)

    self.fs$watch = fs.watch(self.path, (watch_event, filename) => {
        _.promise(self)
            .make(sd => {
                sd.path = filename
                sd.watch_event = event_type
                sd.watch_folder = self.path
            })
            .then(watcher)
            .catch(error => {
                console.log("#", "fs.watch - caught exception in watcher", _.error.message(error))
            })
    })
})

watch.method = "watch"
watch.description = `Watch a path for changes`
watch.requires = {
    path: _.is.String,
}
watch.accepts = {
    watcher: _.is.Function,
}
watch.produces = {
    fs$watch: _.is.Object,
}
watch.params = {
    path: _.p.normal,
    watcher: _.p.normal,
}
watch.p = _.p(watch)

/**
 */
const close = _.promise(self => {
    _.promise.validate(self, close)

    if (self.fs$watch) {
        self.fs$watch.close()
        self.fs$watch = null
    }
})

close.method = "watch.close"
close.description = `Close the watcher reference`
close.requires = {
}
close.accepts = {
    fs$watch: _.is.Object,
}
close.produces = {
    fs$watch: _.is.Null,
}
close.params = {
    path: _.p.normal,
}
close.p = _.p(close)

/**
 *  API
 */
exports.watch = watch
exports.watch.close = close
