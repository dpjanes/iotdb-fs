/*
 *  lib/remove.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-29
 *
 *  Copyright [2013-2017] [David P. Janes]
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

const assert = require("assert");
const fs = require("fs");
const path = require("path");

/**
 *  Requires: self.path
 *  Produces: N/A
 *
 *  Remove a file. If the file does not exist, no error will be reported
 */
const remove = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.remove";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.unlink(self.path, error => {
        if (error && (error.code !== "ENOENT")) {
            return done(error);
        }

        done(null, self);
    })
}

/**
 *  Requires: self.path
 *  Produces: N/A
 *
 *  Remove a file. If the file does not exist, no error will be reported
 */
const remove_directory = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.remove.directory";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)

    fs.rmdir(self.path, error => {
        if (error && (error.code !== "ENOENT")) {
            return done(error);
        }

        done(null, self);
    })
}

/**
 *  Requires: self.path
 *  Produces: N/A
 *
 *  Remove a whole bunch of files
 */
const remove_recursive = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.remove.recursive";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(path.resolve(self.path) !== "/", `${method}: I'm not letting you remove /, find something else`);

    done(new Error("not implemented yet"));

    /*
    const iotdb_fs = require("..");
    let stack = [ self.path ];

    const _handle_folder = _.promise.denodeify((_self, done) => {
        _.promise.make(self)
            .then(iotdb_fs.list)
            .then(iotdb_fs.all(iotdb_fs.remove))
            .then(_.promise.block(sd => {
                stack = stack.concat(sd.paths)
            }))
            .then(_.promise.done(done))
            .catch(done)
    })

    const _handle_other = _.promise.denodeify((_self, done) => {
    })

    const _do = () => {
        if (stack.length === 0) {
            return done(null, self);
        }

        const first = stack.shift();

        _.promise.make(self)
            .then(sd => _.d.add(sd, "path", first))
            .then(iotdb_fs.is)
            .then(_.promise.conditional(sd.is_folder, _handle_folder, _handle_file))


        process.nextTick(_do);
    }
    */
}

/**
 *  API
 */
exports.remove = _.promise.denodeify(remove);
exports.remove.directory = _.promise.denodeify(remove_directory);
exports.remove.recursive = _.promise.denodeify(remove_recursive);
