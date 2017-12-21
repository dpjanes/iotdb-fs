/**
 *  fs.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-03
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");
const fs = require("..");

const assert = require("assert");

const minimist = require('minimist');

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("list")) {
    _.promise.make({
        path: "..",
    })
        .then(fs.list)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
}

if (action("list-recursive")) {
    _.promise.make({
        path: "..",
        parer: path => path === ".git",
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
}

if (action("list-depth-first")) {
    _.promise.make({
        path: "..",
        parer: path => path === ".git",
        sorter: fs.sorter.natural_ignore_case,
    })
        .then(fs.list.depth_first)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
}

if (action("read-jsons")) {
    _.promise.make({
        path: "..",
    })
        .then(fs.list)
        .then(sd => _.d.add(sd, "inputs", sd.paths.filter(path => path.endsWith(".json"))))
        .then(sd => _.promise.each(sd, "path", fs.read.json, sd => ({ path: sd.path, json: sd.json })))
        .then(sd => console.log("+", "ok", sd.outputs))
        .catch(error => console.log("#", error))
}

// this is way better than above
if (action("all-jsons")) {
    _.promise.make({
        path: "..",
        filter: name => name.endsWith(".json"),
    })
        .then(fs.list)
        .then(fs.all(fs.read.json))
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", error))
}

if (action("write.json")) {
    _.promise.make({
        path: "delete-me/write-json.json",
        json: { "hello": "world" },
    })
        .then(fs.mkdir.parent)
        .then(fs.write.json)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}

if (action("write.utf8")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: "Hello, world / 你好，世界\n",
    })
        .then(fs.mkdir.parent)
        .then(fs.write.utf8)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}

if (action("write")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: "Hello, world / 你好，世界\n",
        document_encoding: "utf-8",
    })
        .then(fs.mkdir.parent)
        .then(fs.write)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}

if (action("write.buffer")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: Buffer.from("Hello, world / 你好，世界\n", "utf-8"),
    })
        .then(fs.mkdir.parent)
        .then(fs.write.buffer)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}
