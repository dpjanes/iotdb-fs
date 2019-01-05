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
                const p_parent = path.join(__dirname, "tmp", name)
                const p_dir = path.join(__dirname, "tmp", name, "subfolder")

                _.promise({
                    path: p_dir,
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
                    .add("path", p_dir)
                    .then(fs.remove.directory)
                    .add("path", p_parent)
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
                const name = "dir-" + _.random.id()
                const p_dir = path.join(__dirname, "tmp", name)
                const p_file = path.join(__dirname, "tmp", name, "file.txt")

                _.promise()
                    // should not exist
                    .add("path", p_dir)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(!sd.exists)
                    })

                    // make parent
                    .add("path", p_file)
                    .then(fs.make.directory.parent)

                    // file should not exist
                    .add("path", p_file)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(!sd.exists)
                    })
 
                    // directory should exist and be a directory
                    .add("path", p_dir)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(sd.exists)
                    })

                    .then(fs.stat)
                    .make(sd => {
                        assert.ok(sd.stats.isDirectory())
                    })

                    // cleanup
                    .add("path", p_dir)
                    .then(fs.remove.directory)

                    .end(done)
            })
        })
    })
    describe("make.link", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const src = path.join(__dirname, "tmp", "link-src-" + _.random.id(20))
                const dst = path.join(__dirname, "tmp", "link-dst-" + _.random.id(20))

                _.promise()
                    // source
                    .then(fs.write.p(src, "Hello, World", "utf-8"))

                    // link it
                    .add({
                        "path": src,
                        "destination": dst,
                    })
                    .then(fs.make.link)

                    // test it
                    .add("path", dst)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(sd.exists)
                    })
                    .then(fs.stat)
                    .make(sd => {
                        assert.ok(sd.stats.isFile())
                    })

                    // cleanup
                    .add("path", src)
                    .then(fs.remove)
                    .add("path", dst)
                    .then(fs.remove)

                    .end(done)
            })
        })
    })
    describe("make.link.symbolic", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const src = path.join(__dirname, "tmp", "slink-src-" + _.random.id(20))
                const dst = path.join(__dirname, "tmp", "slink-dst-" + _.random.id(20))

                _.promise()
                    // source
                    .then(fs.write.p(src, "Hello, World", "utf-8"))

                    // link it
                    .add({
                        "path": src,
                        "destination": dst,
                    })
                    .then(fs.make.link.symbolic)

                    // test it
                    .add("path", dst)
                    .then(fs.exists)
                    .make(sd => {
                        assert.ok(sd.exists)
                    })
                    .then(fs.stat)
                    .make(sd => {
                        assert.ok(sd.stats.isFile())
                    })
                    .then(fs.stat.symbolic)
                    .make(sd => {
                        assert.ok(sd.stats.isSymbolicLink())
                    })

                    // cleanup
                    .add("path", src)
                    .then(fs.remove)
                    .add("path", dst)
                    .then(fs.remove)

                    .end(done)
            })
        })
    })
})
