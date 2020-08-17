---
layout: post
title:  "10 things learned from Practical Object Oriented Design in Ruby"
date:   2020-08-16
categories: ruby
---

## Hide instance variables

```ruby
# Bad
class Demo
  def initialize(name)
    @name = name
  end

  def greet
    puts "Hi, #{@name}"
  end
end

# Good
class Demo
  attr_reader :name
  def initialize(name)
    @name = name
  end

  def greet
    puts "Hi, #{name}"
  end
end
```

## Hide Data Structures

```ruby
# Bad
class ObsecuringReferences
  attr_reader :data
  def initialize(data)
    @data = data
  end

  def diameters
    data.collect {|cell| cell[0] + (cell[0] * 2)} 
  end
end

# Good
class RevealingReferences
  attr_reader :wheels
  def initialize(data)
    @wheels = wheelify(data)
  end

  def diameters
    wheels.collect {|wheel| wheel.rim + (wheel.tire * 2)}
  end

  Wheel = Struct.new(:rim, :tire)
  def wheelify(data)
    data.collect {|cell| Wheel.new(cell[0], cell[1])}
  end
end
```

## Single responsibility for function
```ruby
# Bad
def gear_inches
  ratio * (rim + (tire * 2)) 
end

# Good
def gear_inches
  ratio * diameter
end

def diameter
  rim + (tire * 2)
end
```

## Single responsibility for class
```ruby
# Bad
class Gear
  # ...
  def diamter
    rim + (tire * 2)
  end
end

# Good
class Gear
  # ...
  # This struct could be seperated to be a class
  Wheel = Struct.new(:rim, :tire) do
    def diameter
      rim + (tire * 2)
    end
  end
end
```

## Dependency injection
```ruby
# Bad
class Gear
  attr_reader :chainring, :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire
  end

  def gear_inches
    ratio * Wheel.new(rim, tire).diameter
  end
end

# Good
class Gear
  attr_reader :chainring, :cog, :wheel
  def initialize(chainring, cog, wheel=nil)
    @chainring = chainring
    @cog = cog
    @wheel = wheel
  end

  def gear_inches
    ratio * wheel.diameter
  end
end
```

## Dependency isolation
```ruby
# Bad
class Gear
  attr_reader :chainring, :cog, :rim, :tire
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @rim = rim
    @tire = tire
  end

  def gear_inches
    ratio * Wheel.new(rim, tire).diameter
  end
end

# Good
class Gear
  attr_reader :chainring, :cog, :wheel
  def initialize(chainring, cog, rim, tire)
    @chainring = chainring
    @cog = cog
    @wheel = Wheel.new(rim, tire)
  end

  def gear_inches
    ratio * wheel.diameter
  end
end
```

## Wrapper initialization
```ruby
# Good
module ExternalFramework
  class Gear
    def initialize(arg1, arg2, arg3)
      # ...
    end
  end
end

module MyWrapper
  def self.gear(chainring:, cog:, wheel:)
    ExternalFramework::Gear.new(chainring, cog, wheel)
  end
end
```

## Dependency direction

Rule of thumb: Depend on things that change less often than you do.

## Law of delemeter

Use more delegation

## Inheritance with post initialize

```ruby
class AbstractClass
  def initialize(args)
    # ...
    post_initialize(args)
  end

  protected

  def post_initialize(args)
    nil
  end
end
```