/*
 *  test/stat.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-11-16
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
const fs = require("..");

const assert = require("assert");

process.chdir(__dirname);

describe("stat", function() {
    describe("stat", function() {
        it("file does not exist", function(done) {
            _.promise.make({
                path: "data/does-not-exist",
            })
                .then(fs.stat)
                .then(sd => {
                    assert.ok(!sd.exists)
                    assert.ok(!sd.stats)
                    done()
                })
                .catch(done)
        })
        it("file exists", function(done) {
            _.promise.make({
                path: "data/c.txt",
            })
                .then(fs.stat)
                .then(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isFile())
                    done()
                })
                .catch(done)
        })
        it("directory exists", function(done) {
            _.promise.make({
                path: "data",
            })
                .then(fs.stat)
                .then(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isDirectory())
                    done()
                })
                .catch(done)
        })
    })
    describe("symbolic link", function() {
        it("file does not exist", function(done) {
            _.promise.make({
                path: "data/does-not-exist",
            })
                .then(fs.stat.symbolic_link)
                .then(sd => {
                    assert.ok(!sd.exists)
                    assert.ok(!sd.stats)
                    done()
                })
                .catch(done)
        })
        it("file exists", function(done) {
            _.promise.make({
                path: "data/c.txt",
            })
                .then(fs.stat.symbolic_link)
                .then(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isFile())
                    done()
                })
                .catch(done)
        })
        it("directory exists", function(done) {
            _.promise.make({
                path: "data",
            })
                .then(fs.stat.symbolic_link)
                .then(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isDirectory())
                    done()
                })
                .catch(done)
        })
    })
})