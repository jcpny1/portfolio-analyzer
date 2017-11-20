# STOCK ANALYZER

[![GitHub version](https://badge.fury.io/gh/jcpny1%2Fstock-analyzer.svg)](https://badge.fury.io/gh/jcpny1%2Fstock-analyzer)
[![Build Status](https://travis-ci.org/jcpny1/stock-analyzer.svg?branch=master)](https://travis-ci.org/jcpny1/stock-analyzer)
[![Test Coverage](https://api.codeclimate.com/v1/badges/538214c12d1599ae33d3/test_coverage)](https://codeclimate.com/github/jcpny1/stock-analyzer/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/538214c12d1599ae33d3/maintainability)](https://codeclimate.com/github/jcpny1/stock-analyzer/maintainability)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/jcpny1/stock-analyzer.svg)](https://beta.gemnasium.com/projects/github.com/jcpny1/stock-analyzer)
[![Docs](http://inch-ci.org/github/jcpny1/stock-analyzer.svg)](http://inch-ci.org/github/jcpny1/stock-analyzer)

## Overview

The Stock Analyzer App is a portfolio monitoring tool. You can enter your investment holdings and monitor their total and intra-day value change.

![Stock Analyzer Positions Page](https://github.com/jcpny1/stock-analyzer/blob/master/Screenshot-2017-11-13%20StockAnalyzer.png?raw=true "Stock Analyzer Positions Page")

It was created to meet the requirements of the [Flatiron School](https://flatironschool.com/)'s React Redux portfolio project. It incorporates Rails, Node.js, React, Redux, Thunk, and Semantic-UI.

This repository contains the front end code in the client folder. The remaining folders are primarily for the server code.

## History
```
12-Nov-17  0.1.0  Initial release.  
```

## Installation

Stock-Analyzer was developed using earlier versions of the following, but was released using Ruby 2.4.2, Rails 5.1.4, Node.js 8.9.1.

### Initialize the project
* Clone the [Stock Analyzer Repository](https://github.com/jcpny1/stock-analyzer).
* `cd` into the project directory.
* `bundle install`

### Setup the database
* `rake db:migrate`
* `rake db:seed`

### Install npm packages
* `cd client`
* `npm install`

### Setup the data provider keys
To receive market data, the server requires an internet connection and a few API keys:
* Market data from [IEX](https://iextrading.com/) is currently free and does not require authentication.

* Index data from [Alpha Vantage](https://www.alphavantage.co/) requires a key. Registration is required. There is no charge.

* Headline news from [News API](https://newsapi.org/) requires a key. Registration is required. There is no charge.

The keys should be placed in the project's home directory in a file called `.env`, as in the following example:
```
  ALPHA_VANTAGE_API_KEY: ABCDEFGHIJKLMNOP
  NEWSAPI_API_KEY: abcdefghijklmnopqrstuvwxyzabcdef
```

## Usage

* From the project home directory, type `rake start`.
* The server will start. When the server is ready, a new default browser tab will open at the Stock Analyzer home page.
* When your positions are first loaded, they will be priced with the latest available information from the Stock Analyzer database. Each time you hit Refresh, the prices will be updated with latest data from the market data provider.
* The latest news headlines and DJIA value are presently set to update as follows: on the initial page load, when the entire page is refreshed, and once per minute.
* Database seed data includes just ten ticker symbols to work with. If you need more, there are Help menu options to download a complete list of symbols from the market data vendor into the database and to download the latest prices into the database for each of those symbols. Use the latest price download sparingly; It could lock up the database for quite some time.

## Warnings

* There is no login logic at this time. Any data you enter into the system is subject to being viewed, edited, or deleted by anyone else with access to the same server.
* The market data shown may not be the latest information available or may be inaccurate.
* Any data, tools, or methods offered are for software development practice only. They may not be accurate. No decisions should be based on what is presented in this application.

## Testing

To run the test suite (from the project home directory):
* `bundle exec rspec`

## Deployment

TBD

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jcpny1/stock-analyzer. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The application is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
