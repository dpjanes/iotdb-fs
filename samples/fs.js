/**
 *  fs.js
 *
 *  David Janes
 *  IOTDB
 *  2017-08-03
 *
 *  Copyright (2013-2017) David Janes
 */

"use strict"

const _ = require("iotdb-helpers")
const fs = require("..")

const minimist = require("minimist")
const path = require("path")

const ad = minimist(process.argv.slice(2), {
    string: [
        "path",
    ],
    default: {
        "path": path.join(__dirname, "data", "bbc_congo.txt"),
    }
});

const _normalize = s => (s || "").replace(/-/g, "_")
const action_name = ad._[0]

const actions = []
const action = name => {
    actions.push(name)

    return _normalize(action_name) === _normalize(name)
}


if (action("list")) {
    _.promise.make({
        path: "..",
    })
        .then(fs.list)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
} else if (action("list-recursive")) {
    _.promise.make({
        path: "..",
        parer: path => path === ".git",
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
} else if (action("list-depth-first")) {
    _.promise.make({
        path: "..",
        parer: path => path === ".git",
        sorter: fs.sorter.natural_ignore_case,
    })
        .then(fs.list.depth_first)
        .then(sd => console.log("+", "ok", sd.paths))
        .catch(error => console.log("#", error))
} else if (action("read-jsons")) {
    _.promise.make({
        path: "..",
    })
        .then(fs.list)
        .then(sd => _.d.add(sd, "inputs", sd.paths.filter(path => path.endsWith(".json"))))
        .then(sd => _.promise.each(sd, "path", fs.read.json, sd => ({ path: sd.path, json: sd.json })))
        .then(sd => console.log("+", "ok", sd.outputs))
        .catch(error => console.log("#", error))
} else // this is way better than above
if (action("all-jsons")) {
    _.promise.make({
        path: "..",
        filter: name => name.endsWith(".json"),
    })
        .then(fs.list)
        .then(fs.all(fs.read.json))
        .then(sd => console.log("+", "ok", sd.jsons))
        .catch(error => console.log("#", error))
} else if (action("write.json")) {
    _.promise.make({
        path: "delete-me/write-json.json",
        json: { "hello": "world" },
    })
        .then(fs.mkdir.parent)
        .then(fs.write.json)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("write.utf8")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: "Hello, world / 你好，世界\n",
    })
        .then(fs.mkdir.parent)
        .then(fs.write.utf8)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("write")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: "Hello, world / 你好，世界\n",
        document_encoding: "utf-8",
    })
        .then(fs.mkdir.parent)
        .then(fs.write)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("write.buffer")) {
    _.promise.make({
        path: "delete-me/write-json.txt",
        document: Buffer.from("Hello, world / 你好，世界\n", "utf-8"),
    })
        .then(fs.mkdir.parent)
        .then(fs.write.buffer)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("tmpfile")) {
    _.promise.make({})
        .then(fs.tmpfile)
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("tmpfile.extension")) {
    _.promise.make({})
        .then(fs.tmpfile.extension(".png"))
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("append")) {
    _.promise.make({
        path: "delete-me/append.txt",
    })
        .then(fs.mkdir.parent)
        .then(fs.append.line(null, "A"))
        .then(fs.append.line(null, "B"))
        .then(fs.append.line(null, "C"))
        .then(sd => console.log("+", "ok", sd.path))
        .catch(error => console.log("#", error))
} else if (action("watch")) {
    _.promise.make({
        path: ".",
        watcher: _.promise(self => {
            console.log("-", self.watch_event, self.path)
        }),
    })
        .then(fs.watch)
        .make(sd => {
            setTimeout(() => _.promise(sd).then(fs.watch.close), 60 * 1000)
        })
        .catch(error => console.log("#", error))
} else if (!action_name) {
    console.log("#", "action required - should be one of:", actions.join(", "))
} else {
    console.log("#", "unknown action - should be one of:", actions.join(", "))
}

