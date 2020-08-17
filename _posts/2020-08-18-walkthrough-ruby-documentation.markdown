---
layout: post
title:  "Walkthrough ruby documentation"
date:   2020-08-17
categories: ruby
---

This is my ruby documentation walkthrough. And I list all the ideas which is interesting to me.

## Classes

- You can dynamicly create class using `Class.new`
https://ruby-doc.org/core-2.7.1/Class.html#method-i-new

- Using `module Comparable` when objects are ordered.
https://ruby-doc.org/core-2.7.1/Comparable.html

- `Enumerator::Chain` represents a chain of enumerables that works as a single enumerator.
https://ruby-doc.org/core-2.7.1/Enumerator/Chain.html

- `Enumerator::Lazy` allows constructing chains of operations without evaluating them immediately, and evaluating values on as-needed basis.

- `Fiber.new` light weight cooperative concurrency in Ruby.
https://ruby-doc.org/core-2.7.1/Fiber.html

- `Mutex.new` implements a simple semaphore that can be used to coordinate access to shared data from multiple concurrent threads.
https://ruby-doc.org/core-2.7.1/Mutex.html

- `Queue.new` implements multi-producer, multi-consumer queues. It is especially useful in threaded programming when information must be exchanged safely between multiple threads.
https://ruby-doc.org/core-2.7.1/Queue.html

- `Symbol` represent names inside the Ruby interpreter. Same symbol across application share the same resource. So use symbol instead of string whenever possible.
https://ruby-doc.org/core-2.7.1/Symbol.html

## Standard Library

- `dbm` ruby has its own simple database, DBM is not a good choice for long term storage of important data. It is probably best used as a fast and easy alternative to a Hash for processing large amounts of data.
https://ruby-doc.org/stdlib-2.7.1/libdoc/dbm/rdoc/DBM.html

- `Etc` provides access to information typically stored in files in the /etc directory on Unix systems.
https://ruby-doc.org/stdlib-2.7.1/libdoc/etc/rdoc/Etc.html

- `FileUtils` can do many file related operations.
https://ruby-doc.org/stdlib-2.7.1/libdoc/fileutils/rdoc/FileUtils.html

- `GetoptLong` allows you to parse command line options similarly to the GNU getopt_long() C library call.
https://ruby-doc.org/stdlib-2.7.1/libdoc/getoptlong/rdoc/GetoptLong.html

- `Matrix` Use the matrix class to deal with library.
https://ruby-doc.org/stdlib-2.7.1/libdoc/matrix/rdoc/Matrix.html

- `OptionParser` is used for commandline argument parsing, and it is more easier than GetoptLong.
https://ruby-doc.org/stdlib-2.7.1/libdoc/optparse/rdoc/OptionParser.html

- `Prime` generate list of primes.
https://ruby-doc.org/stdlib-2.7.1/libdoc/prime/rdoc/Prime.html

- `Psych` is a YAML parsing engine in ruby, this is also called as `YAML`
https://ruby-doc.org/stdlib-2.7.1/libdoc/psych/rdoc/Psych.html
https://ruby-doc.org/stdlib-2.7.1/libdoc/yaml/rdoc/YAML.html

- `Resolv` can be used to do DNS resolving job
https://ruby-doc.org/stdlib-2.7.1/libdoc/resolv/rdoc/Resolv.html

- `REXML` can be used to deal with XML problem
https://ruby-doc.org/stdlib-2.7.1/libdoc/rexml/rdoc/REXML/Element.html

- `Ripper` is a Ruby script parser. You can get information from the parser with event-based style. Information such as abstract syntax trees or simple lexical analysis of the Ruby program. Which means you may enable new syntax in ruby. Or create a new language based on ruby.
https://ruby-doc.org/stdlib-2.7.1/libdoc/ripper/rdoc/Ripper.html

- `SDBM` provides a simple file-based key-value store, which can only store String keys and values. Can be used to help processing large amount of data.
https://ruby-doc.org/stdlib-2.7.1/libdoc/sdbm/rdoc/SDBM.html

- `Set` and `SortedSet`, there are two kinds of set library available. One is unsorted and the other one is sorted.
https://ruby-doc.org/stdlib-2.7.1/libdoc/set/rdoc/SortedSet.html

- `Singleton` ensures that only one instance of Klass can be created.
https://ruby-doc.org/stdlib-2.7.1/libdoc/singleton/rdoc/Singleton.html

- `TSort` implements topological sorting using Tarjan's algorithm for strongly connected components.
https://ruby-doc.org/stdlib-2.7.1/libdoc/tsort/rdoc/TSort.html

