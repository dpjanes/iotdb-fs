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
 *  Requires: self.path
 *  Accepts: self.filter, self.filter_path, self.otherwise_paths, self.sorter
 *  Produces: self.paths
 */
const list = _.promise.make((self, done) => {
    _.promise.validate(self, list)

    /*
    const method = "list";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`)
    assert.ok(_.is.Function(self.filter) || _.is.Nullish(self.filter), `${method}: self.filter must be a Function or Null`)
    assert.ok(_.is.Function(self.filter_path) || _.is.Nullish(self.filter_path), 
        `${method}: self.filter_path must be a Function or Null`)
    */

    fs.readdir(self.path, (error, names) => {
        if (error) {
            if (!_.is.Undefined(self.otherwise_paths)) {
                self.paths = self.otherwise_paths;
                return done(null, self)
            }

            return done(error);
        }

        if (self.sorter) {
            names.sort(self.sorter)
        }

        self.paths = names
            .filter(self.filter || (() => true))
            .map(name => path.join(self.path, name))
            .filter(self.filter_path || (() => true))

        done(null, self)
    })
});

list.method = "list"
list.requires = {
    path: _.is.String,
}
list.accepts = {
    filter: _.is.Function,
    filter_path: _.is.Function,
    sorter: _.is.Function,
    otherwise_paths: _.is.Array.of.String,
}
list.produces = {
    paths: _.is.Array.of.String,
}
list.params = {
    path: _.p.normal,
}
list.p = _.p(list)


/**
 *  Requires: self.path
 *  Accepts: self.filter, self.filter_path, self.parer, self.parer_path, self.sorter
 *  Produces: self.paths, self.fails
 */
const breadth_first = _.promise.make((self, done) => {
    const method = "list.breadth_first";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`)
    assert.ok(_.is.Function(self.filter) || _.is.Nullish(self.filter), `${method}: self.filter must be a Function or Null`)
    assert.ok(_.is.Function(self.filter_path) || _.is.Nullish(self.filter_path), 
        `${method}: self.filter_path must be a Function or Null`)
    assert.ok(_.is.Function(self.parer) || _.is.Nullish(self.parer), `${method}: self.parer must be a Function or Null`)
    assert.ok(_.is.Function(self.parer_path) || _.is.Nullish(self.parer_path), 
        `${method}: self.parer_path must be a Function or Null`)

    const stack = [ self.path ];
    self.paths = [];
    self.fails = [];

    const parer = self.parer || (() => false);
    const parer_path = self.parer_path || (() => false);

    const _do = () => {
        if (stack.length === 0) {
            return done(null, self);
        }

        const first = stack.shift();

        fs.readdir(first, (error, names) => {
            if (error) {
                if (first === self.path) {
                    if (!_.is.Undefined(self.otherwise_paths)) {
                        self.paths = self.otherwise_paths;
                        return done(null, self)
                    }

                    return done(error);
                }

                self.fails.push(first)

                process.nextTick(_do);
                return;
            }

            if (self.sorter) {
                names.sort(self.sorter)
            }

            names
                .filter(name => !parer(name))
                .map(name => path.join(first, name))
                .filter(path => !parer_path(path))
                .forEach(name => stack.push(name))

            names
                .filter(self.filter || (() => true))
                .map(name => path.join(first, name))
                .filter(self.filter_path || (() => true))
                .forEach(name => self.paths.push(name))

            process.nextTick(_do);
        })
    }

    _do();
})

/**
 *  Requires: self.path
 *  Accepts: self.filter, self.filter_path, self.parer, self.parer_path, self.sorter
 *  Produces: self.paths, self.fails
 */
const depth_first = _.promise.make((self, done) => {
    const method = "list.depth_first";

    assert.ok(_.is.String(self.path), `${method}: self.path must be a String`)
    assert.ok(_.is.Function(self.filter) || _.is.Nullish(self.filter), `${method}: self.filter must be a Function or Null`)
    assert.ok(_.is.Function(self.filter_path) || _.is.Nullish(self.filter_path), 
        `${method}: self.filter_path must be a Function or Null`)
    assert.ok(_.is.Function(self.parer) || _.is.Nullish(self.parer), `${method}: self.parer must be a Function or Null`)
    assert.ok(_.is.Function(self.parer_path) || _.is.Nullish(self.parer_path), 
        `${method}: self.parer_path must be a Function or Null`)

    const stack = [ self.path ];
    self.paths = [];
    self.fails = [];

    const parer = self.parer || (() => false);
    const parer_path = self.parer_path || (() => false);

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
                    if (!_.is.Undefined(self.otherwise_paths)) {
                        self.paths = self.otherwise_paths;
                        return done(null, self)
                    }

                    return done(error);
                }

                self.fails.push(first)

                process.nextTick(_do);
                return;
            }

            if (self.sorter) {
                names.sort(self.sorter)
            }

            names
                .filter(name => !parer(name))
                .map(name => path.join(first, name))
                .filter(path => !parer_path(path))
                .forEach(name => stack.unshift(name))

            result.unshift(
                names
                    .filter(self.filter || (() => true))
                    .map(name => path.join(first, name))
                    .filter(self.filter_path || (() => true))
            )

            process.nextTick(_do);
        })
    }

    _do();
})

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

