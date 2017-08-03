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

const Q = require("bluebird-q");
const minimist = require('minimist');

const ad = minimist(process.argv.slice(2));

const action = (name) => ad._.indexOf(name) > -1;

if (action("list")) {
    Q({
        path: "..",
    })
        .then(fs.list)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
}

if (action("read-jsons")) {
    Q({
        path: "..",
    })
        .then(fs.list)
        .then(sd => _.d.add(sd, "inputs", sd.paths.filter(path => path.endsWith(".json"))))
        .then(sd => _.promise.each(sd, "path", fs.read.json, sd => ({ path: sd.path, json: sd.json })))
        .then(sd => console.log("+", "ok", sd.outputs))
        .catch(error => console.log("#", error))
}

if (action("write.json")) {
    Q({
        path: "delete-me/write-json.json",
        json: { "hello": "world" },
    })
        .then(fs.mkdir.parent)
        .then(fs.write.json)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}

if (action("write.utf8")) {
    Q({
        path: "delete-me/write-json.txt",
        document: "Hello, world / 你好，世界\n",
    })
        .then(fs.mkdir.parent)
        .then(fs.write.utf8)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}

if (action("write")) {
    Q({
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
    Q({
        path: "delete-me/write-json.txt",
        document: Buffer.from("Hello, world / 你好，世界\n", "utf-8"),
    })
        .then(fs.mkdir.parent)
        .then(fs.write.buffer)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
}
