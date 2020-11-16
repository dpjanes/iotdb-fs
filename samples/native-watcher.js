/**
 *  samples/native-watcher.js
 *
 *  David Janes
 *  IOTDB
 *  2020-11-16
 *
 *  Copyright (2013-2021) David P. Janes
 */

"use strict";

const fs = require("fs")
const path = require("path")

const ref = fs.watch(".", (event_type, filename) => {
    console.log("-", event_type, filename || null)
})

console.log("+", "watching")
setTimeout(() => {
    console.log("+", "finished")
    ref.close()
}, 100 * 1000)
