/**
 *  read_stdin.js
 *  
 *  David Janes
 *  Conensas
 *  2016-11-22
 */

const _ = require("iotdb-helpers");

const assert = require('assert'); 

const openpgp = require('openpgp'); 
const Q = require("bluebird-q");

/**
 *  Accepts: self.in_path, self.document_encoding || null (default: 'utf-8')
 *  Requires: self.in_path === "-" && !self.document && !self.in
 *  Produces: self.document
 */
const read_stdin = (_self, done) => {
    const self = _.d.clone.shallow(_self);
    const method = "crypto.read_stdin";

    const stdin = process.stdin;
    let result = [];

    stdin.setEncoding(self.document_encoding || 'utf8');
    stdin.on('readable', function () {
        let chunk;

        while ((chunk = stdin.read())) {
            result.push(chunk);
        }
    });

    stdin.on('end', function () {
        self.document = result.join("");

        done(null, self);
    });
};

/**
 *  API
 */
exports.read_stdin = Q.denodeify(read_stdin);
