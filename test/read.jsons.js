/*
 *  test/read.jsons.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-28
 *  🦃
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
const fs = require("..")

const assert = require("assert")
const _util = require("./_util")

process.chdir(__dirname);

describe("read", function() {
    describe("read.jsons", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.jsons)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file is not an array", function(done) {
                _.promise({
                    path: "data/a.json",
                })
                    .then(fs.read.jsons)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file has bad JSON", function(done) {
                _.promise({
                    path: "data/c.txt",
                })
                    .then(fs.read.json)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    path: "data/c.json",
                })
                    .then(fs.read.jsons)
                    .then(sd => {
                        const got = sd.jsons
                        const want = [ { "a": 1, "note": "in data" }, 2, 3 ]

                        assert.deepEqual(got, want)
                        assert.ok(!sd.document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_jsons: 123, 
                })
                    .then(fs.read.jsons)
                    .then(sd => {
                        const expected_json = 123;

                        assert.deepEqual(sd.json, expected_json);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise - file contains invalid JSON", function(done) {
                _.promise({
                    path: "data/c.txt",
                    fs$otherwise_jsons: 123, 
                })
                    .then(fs.read.jsons)
                    .then(sd => {
                        const got = 123
                        const want = 123;

                        assert.deepEqual(got, want)
                    })
                    .end(done)
            })
        })
    })
    describe("read.yamls", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.yamls)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("invalid", function(done) {
                _.promise({
                    path: "data-2/invalid.yaml",
                })
                    .then(fs.read.yamls)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("otherwise", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_jsons: 123,
                })
                    .then(fs.read.yamls)
                    .make(sd => {
                        assert.deepEqual(sd.json, 123)
                        assert.strictEqual(sd.json, sd.jsons)
                    })
                    .end(done)
            })
            it("invalid", function(done) {
                _.promise({
                    path: "data-2/invalid.yaml",
                    fs$otherwise_jsons: 123,
                })
                    .then(fs.read.yamls)
                    .make(sd => {
                        assert.deepEqual(sd.json, 123)
                        assert.strictEqual(sd.json, sd.jsons)
                    })
                    .end(done)
            })
        })
        describe("good", function() {
            it("works with json", function(done) {
                _.promise({
                    path: "data/c.json",
                })
                    .then(fs.read.yamls)
                    .then(sd => {
                        const got = sd.json
                        const want = [[ { "a": 1, "note": "in data" }, 2, 3 ]]

                        assert.strictEqual(sd.json, sd.jsons)
                        assert.deepEqual(got, want)
                        assert.ok(!sd.document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("works with yaml", function(done) {
                _.promise({
                    path: "data/single.yaml",
                })
                    .then(fs.read.yamls)
                    .then(sd => {
                        const got = sd.json
                        const want = [ { a: 1, b: 2 } ]

                        assert.strictEqual(sd.json, sd.jsons)
                        assert.deepStrictEqual(got, want)
                        assert.ok(!sd.document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("file has multi YAML", function(done) {
                _.promise({
                    path: "data/multi.yaml",
                })
                    .then(fs.read.yamls)
                    .then(sd => {
                        const got = sd.json
                        const want = [{"a":1,"b":2},{"c":[{"e":1},{"f":"a","g":"hello"}]}]

                        assert.strictEqual(sd.json, sd.jsons)
                        assert.deepStrictEqual(got, want)
                        assert.ok(!sd.document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
