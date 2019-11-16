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

/*
 *  NEED tests for actual symbolic links, and file no permissions
 */
describe("stat", function() {
    describe("stat", function() {
        it("file does not exist", function(done) {
            _.promise({
                path: "data/does-not-exist",
            })
                .then(fs.stat)
                .make(sd => {
                    assert.ok(!sd.exists)
                    assert.ok(!sd.stats)
                })
                .end(done)
        })
        it("file exists", function(done) {
            _.promise({
                path: "data/c.txt",
            })
                .then(fs.stat)
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isFile())
                })
                .end(done)
        })
        it("directory exists", function(done) {
            _.promise({
                path: "data",
            })
                .then(fs.stat)
                .then(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isDirectory())
                })
                .end(done)
        })
    })
    describe("symbolic link", function() {
        it("file does not exist", function(done) {
            _.promise({
                path: "data/does-not-exist",
            })
                .then(fs.stat.symbolic_link)
                .make(sd => {
                    assert.ok(!sd.exists)
                    assert.ok(!sd.stats)
                })
                .end(done)
        })
        it("file exists", function(done) {
            _.promise({
                path: "data/c.txt",
            })
                .then(fs.stat.symbolic_link)
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isFile())
                    done()
                })
                .catch(done)
        })
        it("directory exists", function(done) {
            _.promise({
                path: "data",
            })
                .then(fs.stat.symbolic_link)
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                    assert.ok(sd.stats.isDirectory())
                })
                .end(done)
        })
    })
    describe("stat.p", function() {
        it("file exists", function(done) {
            _.promise({
            })
                .then(fs.stat.p("data/c.txt"))
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                })
                .end(done)
        })
        it("file exists - fallthrough", function(done) {
            _.promise({
                path: "data/c.txt",
            })
                .then(fs.stat.p())
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                })
                .end(done)
        })
    })
    describe("stat.symbolic_link.p", function() {
        it("file exists", function(done) {
            _.promise({
            })
                .then(fs.stat.symbolic_link.p("data/c.txt"))
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                })
                .end(done)
        })
        it("file exists - fallthrough", function(done) {
            _.promise({
                path: "data/c.txt",
            })
                .then(fs.stat.symbolic_link.p())
                .make(sd => {
                    assert.ok(sd.exists)
                    assert.ok(sd.stats)
                })
                .end(done)
        })
    })
})
