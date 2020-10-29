/*
 *  lib/cache.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-10-04
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
const path = require("path")

/**
 */
const cache = _.promise((self, done) => {
    const fs = require("..")

    const _path = key => {
        const hash = _.hash.md5(key)

        return path.join(self.cache$cfg.path, hash.substring(0, 2), hash + ".json")
    }

    /**
     */
    const put = _.promise((self, done) => {
        _.promise(self)
            .validate(put)

            .add("path", _path(self.key))
            .then(fs.make.directory.parent)
            .then(fs.write.json)

            .end(done, self, put)
    })

    put.method = "cache/put"
    put.description = ``
    put.requires = {
        key: _.is.String,
        json: _.is.Dictionary,
    }
    put.produces = {
    }

    /**
     */
    const get = _.promise((self, done) => {
        _.promise(self)
            .validate(get)
            
            .add("fs$otherwise_json", null)
            .add("path", _path(self.key))
            .then(fs.read.json)

            .end(done, self, get)
    })

    get.method = "cache/get"
    get.description = ``
    get.requires = {
        key: _.is.String,
    }
    get.produces = {
        json: _.is.Dictionary,
    }

    /**
     */
    _.promise(self)
        .validate(cache)

        .add("/cache$cfg/path")
        .then(fs.make.directory)
        .make(sd => {
            sd.cache = {
                put: put,
                get: get,
            }
        })

        .end(done, self, cache)
})

cache.method = "cache"
cache.description = `Produce a cache for iotdb-cache`
cache.requires = {
    cache$cfg: {
        path: _.is.String,
    },
}
cache.accepts = {
}
cache.produces = {
    cache: {
        put: _.is.Function,
        get: _.is.Function,
    },
}

/**
 *  API
 */
exports.cache = cache
