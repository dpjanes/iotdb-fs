/*
 *  lib/join.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-11-18
 *
 *  Copyright (2013-2020) David P. Janes
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

"use strict"

const _ = require("iotdb-helpers")

const path = require("path")

/**
 */
const join = (...parts) => {
    let start = 0
    parts.forEach((p, px) => {
        if (path.isAbsolute(p)) {
            start = px
        }
    })

    return path.join(...parts.slice(start))
}

join.method = join
join.description = `
    Like path.join, but understands that an absolute
    path along the way doesn't get joined
`

/**
 *  API
 */
exports.join = join

/*
const pss = [
    [ "/users/david", "filename", ],
    [ "/users/david", "filename", "subfilename", ],
    [ "/users/david", "filename", "/users/bob", ],
    [ "/users/david", "filename", "/users/bob", "something", ],
]
pss.forEach(ps => console.log(join(...ps), path.join(...ps)))
*/
