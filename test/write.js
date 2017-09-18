/*
 *  test/write.js
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
const path = require("path");

const Q = require("bluebird-q");

process.chdir(__dirname);

describe("write", function() {
    const TEST_FOLDER = "tmp";

    describe("core", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                    document: MESSAGE,
                    document_encoding: "utf-8",
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write)
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, "utf-8")
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("parameterized", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works - 0 args", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.p())
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, "utf-8")
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
            it("works - 1 args", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.p(PATH))
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, "utf-8")
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
            it("works - 2 args", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.p(PATH, MESSAGE))
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, "utf-8")
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
            it("works - 3 args", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.usc2");
                const ENCODING = 'ucs2';

                Q({
                    path: PATH,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.p(PATH, MESSAGE, ENCODING))
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, ENCODING);
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("write.buffer", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const MESSAGE = Buffer.from("Hello World\n你好，世界\nこんにちは世界\n", "utf8");
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.buffer)
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH)
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("write.bytes", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                done()
            })
        })
    })
    describe("write.utf8", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const MESSAGE = "Hello World\n你好，世界\nこんにちは世界\n";
                const PATH = path.join(TEST_FOLDER, "out.txt");

                Q({
                    path: PATH,
                    document: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.utf8)
                    .then(sd => {
                        const result = fs.fs.readFileSync(PATH, "utf-8")
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
        })
    })
    describe("write.json", function() {
        describe("bad", function() {
        })
        describe("good", function() {
            it("works", function(done) {
                const MESSAGE = { "out": "there", "now": _.timestamp.make() };
                const PATH = path.join(TEST_FOLDER, "out.json");

                Q({
                    path: PATH,
                    json: MESSAGE,
                })
                    .then(fs.mkdir.parent)
                    .then(fs.unlink)
                    .then(fs.write.json)
                    .then(sd => {
                        const result = JSON.parse(fs.fs.readFileSync(PATH, "utf-8"))
                        
                        assert.deepEqual(result, MESSAGE);

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
