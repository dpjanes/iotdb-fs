/*
 *  test/truncate.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-23
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
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

process.chdir(__dirname)

describe("truncate", function() {
    const TEST_FOLDER = "tmp"

    describe("core", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n"
                const PATH = path.join(TEST_FOLDER, "out.txt")

                _.promise.make({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.remove)
                    .then(fs.write.utf8)
                    .then(fs.read.utf8)
                    .make(sd => {
                        assert.strictEqual(sd.document.length, MESSAGE.length)
                    })

                    .then(fs.truncate)
                    .then(fs.read.utf8)
                    .make(sd => {
                        assert.strictEqual(sd.document.length, 0)
                    })
                    .end(done)
            })
            it("works with length", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n"
                const PATH = path.join(TEST_FOLDER, "out.txt")

                _.promise.make({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.remove)
                    .then(fs.write.utf8)
                    .then(fs.read.utf8)
                    .make(sd => {
                        assert.strictEqual(sd.document.length, MESSAGE.length)
                    })

                    .add("fs$length", 10)
                    .then(fs.truncate)
                    .then(fs.read.utf8)
                    .make(sd => {
                        assert.strictEqual(sd.document.length, 10)
                    })
                    .end(done)
            })
        })
    })
})
