require "async"

## Example 1:
# def example(id)
#   Async do |task|
#     task.with_timeout(0.5) do
#       value = rand
#       puts "Putting #{id} to sleep for #{value} seconds."
#       task.sleep(value)
#       puts "#{id} woke up!"
#     rescue Async::TimeoutError
#       puts "#{id} timed out!"
#     end
#   end
# end

# Async do
#   5.times do |index|
#     example(index)
#   end
# end

## Example 2:
# def sleepy(duration = 1)
#   Async do |task|
#     task.sleep duration
#     puts "I'm done sleeping, time for action."
#   end
#   puts "Non-blocking message"
# end

# Async do
#   sleepy()
#   sleepy()
# end

## Example 3:
# Async do |task|
# 	while true
# 		puts Time.now
# 		task.sleep 1
# 	end
# end

## Example 4:
task = Async do
  rand
end

puts task.wait