# loopback-object-acls

An ACL plugin for loopback to allow dynamic acls on object level, instead of on model level.

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
- [ ] Support for defaults