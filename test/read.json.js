/*
 *  test/read.json.js
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
    describe("read.json", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.json)
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
                    path: "data/a.json",
                })
                    .then(fs.read.json)
                    .then(sd => {
                        const expected_json = { a: 0, b: 1, note: 'in data' }

                        assert.deepEqual(sd.json, expected_json);
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
                    fs$otherwise_json: 123, 
                })
                    .then(fs.read.json)
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
                    fs$otherwise_json: 123, 
                })
                    .then(fs.read.json)
                    .then(sd => {
                        const got = 123
                        const want = 123;

                        assert.deepEqual(got, want)
                    })
                    .end(done)
            })
        })
    })
    describe("read.yaml", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.yaml)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file has multi YAML", function(done) {
                _.promise({
                    path: "data/multi.yaml",
                })
                    .then(fs.read.yaml)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("otherwise", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_json: 123,
                })
                    .then(fs.read.yaml)
                    .make(sd => {
                        assert.deepEqual(sd.json, 123)
                    })
                    .end(done)
            })
            it("file has multi YAML", function(done) {
                _.promise({
                    path: "data/multi.yaml",
                    fs$otherwise_json: 123,
                })
                    .then(fs.read.yaml)
                    .make(sd => {
                        assert.deepEqual(sd.json, 123)
                    })
                    .end(done)
            })
        })
        describe("good", function() {
            it("works with json", function(done) {
                _.promise({
                    path: "data/c.json",
                })
                    .then(fs.read.yaml)
                    .then(sd => {
                        const got = sd.json
                        const want = [ { "a": 1, "note": "in data" }, 2, 3 ]

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
                    .then(fs.read.yaml)
                    .then(sd => {
                        const got = sd.json
                        const want = { a: 1, b: 2 }

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
    describe("read.json.p", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    // path: "data/does-not-exist",
                })
                    .then(fs.read.json.p("data/does-not-exist"))
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file has bad JSON", function(done) {
                _.promise({
                    // path: "data/c.txt",
                })
                    .then(fs.read.json.p("data/c.txt"))
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    // path: "data/a.json",
                })
                    .then(fs.read.json.p("data/a.json"))
                    .then(sd => {
                        const expected_json = { a: 0, b: 1, note: 'in data' }

                        assert.deepEqual(sd.json, expected_json);
                        assert.ok(!sd.document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    // path: "data/does-not-exist",
                    // fs$otherwise_json: 123, 
                })
                    .then(fs.read.json.p("data/does-not-exist", 123))
                    .then(sd => {
                        const expected_json = 123;

                        assert.deepEqual(sd.json, expected_json);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise - file contains invalid JSON", function(done) {
                _.promise({
                    // path: "data/c.txt",
                    // fs$otherwise_json: 123, 
                })
                    .then(fs.read.json.p("data/c.txt", 123))
                    .then(sd => {
                        const got = 123
                        const want = 123;

                        assert.deepEqual(got, want)
                    })
                    .end(done)
            })
            it("fallthrough - otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_json: 123, 
                })
                    .then(fs.read.json.p())
                    .then(sd => {
                        const expected_json = 123;

                        assert.deepEqual(sd.json, expected_json);

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
