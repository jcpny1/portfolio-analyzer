source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.2'  # Ruby language version.

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rake', '~> 13.0.3' # Ruby make
gem 'rails', '~> 6.0', '>= 6.0.3.4'  # Full-stack web framework.
gem 'pg', '~> 1.2', '>= 1.2.3' # Use postgresql as the database for Active Record.
gem 'puma', '~> 5.3'            # Use Puma as the (HTTP 1.1) app server.
gem 'sass-rails', '~> 6.0'     # Use SCSS for stylesheets.
gem 'uglifier', '>= 4.2'       # Use Uglifier as compressor for JavaScript assets.
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'mini_racer', platforms: :ruby

gem 'coffee-rails', '~> 5.0'   # Use CoffeeScript for .coffee assets and views
gem 'turbolinks', '~> 5.2', '>= 5.2.1'  # Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks.
gem 'jbuilder', '~> 2.10.1'    # Create JSON structures via a Builder-style DSL.
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use ActiveStorage variant
# gem 'mini_magick', '~> 4.8'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'bootsnap', '~> 1.5', '>= 1.5.1', require: false  # Reduces boot times through caching; required in config/boot.rb.
gem 'active_model_serializers', '~> 0.10.10' # JSON generators.
gem 'addressable', '~> 2.7'                  # URI encoder.
gem 'dotenv-rails', '~> 2.7', '>= 2.7.6'     # Loads environment variables from `.env`.
gem 'faraday', '~> 1.1'                      # HTTP/REST API client library.
gem 'sidekiq', '~> 6.1', '>= 6.1.2'          # Background processing for Ruby.

gem 'nokogiri', '~> 1.13'                  # HTML parser.

group :development, :test do
  gem 'byebug', '~> 11.1', '>= 11.1.3', platforms: [:mri, :mingw, :x64_mingw]   # Call 'byebug' anywhere in the code to stop execution and get a debugger console.
end

group :development do
  gem 'web-console', '>= 4.1'             # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'listen', '~> 3.3', '>= 3.3.1'      # File modification notifications.
  gem 'spring', '~> 2.1', '>= 2.1.1'      # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring.
  gem 'spring-watcher-listen', '~> 2.0', '>= 2.0.1'  # Makes spring watch files using the listen gem.
end

group :test do
  gem 'capybara', '~> 3.33'               # Adds support for Capybara system testing and selenium driver. Needed for RSpec feature tests.
#  gem 'chromedriver-helper', '~> 2.1.1'   # Easy installation and use of chromedriver to run system tests with Chrome.
  gem 'factory_bot_rails', '~> 6.1'       # Factory to Rails integration.
  gem 'foreman', '~> 0.87.2'              # Process manager for applications with multiple components.
  gem 'rspec-rails', '~> 4.0.1'           # Rails testing framework.
  gem 'rspec-sidekiq', '~> 3.1'           # Sidekiq rspec testing.
  gem 'selenium-webdriver', '~> 3.142', '>= 3.142.7' # Used by Capybara.
  gem 'simplecov', '< 0.18'               # Ruby code coverage analysis. (Presently, Code Climate does not support a higher version.)
  gem 'webmock', '~> 3.10.0'              # HTTP request stubbing.
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', '~>1.2018.7', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
