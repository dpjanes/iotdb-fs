/*
 *  test/all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-09-16
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

describe("read", function() {
    describe("all", function() {
        describe("good", function() {
            it("read all json", function(done) {
                _.promise.make({
                    path: "data",
                })
                    .then(fs.list)
                    .then(fs.all(fs.read.json))
                    .then(sd => {
                        const fd = {};
                        sd.outputs.forEach(output => fd[output.path] = output)

                        {
                            const path = 'data/a.json';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(output.json)
                            assert.deepEqual(output.json, { a: 0, b: 1, note: 'in data' })
                            assert.ok(!output.document)
                            assert.ok(!output.document_media_type)
                            assert.ok(!output.error)

                        }
                        {
                            const path = 'data/b.json';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(output.json)
                            assert.deepEqual(output.json, { a: 1, note: 'in data' })
                            assert.ok(!output.document)
                            assert.ok(!output.document_media_type)
                            assert.ok(!output.error)

                        }
                        {
                            const path = 'data/c.txt';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(!output.document)
                            assert.ok(!output.document_media_type)
                            assert.ok(output.error)
                            assert.deepEqual(output.error.name, 'SyntaxError')

                        }
                        {
                            const path = 'data/subfolder';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(!output.document)
                            assert.ok(!output.document_media_type)
                            assert.ok(output.error)
                            assert.deepEqual(output.error.code, 'EISDIR')

                        }

                        done();
                    })
                    .catch(done)
            })
            it("read all utf-8", function(done) {
                _.promise.make({
                    path: "data",
                })
                    .then(fs.list)
                    .then(fs.all(fs.read.utf8))
                    .then(sd => {
                        const fd = {};
                        sd.outputs.forEach(output => fd[output.path] = output)

                        assert.deepEqual(sd.outputs.map(output => output.document), sd.documents)

                        {
                            const path = 'data/a.json';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(output.document)
                            assert.ok(output.document_media_type)
                            assert.ok(!output.error)

                            assert.deepEqual(output.document, '{\n   "a": 0,\n   "b": 1,\n   "note": "in data"\n}\n');
                            assert.deepEqual(output.document_media_type, 'application/json');
                        }
                        {
                            const path = 'data/b.json';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(output.document)
                            assert.ok(output.document_media_type)
                            assert.ok(!output.error)

                            assert.deepEqual(output.document, '{\n   "a": 1,\n   "note": "in data"\n}\n');
                            assert.deepEqual(output.document_media_type, 'application/json');
                        }
                        {
                            const path = 'data/c.txt';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(output.document)
                            assert.ok(output.document_media_type)
                            assert.ok(!output.error)

                            assert.deepEqual(output.document, 'Hello World\n你好，世界\nこんにちは世界\n');
                            assert.deepEqual(output.document_media_type, 'text/plain');
                        }
                        {
                            const path = 'data/subfolder';
                            const output = fd[path];

                            assert.ok(output)
                            assert.ok(!output.json)
                            assert.ok(!output.document)
                            assert.ok(!output.document_media_type)
                            assert.ok(output.error)
                            assert.deepEqual(output.error.code, 'EISDIR')
                        }

                        done();
                    })
                    .catch(done)
            })
        })
    })
})
