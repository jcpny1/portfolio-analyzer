source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.1.4'  # Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'sqlite3'  # Use sqlite3 as the database for Active Record
gem 'puma', '~> 3.7'  # Use Puma as the app server

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

# JCP added:
gem 'active_model_serializers', '~> 0.10.0'
gem 'dotenv-rails'
gem 'foreman', '~> 0.84.0'
gem 'faraday'  # for GET and POST
# end JCP added

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'  # speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'pry'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
