/*
 *  test/read.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-23
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
    describe("read", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("using document_encoding latin1", function(done) {
                _.promise({
                    path: "data/c.txt",
                    document_encoding: "latin1",
                })
                    .then(fs.read)
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.ok(sd.document !== expected_document);
                        assert.ok(sd.document.startsWith("Hello World\n"));
                        assert.ok(!sd.document_encoding);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);

                        done();
                    })
                    .catch(done)
            })
            it("using document_encoding utf-8", function(done) {
                _.promise({
                    path: "data/c.txt",
                    document_encoding: "utf-8",
                })
                    .then(fs.read)
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.deepEqual(sd.document, expected_document);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    otherwise: 123, 
                })
                    .then(fs.read)
                    .then(sd => {
                        const expected_document = 123;

                        assert.deepEqual(sd.document, expected_document);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("read.buffer", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.buffer)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    path: "data/c.txt",
                })
                    .then(fs.read.buffer)
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.ok(_.is.Buffer(sd.document))
                        assert.deepEqual(sd.document.toString("utf-8"), expected_document);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    otherwise: 123, 
                })
                    .then(fs.read.buffer)
                    .then(sd => {
                        const expected_document = 123;

                        assert.deepEqual(sd.document, expected_document);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("read.utf8", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                })
                    .then(fs.read.utf8)
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({
                    path: "data/c.txt",
                })
                    .then(fs.read.utf8)
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.deepEqual(sd.document, expected_document);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    otherwise: 123, 
                })
                    .then(fs.read.utf8)
                    .then(sd => {
                        const expected_document = 123;

                        assert.deepEqual(sd.document, expected_document);

                        done();
                    })
                    .catch(done)
            })
        })
    })
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
                    otherwise: 123, 
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
                    otherwise: 123, 
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
    describe("read.stdin", function() {
        beforeEach(function() {
            const Readable = require('stream').Readable;
            const s = new Readable();
            s._read = _.noop;
            s.push("Hello World\n你好，世界\nこんにちは世界\n");
            s.push(null);

            fs.read.shims.stdin = s;
        })
        afterEach(function() {
            fs.read.shims.stdin = process.stdin;
        })

        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                _.promise({})
                    .then(fs.read.stdin)
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";

                        assert.deepEqual(sd.document, expected_document);
                        assert.ok(!sd.document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
        })
    })
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
                    otherwise: 123, 
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
                    otherwise: 123, 
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
                    otherwise: 123,
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
                    otherwise: 123,
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
    describe("read.yaml", function() {
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
                    otherwise: 123,
                })
                    .then(fs.read.yamls)
                    .make(sd => {
                        assert.deepEqual(sd.json, 123)
                    })
                    .end(done)
            })
            it("invalid", function(done) {
                _.promise({
                    path: "data-2/invalid.yaml",
                    otherwise: 123,
                })
                    .then(fs.read.yamls)
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
    describe("read.p", function() {
        describe("bad", function() {
            it("file does not exist", function(done) {
                _.promise({
                    // path: "data/does-not-exist",
                })
                    .then(fs.read.p("data/does-not-exist"))
                    .then(_util.auto_fail(done))
                    .catch(_util.ok_error(done))
            })
        })
        describe("good", function() {
            it("using document_encoding latin1", function(done) {
                _.promise({
                    // path: "data/c.txt",
                    // document_encoding: "latin1",
                })
                    .then(fs.read.p("data/c.txt", "latin1"))
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.ok(sd.document !== expected_document);
                        assert.ok(sd.document.startsWith("Hello World\n"));
                        assert.ok(!sd.document_encoding);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);

                        done();
                    })
                    .catch(done)
            })
            it("using document_encoding utf-8", function(done) {
                _.promise({
                    // path: "data/c.txt",
                    // document_encoding: "utf-8",
                })
                    .then(fs.read.p("data/c.txt", "utf-8"))
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.deepEqual(sd.document, expected_document);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("otherwise", function(done) {
                _.promise({
                    // path: "data/does-not-exist",
                    // otherwise: 123, 
                })
                    .then(fs.read.p("data/does-not-exist", null, 123))
                    .then(sd => {
                        const expected_document = 123;

                        assert.deepEqual(sd.document, expected_document);

                        done();
                    })
                    .catch(done)
            })
            it("fall throughs", function(done) {
                _.promise({
                    path: "data/c.txt",
                    document_encoding: "utf-8",
                    otherwise: null,
                })
                    .then(fs.read.p())
                    .then(sd => {
                        const expected_document = "Hello World\n你好，世界\nこんにちは世界\n";
                        const expected_document_media_type = "text/plain";

                        assert.deepEqual(sd.document, expected_document);
                        assert.deepEqual(sd.document_media_type, expected_document_media_type);
                        assert.deepEqual(sd.document_name, "c.txt");
                        assert.ok(!sd.document_encoding);

                        done();
                    })
                    .catch(done)
            })
            it("fall throughs - otherwise", function(done) {
                _.promise({
                    path: "data/does-not-exist",
                    otherwise: 123, 
                })
                    .then(fs.read.p())
                    .then(sd => {
                        const expected_document = 123;

                        assert.deepEqual(sd.document, expected_document);
                        assert.deepEqual(sd.document_name, "does-not-exist");

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
                    // otherwise: 123, 
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
                    // otherwise: 123, 
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
                    otherwise: 123, 
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
