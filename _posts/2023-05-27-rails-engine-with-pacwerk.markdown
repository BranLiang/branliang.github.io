---
layout: post
title:  "How to build a scalable application using Rails?"
date:   2023-05-27 10:41:00 +0800
categories: rails
---

With the growing of your rails application, it is inevitable that more and more functions will be put into a single repo. One way to call it is [The Majestic Monolith](https://m.signalvnoise.com/the-majestic-monolith/). DHH named the category of this kind of rails application. But he didn't provide a standard way to do that, a normal Rails developer will get easily freaked out, there is no more convention for you to follow this time!

But there must be a way, a good way to do that, let's start from a blank rails application. This blog doesn't do any recommendation, but to try to give you some inspiration.

<!--end_excerpt-->

## What's the problem

It is clear that there are some distinct business concepts within the same code repo, the relationship in between is weak, but since rails doesn't offer component concept by default, the code is mixed up, and developers are struggling to understand what's happening and are afraid to do any changes.

## What do we want ideally

Broadly speaking, codes are splitted into different groups by business concept. For each group of code, it could talk within the group freely, but when interacting with the outside world, it's ability is restricted and constrained to what it should know. Also, it should be very rails style, that means it is easy to read and code. Also, no new conventions should be introduced. All code lives with each other in harmony and developers are coding to make that feel consistent naturally. Is it possible?

## Toolbox

- [packwerk](https://github.com/Shopify/packwerk)
- [rails engine](https://guides.rubyonrails.org/engines.html#avoid-loading-rails-frameworks)

## Getting started

```shell
$ rails new rails-majestic-monolith-demo --minimal
```

Don't want to get distracted by too many files, here I am just creating a minimal rails app, but it doesn't matter. For now we only have one master component, I would call it the master component and it is responsible to talk to the external user directly. All the other component should not be linked to the app user directly. Next, let's create a new component.

## A new component

What kind of ideal folder structure that I am looking forward, maybe something like this.

```markdown
- root
    - components
        - foundation
            - models
                - user.rb
            - jobs
            - lib
            - tasks
        - identity
        - tracking
        - admin
    - app
        - models
        - controllers
    - config
```

The idea behind is that, master component handles all external inetractions. And for specific task the master delegates to the child component. For child component, the folder stucture is flat and properly name scoped.

```shell
$ cd rails-majestic-monolith-demo
$ mkdir -p components/foundation/models && touch components/foundation/models/user.rb
```

For the user model, just give it an empty class for now. If you want to access this class using the console, you will not be able find this class name, as it is not loaded by the rails application by default.

```ruby
# components/foundation/models/user.rb

module Foundation
  class User
    # ...
  end
end
```

Let's config the rails [zeitwerk](https://github.com/fxn/zeitwerk) loader and make sure all components is properly loaded.

```ruby
# config/application.rb

config.eager_load_paths << Rails.root.join("components")

loader = Rails.autoloaders.main
Dir.glob("components/*/").map do |component|
  ["models", "jobs", "services", "lib"].each do |dir|
    loader.collapse(Rails.root.join(component, dir))
  end
end
```

Now try accessing the user model again, and you should be all good.

```shell
$ rails c
irb:> Foundation::User
```

Let's also create a new dummy class in the identity component.

```shell
$ mkdir -p components/identity/models && touch components/identity/models/access.rb
```

## Keep the distance

Now, I want to enforce the boundry among component `identity` and `foundation`. So only controlled part of component is accessible. This time I will use the [packwerk](https://github.com/Shopify/packwerk) gem from Shopify.

```shell
$ gem install packwerk
$ bundle binstub packwerk
$ bin/packwerk init
```

Check the perkwerk and it should all be fine, because we only have one package now.

```
➜  rails-majestic-monolith-demo git:(main) ✗ bin/packwerk validate
📦 Packwerk is running validation...

Validation successful 🎉
```

Let's now also make the components packages, which only needs to create a new `package.yml` file under each component, and also don't forget to check the `packwerk.yml`, to make sure the package config files could be find.

```shell
# Create package.yml

> cp package.yml components/identity/package.yml
> cp package.yml components/foundation/package.yml
```

Because there is no dependency among packages yet, so there should be no violation. What if I try to access `Identity` from `Foundation`, like the following situation.

```ruby
# foundation/model/user.rb

module Foundation
  class User
    def access
      @access ||= Identity::Access.new
    end
  end
end
```

It should raise violations when checking with the `packwerk check`, however nothing raised.

```
📦 Packwerk is inspecting 22 files
......................
📦 Finished in 0.46 seconds

No offenses detected
No stale violations detected
```

It turns out that the trick we did to collapse the folders caused trouble for the packwerk gem. Removing that collapse code will recover the package dependency check.

After hours of trying, there is no good way to collapse the folder as wished. Packwerk expects a strict folder and file convention, maybe I should raise a ticket to the packwerk team to see if they have any idea on how to fix that issue.

## Give up on the folder collapse and following the rails naming convertion

That means I will add a new name space `Model` above the `User` class, which should look like this

```ruby
# # components/foundation/model/user.rb
module Foundation
  module Model
    class User
      # ...
      def access
        @access ||= Identity::Model::Access.new
      end
    end
  end
end


# components/identity/model/access.rb
module Identity
  module Model
    class Access
      # ...
    end
  end
end
```

Also, remove the folder loading tricts we used before, no more tricks this time, let's run the packwerk command and see if it works now.

```
➜  rails-majestic-monolith-demo git:(main) ✗ bin/packwerk validate && bin/packwerk check
📦 Packwerk is running validation...

Validation successful 🎉

📦 Finished in 0.85 seconds
📦 Packwerk is inspecting 46 files
.......................E......................
📦 Finished in 0.53 seconds

components/foundation/model/user.rb:6:20
Dependency violation: ::Identity::Model::Access belongs to 'components/identity', but 'components/foundation' does not specify a dependency on 'components/identity'.
Are we missing an abstraction?
Is the code making the reference, and the referenced constant, in the right packages?

Inference details: this is a reference to ::Identity::Model::Access which seems to be defined in components/identity/model/access.rb.
To receive help interpreting or resolving this error message, see: https://github.com/Shopify/packwerk/blob/main/TROUBLESHOOT.md#Troubleshooting-violations


1 offense detected

No stale violations detected
```

Now, as expected, there is a violation, because we are trying to access `access` from the `user` class. Which is not specified. Removing the dependency or specify the dependency in the config file should solve the problem. In any way, though not super ideal, but also acceptable, we could create simple components with specified dpendencies now.

```
# components/foundation/package.yml
dependencies:
  - "components/identity"
```

## What about rails engine?

[rails engine](https://guides.rubyonrails.org/engines.html) has been around for a long time, it is definitely much powerful than simple components created above, depends on how you think about the component in mind, you may also use this.

You could create a simple component using the command below, and play around with it.

```
$ rails plugin new components/checkout --api --skip-git
```

## Continue to integrate the rails system

Next, I want to upgrade the user model with actual database table behind, how to do that?

First, I still just want to call it `users` table, I don't like a lot of tables all with long component name prefixes. So, this is simple, just a rails migration command should be enough.

```shell
$ rails generate migration CreateUsers name:string
$ rails db:migrate
```

Now the table is ready, but we have no convieient interface to talk to the table still, I mean, there is no active record model yet. Let's now modify the `user` class.

```ruby
module Foundation
  module Model
    class User < ActiveRecord::Base
      self.table_name = 'users'
      # ...
    end
  end
end
```

It works fine. Didn't see major problems yet.

In summary, if you have a somehow big project and you want to enforce a bit boundry between business component, using the folder structure could be a way to rescue. Anyway, that's it for now, will continue talk about the testing, tasks, generators, sorbot and more next (If I got time).
