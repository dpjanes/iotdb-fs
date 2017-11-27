/*
 *  lib/map.js
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
 *  Shorthand for mapping through the outputs
 */
const map = f => _.promise.make(self => {
    const method = "map";

    assert.ok(_.is.Array.of.Dictionary(self.outputs), `${method}: expected self.outputs to be Array of Dictionary`);
    assert.ok(_.is.Function(self.f), `${method}: expected self.f to be a Function`);

    self.outputs = self.outputs.map(f)
})

/**
 *  This will map the outputs to a function that 
 *  produces JSON. If the document is not there,
 *  the JSON producing function will _not_ be called.
 *
 *  This is handy for this sort of thing:
 *
 *      .then(fs.map.json(output => yaml.load(output.document)))
 */
const map_json = f => _.promise.make(self => {
    const method = "map.json";

    assert.ok(_.is.Array.of.Dictionary(self.outputs), `${method}: expected self.outputs to be Array of Dictionary`);
    assert.ok(_.is.Function(self.f), `${method}: expected self.f to be a Function`);

    self.outputs = self.outputs.map(output => {
        if (!output.document) {
            return output;
        }

        output = _.promise.clone(output)
        try {
            output.json = f(output)

            return output
        }
        catch (error) {
            output.error = error;
        }
    })
})

/**
 *  API
 */
exports.map = map;
exports.map.json = map.json;
