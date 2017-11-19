source 'https://rubygems.org'

# force use of https.
git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

gem 'puma', '~> 3.10'             # HTTP 1.1 server for Ruby/Rack applications.
gem 'rails', '~> 5.1', '>= 5.1.4' # Full-stack web framework.
gem 'sqlite3'                     # Used as the database for Active Record.

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

gem 'active_model_serializers', '~> 0.10.0' # JSON generators.
gem 'addressable'                           # URI encoder.
gem 'dotenv-rails'                          # Loads environment variables from `.env`.
gem 'faraday'                               # HTTP/REST API client library.
gem 'foreman', '~> 0.84.0'                  # Process manager for applications with multiple components.
gem 'sidekiq'                               # Background processing for Ruby.

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'       # File modification notifications.
  gem 'spring'                            # Preloads your application so things like console, rake and tests run faster.
  gem 'spring-watcher-listen', '~> 2.0.0' # Makes spring watch files using the listen gem.
end

group :test do
  gem 'capybara'              # Needed for RSpec feature tests.
  gem 'factory_bot_rails'     # Factory to Rails integration.
  gem 'rspec-rails', '~> 3.6' # Rails testing framework.
  gem 'selenium-webdriver'    # Used by Capybara.
  gem 'rspec-sidekiq'         # Sidekiq rspec testing.
  gem 'simplecov'             # Ruby code coverage analysis.
  gem 'webmock'               # HTTP request stubbing.
end

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]   # A Ruby debugger.
  gem 'pry'                                             # An IRB alternative runtime developer console.
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]  # Timezone database packaged as Ruby modules for TZInfo.
