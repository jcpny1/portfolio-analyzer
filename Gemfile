source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.5.3'  # Ruby language version.

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.1'       # Full-stack web framework.
gem 'pg', '>= 0.18', '< 2.0'  # Use postgresql as the database for Active Record.
gem 'puma', '~> 3.11'         # Use Puma as the (HTTP 1.1) app server.
gem 'sass-rails', '~> 5.0'    # Use SCSS for stylesheets.
gem 'uglifier', '>= 1.3.0'    # Use Uglifier as compressor for JavaScript assets.
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

gem 'coffee-rails', '~> 4.2'  # Use CoffeeScript for .coffee assets and views
gem 'turbolinks', '~> 5'      # Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'jbuilder', '~> 2.5'      # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'bootsnap', '>= 1.1.0', require: false  # Reduces boot times through caching; required in config/boot.rb
gem 'active_model_serializers', '~> 0.10.0' # JSON generators.
gem 'addressable', '~> 2.5.2'               # URI encoder.
gem 'dotenv-rails', '~> 2.5.0'              # Loads environment variables from `.env`.
gem 'faraday', '~> 0.15.4'                  # HTTP/REST API client library.
gem 'sidekiq', '~> 5.2.3'                   # Background processing for Ruby.

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]   # Call 'byebug' anywhere in the code to stop execution and get a debugger console
end

group :development do
  gem 'web-console', '>= 3.3.0'           # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'listen', '>= 3.0.5', '< 3.2'       # File modification notifications.
  gem 'spring', '~> 2.0.2'                # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring-watcher-listen', '~> 2.0.0' # Makes spring watch files using the listen gem.
end

group :test do
  gem 'capybara', '>= 2.15'               # Adds support for Capybara system testing and selenium driver. Needed for RSpec feature tests.
  gem 'chromedriver-helper', '~> 2.1.0'   # Easy installation and use of chromedriver to run system tests with Chrome
  gem 'factory_bot_rails', '~> 4.11.1'    # Factory to Rails integration.
  gem 'foreman', '~> 0.85.0'              # Process manager for applications with multiple components.
  gem 'rspec-rails', '~> 3.8.1'           # Rails testing framework.
  gem 'rspec-sidekiq', '~> 3.0.3'         # Sidekiq rspec testing.
  gem 'selenium-webdriver', '~> 3.141.0'  # Used by Capybara.
  gem 'simplecov', '~> 0.16.1'            # Ruby code coverage analysis.
  gem 'webmock', '~> 3.4.2'               # HTTP request stubbing.
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', '~>1.2018.7', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
