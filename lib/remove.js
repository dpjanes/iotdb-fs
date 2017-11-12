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
 *  Remove a whole bunch of files. No error
 *  will be reported if the path does not exist
 *
 *  Algorithm:
 *  - push the path onto a stack
 *  - repeat until stack empty
 *      - check the first thing on the stack
 *      - if it's a folder
 *          - list all the files in the folder
 *          - push onto the stack
 *          - remove them
 *          - add the folder to the "folders" list, inserting at the beginning
 *      - remove it (not caring if folder delete fails)
 *  - delete all the folders, which will have deepest first
 */
const remove_recursive = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "lib.remove.recursive";

    assert.ok(_.is.String(self.path), `${method}: self.path is required`)
    assert.ok(path.resolve(self.path) !== "/", `${method}: I'm not letting you remove /, find something else`);

    // done(new Error("not implemented yet"));

    const iotdb_fs = require("..");
    const folders = [];
    let stack = [ self.path ];

    /*
    iotdb_fs.remove = _.promise.denodeify((_self, done) => {
        console.log("REMOVE", _self.path)
        done(null, _self)
    })

    iotdb_fs.remove.directory = _.promise.denodeify((_self, done) => {
        console.log("REMOVE-DIR", _self.path)
        done(null, _self)
    })
    */

    const _handle_folder = _.promise.denodeify((_self, done) => {
        _.promise.make(_self)
            .then(iotdb_fs.list)
            .then(_.promise.block(sd => {
                stack = stack.concat(sd.paths)

                folders.unshift(sd.path)
            }))
            .then(iotdb_fs.all(iotdb_fs.remove))
            .then(_.promise.done(done))
            .catch(done)
    })

    const _do = () => {
        if (stack.length === 0) {
            _.promise.make(self)
                .then(sd => _.d.add(sd, "paths", folders))
                .then(iotdb_fs.all(iotdb_fs.remove.directory))
                .then(_.promise.done(done, self))
                .catch(done)

            return
        }

        const first = stack.shift();

        _.promise.make(self)
            .then(sd => _.d.add(sd, "path", first))
            .then(iotdb_fs.is.directory)
            .then(_.promise.conditional(sd => sd.exists, _handle_folder))
            .then(fs.remove)
            .then(_.promise.block(sd => {
                process.nextTick(_do);
            }))
            .catch(done)
    }

    _do()
}

/**
 *  API
 */
exports.remove = _.promise.denodeify(remove);
exports.remove.directory = _.promise.denodeify(remove_directory);
exports.remove.recursive = _.promise.denodeify(remove_recursive);
