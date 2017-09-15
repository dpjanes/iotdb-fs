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
        filter: name => name.endsWith(".json"),
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

### filter

`filter` passes the filename. `filter_path` is also available.

    _.promise.make({
        path: ".",
        filter: name => name.endsWith(".json"),
    })
        .then(fs.list.recursive)
        .then(sd => console.log("+", "ok", sd.paths))

## `fs.mkdir`: make directories

Note that no error is reported if the folder
already exists

### `fs.mkdir` - make folder

    _.promise.make({
        path: "delete-me",
    })
        .then(fs.mkdir.parent)

### `fs.mkdir.parent` - make parent folder

    _.promise.make({
        path: "delete-me/write-json.json",
        json: { "hello": "world" },
    })
        .then(fs.mkdir.parent)
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
        path: "info.son",
    })
        .then(fs.read.json)
        .then(sd => console.log("+", "ok", sd.json))

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
        .then(fs.mkdir.parent)
        .then(fs.write.utf8)
        .then(sd => console.log("+", "ok", sd.path))

### `fs.write.buffer`: write Buffer 

    _.promise.make({
        path: "write.txt",
        document: Buffer.from("Hello, world / 你好，世界\n", "utf-8"),
    })
        .then(fs.mkdir.parent)
        .then(fs.write.buffer)
        .then(sd => console.log("+", "ok", sd.path))

## `fs.unlink`: remove file

Note that no error is reported if the file
does not exist

## `fs.tmpfile`: make a temporary file

The path of the file will be placed in `self.path`.
The file will disappear when the process exits. 

## `fs.truncate`: truncate a file

`self.document_length` can be used to control
where the truncation happens
