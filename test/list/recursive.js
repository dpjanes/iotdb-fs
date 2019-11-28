/*
 *  test/recursive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-23
 *
 *  Copyright (2013-2020) David P. Janes
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
const fs = require("../..")

const assert = require("assert")
const path = require("path")
const _util = require("../_util")

process.chdir(path.join(__dirname, ".."))

describe("list.recursive", function() {
    describe("bad", function() {
        it("bad folder - recursive", function(done) {
            _.promise({
                path: "data-does-not-exist",
            })
                .then(fs.list.recursive)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done))
        })
    })
    describe("good", function() {
        it("works", function(done) {
            _.promise({
                path: "data",
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/c.txt", "data/multi.yaml", "data/single.yaml", "data/subfolder", "data/subfolder/a.json"  ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("filter", function(done) {
            _.promise({
                path: "data",
                filter: name => name.endsWith(".json"),
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/subfolder/a.json" ]


                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("filter_path", function(done) {
            _.promise({
                path: "data",
                filter_path: path => path.endsWith(".json") && path.startsWith("data/"),
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/subfolder/a.json"  ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("parer", function(done) {
            _.promise({
                path: "data",
                parer: name => name === "subfolder",
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/c.txt", "data/multi.yaml", "data/single.yaml", "data/subfolder", ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("parer (no hits)", function(done) {
            _.promise({
                path: "data",
                parer: name => name === "does-not-exist",
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/c.txt", "data/multi.yaml", "data/single.yaml", "data/subfolder", "data/subfolder/a.json" ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("parer_path", function(done) {
            _.promise({
                path: "data",
                parer_path: path => path === "data/subfolder",
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", "data/c.txt", "data/multi.yaml", "data/single.yaml", "data/subfolder", ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
        it("parer + filter", function(done) {
            _.promise({
                path: "data",
                parer: name => name === "subfolder",
                filter: name => name.endsWith(".json"),
            })
                .then(fs.list.recursive)
                .make(sd => {
                    const got = sd.paths.sort()
                    const expected = [ "data/a.json", "data/b.json", "data/c.json", ]

                    assert.deepEqual(got, expected)
                })
                .end(done)
        })
    })
})
