# iotdb-fs

Pipeline Oriented Programming (POP) FS functions

# Examples

There is sample code in `samples/fs.js`.

All examples set up with:

	const _ = require("iotdb-helpers")
	const fs = require("iotdb-fs")
	
Note that this can probably be used `async` style, but I haven't tried it

	let self;
	
	self = await fs.list({ path: "." })
	self = await fs.all(fs.read.json)(self)
	
	console.log(self.jsons)

## `fs.all`: apply a function to all `self.paths`

The results are returned in:

* `self.jsons` - all valid JSON results
* `self.documents` - all valid documents
* `self.outputs` - all results

Each `output` looks like:

* `self.path` - the path
* `self.json` - JSON document, if any
* `self.document` - document, if any
* `self.document_media_type` - media type, if any
* `self.error` - error reported, if any 


### read all JSON files

Failures will reported in `self.outputs`. 
`sd.jsons` will only contain files successfully read

    _.promise.make({
        path: ".",
        fs$filter_name: name => name.endsWith(".json"),
    })
        .then(fs.list)
        .then(fs.all(fs.read.json))
        .then(sd => console.log("+", "ok", sd.jsons))

### read all documents files

    _.promise.make({
        path: ".",
    })
        .then(fs.list)
        .then(fs.all(fs.read.utf8))
        .then(sd => console.log("+", "ok", sd.documents))

## `fs.list`: list contents of a folder

### single folder

    _.promise.make({
        path: ".",
    })
        .then(fs.list)
        .then(sd => console.log("+", "ok", sd.paths))

### recursive

    _.promise.make({
        path: ".",
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))

#### filter

`filter` checks the filename. `filter_path` is also available.

This will only return files named `*.json`.

    _.promise.make({
        path: ".",
        fs$file_name: name => name.endsWith(".json"),
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))

#### parer

`parer` checks the filename; if it does not match that particular
file will not be considered for recursion. 
`parer_path` is also available.

In the following examples, files in the `.git` folder are ignored 
(note that the `.git` folder itself _will_ be listed).

    _.promise.make({
        path: ".",
        fs$parer_name: name === ".git",
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))

#### search depth first

    _.promise.make({
        path: ".",
        fs$parer_name: name === ".git",
    })
        .then(fs.list.depth_first)
        .then(sd => console.log("+", "ok", sd.paths))

#### sort names

    _.promise.make({
        path: ".",
        fs$sorter: fs.sorter.natural_ignore_case,
    })
        .then(fs.list)
        .then(sd => console.log("+", "ok", sd.paths))

Options (so far) are:

* `fs.sorter.natural` - A, B, C, a, b, c, 
* `fs.sorter.natural_ignore_case` - A, a, B, b, C, c

_We need to add an option for a locale-sensitive sort_

## `fs.make.directory`: make directories

Note that no error is reported if the folder
already exists

    _.promise.make({
        path: "delete-me",
    })
        .then(fs.make.directory.parent)

### `fs.make.directory.parent` - make parent folder

    _.promise.make({
        path: "delete-me/write-json.json",
        json: { "hello": "world" },
    })
        .then(fs.make.directory.parent)
        .then(fs.write.json)
   
## `fs.read` - read files

Reading documents will modify:

* `self.document`
* `self.document_media_type`

The `document` may be a String or Buffer depending
on the function you choose.

The one except is `fs.read.json`, that returns
its result in `self.json`

### `fs.read` - prefer versions below
### `fs.read.buffer` - read into buffer
### `fs.read.json` - read into JSON

    _.promise.make({
        path: "info.json",
    })
        .then(fs.read.json)
        .then(sd => console.log("+", "ok", sd.json))

## `fs.read.json` -- magic JSON reading

This will work with `.csv`, `.txt` and `.yaml` files, as 
well as "-" for stdin.

You must independently install `js-yaml` and/or `csvtojson`
according to your needs.

### `fs.read.utf8` - read UTF-8 document

    _.promise.make({
        path: "doc.txt",
    })
        .then(fs.read.utf8)
        .then(sd => console.log("+", "ok", sd.document_media_type, sd.document))

### `fs.read.stdin` - read stdin

## `fs.write`     
### `fs.write.utf8`: write UTF-8 document

    _.promise.make({
        path: "write.txt",
        document: "Hello, world / 你好，世界\n",
    })
        .then(fs.make.directory.parent)
        .then(fs.write.utf8)
        .then(sd => console.log("+", "ok", sd.path))

### `fs.write.buffer`: write Buffer 

    _.promise.make({
        path: "write.txt",
        document: Buffer.from("Hello, world / 你好，世界\n", "utf-8"),
    })
        .then(fs.make.directory.parent)
        .then(fs.write.buffer)
        .then(sd => console.log("+", "ok", sd.path))

## `fs.remove`: remove file

Note that no error is reported if the file does not exist

## `fs.remove.directory`: remove directory

Note that no error is reported if the directory does not exist

## `fs.remove.recursive`: remove a bunch off stuff

NOT IMPLEMENTED

## `fs.tmpfile`: make a temporary file

The path of the file will be placed in `self.path`.
The file will disappear when the process exits. 

## `fs.truncate`: truncate a file

`self.document_length` can be used to control
where the truncation happens

## `fs.exists`: does it exist?

Test whether an object on the filesystem exists.
`self.exists` will be set to `true` or `false`
as appropriate

    _.promise.make({
        path: "doc.txt",
    })
        .then(fs.exists)
        .then(sd => console.log("+", "ok", sd.path, sd.exists)

## `fs.is.*`: test file type

Test whether an object is of a certain type
`self.exists` will be set to `true` or `false`
as appropriate

### `fs.is.file`: is it a normal file type

NOT IMPLEMENTED YET

    _.promise.make({
        path: "doc.txt",
    })
        .then(fs.is.file)
        .then(sd => console.log("+", "ok", sd.path, "is-file", sd.exists)

### `fs.is.file`: is it a normal file type

NOT IMPLEMENTED YET

    _.promise.make({
        path: ".",
    })
        .then(fs.is.directory)
        .then(sd => console.log("+", "ok", sd.path, "is-directory", sd.exists)

### `fs.is.symbolic_link`: is it a symbolic link

NOT IMPLEMENTED YET

    _.promise.make({
        path: ".",
    })
        .then(fs.is.symbolic_link)
        .then(sd => console.log("+", "ok", sd.path, "is-symbolic-link", sd.exists)


## Contributed Software

For security and efficiency reason, some code from third party modules has
been directly included in this module (in `./contrib`)

* https://www.npmjs.com/package/mkdirp
