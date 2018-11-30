/*
 *  util/document_name.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-11-26
 *
 *  Copyright (2013-2019) David P. Janes
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

const path = require("iotdb-fs")

/**
 *  Given a path, produce a document name
 */
const document_name = _.promise(self => {
    _.promise.validate(self, document_name)

    self.document_name = path.basename(self.path)
})

document_name.method = "util.document_name"
document_name.requires = {
    path: _.is.String,
}

/**
 *  API
 */
exports.document_name = document_name
