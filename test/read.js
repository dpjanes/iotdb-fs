/*
 *  test/read.js
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

describe("read", function() {
    describe("core", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("using document_encoding latin1", function(done) {
                Q({
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
                Q({
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
        })
    })
    describe("read.buffer", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                Q({
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
        })
    })
    describe("read.utf8", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                Q({
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
        })
    })
    describe("read.json", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                Q({
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
        })
    })
    describe("read.stdin", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                done();
            })
        })
    })
})
