/*
 *  lib/list.js
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
const errors = require("iotdb-errors")

const assert = require("assert")
const fs = require("fs")
const path = require("path")

/**
 */
const list = _.promise.make((self, done) => {
    _.promise.validate(self, list)

    fs.readdir(self.path, (error, names) => {
        if (error) {
            if (!_.is.Undefined(self.fs$otherwise_paths)) {
                self.paths = self.fs$otherwise_paths;
                return done(null, self)
            }

            return done(error);
        }

        if (self.fs$sorter) {
            names.sort(self.fs$sorter)
        }

        self.paths = names
            .filter(self.fs$filter_name || (() => true))
            .map(name => path.join(self.path, name))
            .filter(self.fs$filter_path || (() => true))

        done(null, self)
    })
});

list.method = "list"
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
    paths: _.is.Array.of.String,
}
list.params = {
    path: _.p.normal,
}
list.p = _.p(list)

/**
 */
const breadth_first = _.promise.make((self, done) => {
    _.promise.validate(self, breadth_first)

    const stack = [ self.path ];
    self.paths = [];
    self.fails = [];

    const fs$parer_name = self.fs$parer_name || (() => false);
    const fs$parer_path = self.fs$parer_path || (() => false);

    const _do = () => {
        if (stack.length === 0) {
            return done(null, self);
        }

        const first = stack.shift();

        fs.readdir(first, (error, names) => {
            if (error) {
                if (first === self.path) {
                    if (!_.is.Undefined(self.fs$otherwise_paths)) {
                        self.paths = self.fs$otherwise_paths;
                        return done(null, self)
                    }

                    return done(error);
                }

                self.fails.push(first)

                process.nextTick(_do);
                return;
            }

            if (self.fs$sorter) {
                names.sort(self.fs$sorter)
            }

            names
                .filter(name => !fs$parer_name(name))
                .map(name => path.join(first, name))
                .filter(path => !fs$parer_path(path))
                .forEach(name => stack.push(name))

            names
                .filter(self.fs$filter_name || (() => true))
                .map(name => path.join(first, name))
                .filter(self.fs$filter_path || (() => true))
                .forEach(name => self.paths.push(name))

            process.nextTick(_do);
        })
    }

    _do();
})

breadth_first.method = "list.recursive"
breadth_first.requires = {
    path: _.is.String,
}
breadth_first.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$parer_name: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
breadth_first.produces = {
    paths: _.is.Array.of.String,
}
breadth_first.params = {
    path: _.p.normal,
}
breadth_first.p = _.p(breadth_first)

/**
 */
const depth_first = _.promise.make((self, done) => {
    _.promise.validate(self, depth_first)

    const stack = [ self.path ];
    self.paths = [];
    self.fails = [];

    const fs$parer_name = self.fs$parer_name || (() => false);
    const fs$parer_path = self.fs$parer_path || (() => false);

    const result = []

    const _do = () => {
        if (stack.length === 0) {
            result.forEach(names => names.forEach(name => self.paths.push(name)))
            return done(null, self);
        }

        // console.log(stack)
        // console.log(result)

        const first = stack.shift();
        if (_.is.Array(first)) {
            first.forEach(name => self.paths.push(name))

            process.nextTick(_do);
            return;
        }

        fs.readdir(first, (error, names) => {
            if (error) {
                if (first === self.path) {
                    if (!_.is.Undefined(self.fs$otherwise_paths)) {
                        self.paths = self.fs$otherwise_paths;
                        return done(null, self)
                    }

                    return done(error);
                }

                self.fails.push(first)

                process.nextTick(_do);
                return;
            }

            if (self.fs$sorter) {
                names.sort(self.fs$sorter)
            }

            names
                .filter(name => !fs$parer_name(name))
                .map(name => path.join(first, name))
                .filter(path => !fs$parer_path(path))
                .forEach(name => stack.unshift(name))

            result.unshift(
                names
                    .filter(self.fs$filter_name || (() => true))
                    .map(name => path.join(first, name))
                    .filter(self.fs$filter_path || (() => true))
            )

            process.nextTick(_do);
        })
    }

    _do();
})

depth_first.method = "list.depth_first"
depth_first.requires = {
    path: _.is.String,
}
depth_first.accepts = {
    fs$filter_name: _.is.Function,
    fs$filter_path: _.is.Function,
    fs$sorter: _.is.Function,
    fs$parer_name: _.is.Function,
    fs$parer_path: _.is.Function,
    fs$otherwise_paths: _.is.Array.of.String,
}
depth_first.produces = {
    paths: _.is.Array.of.String,
}
depth_first.params = {
    path: _.p.normal,
}
depth_first.p = _.p(depth_first)

/**
 *  Sorters
 */
const natural = (a, b) => {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1
    } else {
        return 0
    }
}

const natural_ignore_case = (a, b) => {
    a = a.toLowerCase()
    b = b.toLowerCase()

    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1
    } else {
        return 0
    }
}

/**
 *  API
 */
exports.list = list;
exports.list.recursive = breadth_first;
exports.list.breadth_first = breadth_first;
exports.list.depth_first = depth_first;

exports.sorter = {
    natural: natural,
    natural_ignore_case: natural_ignore_case,
}
