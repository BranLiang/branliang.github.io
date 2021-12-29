---
layout: post
title:  "Simple GraphQL query with Ruby"
date:   2021-12-29 19:41:12 +0800
categories: ruby
---

### TL'DR

Query GraphQL in ruby is easy. All you need is a library for HTTP post request.

### Gem graphql-client

It's just so natural that we will look for a gem for GraphQL query. And you actually do that, gem [graphql-client](https://github.com/github/graphql-client) would be your go to choice. It looks sophicticated and reliable enough, as it is produced by the github team, right?

Let's check what this gem is doing for us. This gem loads the graphql schema, and helps validate the query string. Also, it will parse the response, so you can treat the result like a ruby object.

```ruby
# graphql-ruby configuration demo
module SWAPI
  HTTP = GraphQL::Client::HTTP.new("https://example.com/graphql") # <= fixed url?
  Schema = GraphQL::Client.load_schema(HTTP) # <= load schema?
  Client = GraphQL::Client.new(schema: Schema, execute: HTTP)
end
```

However, several questions arises when I started using this gem.
1. Why is it necessary to load a graphql schema?
2. The api endpoint is fixed. How to update the endpoint on the fly?

### The simple way

If you don't need the advanced response parsing, or you need a graphql client for multiple endpoint. Here is a simple way.

```ruby
# simple client demo
class SimpleGraphqlClient
  def initialize(endpoint:, headers: {})
    @endpoint = endpoint
    @http = HTTP.headers(headers)
  end

  def post(query, variables: {})
    @http.post(@endpoint,json: {
      query: query,
      variables: variables
    })
  end
end
```

I am using the gem [HTTP](https://github.com/httprb/http), you can choose whatever http library you like. This can handle the graphql request and receive the result json. It's dumb, but works.

Another problem is writing the graphql is hard, without the gem `graphql-client` to do the valdation for you, you have no idea if you are writing the correct schema. However, this problem could be solved very easily, all you need is a smart code editor. I am using vscode here for example. 

```graphql
# app/controller/graphql/shop.gql
query {
  shop {
    name
  }
}
```

```ruby
# app/controller/graphql/query.rb
# Using this module to load queries on project initialization
module Graphql
  module Queries
    FOLDER_PATH = "app/controllers/graphql/"

    def self.load_query(filename)
      File.read(FOLDER_PATH + filename + ".gql")
    end
  
    Shop = load_query("shop")
  end
end
```

With this code structure, you store all you graphql queries in a seperate folder. Query files are using `.gql` extension or `.graphql` extension. Next, just find a graphql extension and configure it. Below is a demo configuration.

Install extension `GraphQL` made from GraphQL Foundation.

```json
{
  "graphql": {
    "schema": "./db/api_schema.json",
    "documents": "./app/controllers/graphql/*.gql"
  }
}
```

### Conclusion

Loading graphql schema in your application is an expensive action. And normally, you just don't need. Writing a simple http client wrapper should do the job for you.

