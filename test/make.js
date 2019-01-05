/*
 *  test/make.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-23
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

"use strict"

const _ = require("iotdb-helpers")
const fs = require("..")

const assert = require("assert")
const path = require("path")

process.chdir(__dirname);

describe("make", function() {
    describe("make.directory", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const name = "dir-" + _.random.id()
                const p = path.join(__dirname, "tmp", name)

                _.promise({
                    path: p,
                })
                    // should not exist
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(!sd.exists)
                    })

                    // now should exist
                    .then(fs.make.directory)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(sd.exists)
                    })
                    .then(fs.stat)
                    .make(sd => {
                        assert.ok(sd.stats.isDirectory())
                    })

                    // cleanup
                    .then(fs.remove.directory)

                    .end(done)
            })
        })
    })
    describe("make.directory.parent", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                done();
            })
        })
    })
})
