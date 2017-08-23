/*
 *  test/list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-23
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
const fs = require("..");

const assert = require("assert");

const Q = require("bluebird-q");

describe("list", function() {
    describe("core", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                Q({
                    path: "data",
                })
                    .then(fs.list)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', 'data/c.txt', 'data/subfolder' ];

                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
            it("filter", function(done) {
                Q({
                    path: "data",
                    filter: name => name.endsWith(".json"),
                })
                    .then(fs.list)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', ];

                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
            it("filter_path", function(done) {
                Q({
                    path: "data",
                    filter_path: path => path.endsWith(".json") && path.startsWith("data/"),
                })
                    .then(fs.list)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', ];

                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("list.recursive", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                Q({
                    path: "data",
                })
                    .then(fs.list.recursive)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', 'data/c.txt', 'data/subfolder', "data/subfolder/a.json"  ];

                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
            it("filter", function(done) {
                Q({
                    path: "data",
                    filter: name => name.endsWith(".json"),
                })
                    .then(fs.list.recursive)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', "data/subfolder/a.json" ];


                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
            it("filter_path", function(done) {
                Q({
                    path: "data",
                    filter_path: path => path.endsWith(".json") && path.startsWith("data/"),
                })
                    .then(fs.list.recursive)
                    .then(sd => {
                        const got = sd.paths.sort()
                        const expected = [ 'data/a.json', 'data/b.json', "data/subfolder/a.json"  ];

                        assert.deepEqual(got, expected)

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
