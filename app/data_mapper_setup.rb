env = ENV["RACK_ENV"] || "development"

DataMapper.setup(:default, ENV["DATABASE_URL"] || "postgres://postgres:a@localhost/look_up_#{env}")
DataMapper.finalize
DataMapper.auto_upgrade!

