# STOCK ANALYZER

[![Build Status](https://api.travis-ci.org/jcpny1/recipe-cat.svg?branch=master)](http://travis-ci.org/jcpny1/recipe-cat)
[![Test Coverage](https://codeclimate.com/github/jcpny1/recipe-cat/badges/coverage.svg)](https://codeclimate.com/github/jcpny1/recipe-cat/coverage)
[![Code Climate](https://codeclimate.com/github/jcpny1/recipe-cat/badges/gpa.svg)](https://codeclimate.com/github/jcpny1/recipe-cat)
[![Issue Count](https://codeclimate.com/github/jcpny1/recipe-cat/badges/issue_count.svg)](https://codeclimate.com/github/jcpny1/recipe-cat)
[![Dependency Status](https://gemnasium.com/badges/github.com/jcpny1/recipe-cat.svg)](https://gemnasium.com/github.com/jcpny1/recipe-cat)
[![Inline docs](http://inch-ci.org/github/jcpny1/recipe-cat.svg)](http://inch-ci.org/github/jcpny1/recipe-cat)

## Overview

The Stock Analyzer App is a portfolio monitoring tool. You can enter your stock holdings and monitor their total and intra-day value change.

It was created to meet the requirements of the [Flatiron School's](https://flatironschool.com/) React Redux portfolio project. It incorporates Rails, Node.js, React, Redux, Thunk, and Semantic-UI.

This repository contains the front end code in the client folder. The remaining folders are primarily for the server code.

![Stock Analyzer Positions Page](https://github.com/jcpny1/stock-analyzer/blob/master/Screenshot-2017-11-12%20StockAnalyzer.png?raw=true "Stock Analyzer Positions Page")

## History
```
12-Nov-17  0.1  Initial release.  
```

## Installation

Stock-Analyzer first release was developed using earlier versions of the following, but was released using Ruby 2.4.2, Rails 5.1.4, Node.js 8.9.1.

### Initialize the project
* Clone the [Stock Analyzer Repository](https://github.com/jcpny1/stock-analyzer).
* `cd` into the project directory.
* `bundle install`
* `rake db:migrate`
* `rake db:seed`

### Setup the data provider keys
To receive market data, the server requires an internet connection and a few API keys.
* Market data from [IEX](https://iextrading.com/) is currently free and does not require authentication.
* Index data from [Alpha Vantage](https://www.alphavantage.co/) requires a key. Registration is required. There is no charge.
* Headline news from [News API](https://newsapi.org/) requires a key. Registration is required. There is no charge.

The keys should be placed in the app's home directory in a file called `.env` as in the following example:
```
  ALPHA_VANTAGE_API_KEY: ABCDEFGHIJKLMNOP
  NEWSAPI_API_KEY: abcdefghijklmnopqrstuvwxyzabcdef
```

## Usage

* From the project directory, type `rake start`
* The server will start. When the server is ready, a new default browser tab will open at the Stock Analyzer home page.
* When your positions are first loaded, they will be priced with the latest available information from the Stock Analyzer database. Each time you hit Refresh, the prices will be updated with latest data from the market data provider.
* The latest news headlines and DJIA value are presently set to update on the initial page load, when the entire page is refreshed, and once per minute automatically.
* The seed data includes just ten ticker symbols to work with. If you need more, there are Help menu options to download the full symbology and to download the latest prices from the market data vendor. Use the latest price load sparingly; It could lock up the database for quite some time.

## Warnings

* There is no login logic at this time. Any data you enter into the system is subject to being viewed, edited, or deleted by anyone else with access to the same server.
* The market data shown may not be the latest information available or may be inaccurate.
* Any data, tools, or methods offered are for software development practice only. They may not be accurate. No decisions should be based on what is presented in this application.

## Testing

To run the test suite,

## Deployment

TBD

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jcpny1/recipe-cat. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The application is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
