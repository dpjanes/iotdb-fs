/*
 *  test/read.magic.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-11-16
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

describe("read.json.magic", function() {
    describe("read.json", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.json.magic)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file has bad JSON", function(done) {
                _.promise({
                    path: "data/c.txt",
                })
                    .then(fs.read.json.magic)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    path: "data/a.json",
                })
                    .then(fs.read.json.magic)
                    .then(sd => {
                        const expected_json = { a: 0, b: 1, note: 'in data' }

                        assert.deepEqual(sd.json, expected_json);
                        assert.ok(!sd.document);

                        done();
                    })
                    .catch(done)
            })
            it("works paramaterized", function(done) {
                _.promise({
                })
                    .then(fs.read.json.magic.p("data/a.json"))
                    .then(sd => {
                        const expected_json = { a: 0, b: 1, note: 'in data' }

                        assert.deepEqual(sd.json, expected_json);
                        assert.ok(!sd.document);

                        done();
                    })
                    .catch(done)
            })
            it("fs$otherwise_json", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_json: 123, 
                })
                    .then(fs.read.json.magic)
                    .then(sd => {
                        const expected_json = 123;

                        assert.deepEqual(sd.json, expected_json);

                        done();
                    })
                    .catch(done)
            })
            it("fs$otherwise_json parameterized", function(done) {
                _.promise({
                })
                    .then(fs.read.json.magic.p("data/does-not-exist", 123))
                    .then(sd => {
                        const expected_json = 123;

                        assert.deepEqual(sd.json, expected_json);

                        done();
                    })
                    .catch(done)
            })
            it("fs$otherwise_json - file contains invalid JSON", function(done) {
                _.promise({
                    path: "data/c.txt",
                    fs$otherwise_json: 123, 
                })
                    .then(fs.read.json.magic)
                    .then(sd => {
                        const got = 123
                        const want = 123;

                        assert.deepEqual(got, want)
                    })
                    .end(done)
            })
        })
    })
    describe("read.stdin", function() {
        beforeEach(function() {
            const Readable = require('stream').Readable;
            const s = new Readable();
            s._read = _.noop;
            s.push(JSON.stringify({ a: 1, b: [ 2, 3 ] }))
            s.push(null);

            fs.read.shims.stdin = s
        })
        afterEach(function() {
            fs.read.shims.stdin = process.stdin
        })

        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    path: "-",
                })
                    .then(fs.read.json.magic)
                    .then(sd => {
                        assert.deepStrictEqual(sd.json, { a: 1, b: [ 2, 3 ] })
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
                    .then(fs.read.json.magic)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
            it("file has multi YAML", function(done) {
                _.promise({
                    path: "data/multi.yaml",
                })
                    .then(fs.read.json.magic)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("fs$otherwise_json", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    fs$otherwise_json: 123,
                })
                    .then(fs.read.json.magic)
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
                    .then(fs.read.json.magic)
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
                    .then(fs.read.json.magic)
                    .then(sd => {
                        const got = sd.json
                        const want = [ { "a": 1, "note": "in data" }, 2, 3 ]

                        assert.deepEqual(got, want)
                        assert.ok(!sd.document);

                        done();
                    })
                    .catch(done)
            })
            it("works with yaml", function(done) {
                _.promise({
                    path: "data/single.yaml",
                })
                    .then(fs.read.json.magic)
                    .then(sd => {
                        const got = sd.json
                        const want = { a: 1, b: 2 }

                        assert.deepStrictEqual(got, want)
                        assert.ok(!sd.document);

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
