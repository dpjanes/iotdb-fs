/*
 *  lib/filter.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-11-27
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

const assert = require("assert");

/**
 *  Shorthand for filter through the outputs.
 *
 *  If "f" isn't given, it will filter the documents
 *  that exist.
 */
const filter = f => _.promise.make(self => {
    const method = "filter";

    assert.ok(_.is.Array.of.Dictionary(self.outputs), `${method}: expected self.outputs to be Array of Dictionary`);

    self.outputs = self.outputs.filter(filter || (output => output.document))
})

/**
 *  Shorthand for filter through the outputs.
 *
 *  If "f" isn't given, it will filter the outputs
 *  that have JSON objects (null is a JSON object,
 *  we are looking for undefined)
 */
const filter_json = f => _.promise.make(self => {
    const method = "filter.json";

    assert.ok(_.is.Array.of.Dictionary(self.outputs), `${method}: expected self.outputs to be Array of Dictionary`);

    self.outputs = self.outputs.filter(filter || (output => !_.is.Undefined(output.json)))
})

/**
 *  API
 */
exports.filter = filter;
exports.filter.json = filter.json;
