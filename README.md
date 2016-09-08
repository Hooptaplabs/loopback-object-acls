# loopback-object-acls

An ACL plugin for loopback to allow dynamic acls on object level, instead of on model level.

## Install

Currently we don't posted yet to npm. Meantime you can install direct from the repo.

```shell
npm install https://github.com/Hooptaplabs/loopback-object-acls
```

### 1) Add mixin source

Add the mixins property to your server/model-config.json like the following:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "loopback/server/mixins",
      "loopback-object-acls",
      "../common/mixins",
      "./mixins"
    ]
  }
}
```
After, add 'loopback-object-acls' to mixins folders. It can be found on 'server/model-config.json'

### 2) Use the mixin on the model json.

```json
  {
    "name": "Book",
    "properties": {
      "name": "string"
    },
    "mixins": {
      "ObjectAcls" : true
    }
  }
```

## Usage

There are some ways to use this library. On all this examples there is no options provided to the mixin.

### 1) As basic acls library

**Example 1** - Simple users
```js
	let instance = yield Model.create();
	let acls = [
		{want: 'DENY'},
		{want: 'ALLOW', who: 'Admin'}]
	yield instance.updateAttributes({acls});
	expect(yield instance.can({who: 'Customer'}).to.equal(false);
	expect(yield instance.can({who: 'Admin'}).to.equal(true);
```

**Example 2** - User types
```js
	let instance = yield Model.create();
	let acls = [
		{want: 'DENY'},
		{want: 'ALLOW', who: {type: 'Admin'}},
		{want: 'ALLOW', who: {type: 'Customer', id: 'Pepe'}},
		{want: 'ALLOW', who: {id: 'root'}}]
	yield instance.updateAttributes({acls});
	expect(yield instance.can()).to.equal(false);
	expect(yield instance.can({who: {type: 'Customer'}}).to.equal(false);
	expect(yield instance.can({who: {type: 'Admin'}}).to.equal(true);
	expect(yield instance.can({who: {id: 'Pepe'}).to.equal(false);
	expect(yield instance.can({who: {type: 'Customer', id: 'Pepe'}).to.equal(true);
	expect(yield instance.can({who: 'root'}).to.equal(true);
```


**Example 3** - Which resource
```js
	let instance = yield Model.create();
	let acls = [
		{want: 'DENY'},
		{want: 'ALLOW', which: {type: 'READ'}},
		{want: 'ALLOW', which: {type: 'WRITE', id: 'buy'}}]
	yield instance.updateAttributes({acls});
	expect(yield instance.can()).to.equal(false);
	expect(yield instance.can({which: {type: 'WRITE'}}).to.equal(false);
	expect(yield instance.can({which: {type: 'READ'}}).to.equal(true);
	expect(yield instance.can({which: {id: 'delete'}).to.equal(false);
	expect(yield instance.can({which: {type: 'WRITE', id: 'buy'}).to.equal(true);
	expect(yield instance.can({which: 'buy'}).to.equal(false);
```

**Work in progress with this examples. I will be updating this when I have time.

## Why

Why needed a way to make loopback support for Acls that can change on execution time and between instances of the same Model. This will be our approach and we will work on it and consume it for our own Api.

We want to share our work to the world, get feedback and advice, and collaborate with the open-source community.

## Expected times

I personally will be working on this for some days/weeks. The plan is this library will be working on one or two weeks as a MVP.

## Structure

My plan is initially make a simple library with Acls. I found other libraries with Acls but all I found (and correct me if I am wrong) was too simple. I need a full-customizable acls library, with support for resolvers of everything, asynchronous, etc.

I think this first library will be util for others and I plan to export to another repo and this will be only the loopback plugin. But the deadline is near and in order to be fast I make all on one repo.

After this library is completed I will make a loopback plugin to consume the library.

## Progress

- [x] Basic Sync Oacs
- [x] Mixin for loopback
- [x] Support for alias
- [x] Support for resolvers
- [x] Support for sugars
- [x] Support for defaults