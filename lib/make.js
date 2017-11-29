/*
 *  lib/make.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-03
 *
 *  Copyright [2013-2018] [David P. Janes]
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

"use strict";

const _ = require("iotdb-helpers");
const errors = require("iotdb-errors");

const mkdirp = require("mkdirp");

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path
 *  Produces: N/A
 */
const mkdir = _.promise.make((self, done) => {
    const method = "mkdir";

    assert.ok(_.is.String(self.path), `${method}: path is required`)

    mkdirp(self.path, error => {
        if (error) {
            return done(error);
        }

        done(null, self)
    })
})

/**
 *  Requires: self.path
 *  Produces: N/A
 */
const mkdir_parent = _.promise.make((self, done) => {
    const method = "mkdir.parent";

    assert.ok(_.is.String(self.path), `${method}: path is required`)

    _.promise.make(self)
        .then(_.promise.add("path", path.dirname(self.path)))
        .then(mkdir)
        .then(_.promise.done(done, self))
        .catch(done);
})

/**
 *  Parameterized
 */
const mkdir_p = _path => _.promise.denodeify((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("path", _path || self.path))
        .then(mkdir)
        .then(_.promise.done(done, self))
        .catch(done);
})

const mkdir_parent_p = _path => _.promise.denodeify((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("path", _path || self.path))
        .then(mkdir_parent)
        .then(_.promise.done(done, self))
        .catch(done);
})

/**
 *  API
 */
exports.mkdir = mkdir;
exports.mkdir.p = mkdir_p;
exports.mkdir.parent = mkdir_parent;
exports.mkdir.parent.p = mkdir_parent_p;

exports.make = {}
exports.make.directory = exports.mkdir;
exports.make.directory.parent = exports.mkdir.parent;
