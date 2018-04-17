# PORTFOLIO ANALYZER

[![GitHub version](https://badge.fury.io/gh/jcpny1%2Fportfolio-analyzer.svg)](https://badge.fury.io/gh/jcpny1%2Fportfolio-analyzer)
[![Build Status](https://travis-ci.org/jcpny1/portfolio-analyzer.svg?branch=master)](https://travis-ci.org/jcpny1/portfolio-analyzer)
[![Test Coverage](https://api.codeclimate.com/v1/badges/7ca3b07d0b24fbcd472b/test_coverage)](https://codeclimate.com/github/jcpny1/portfolio-analyzer/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/7ca3b07d0b24fbcd472b/maintainability)](https://codeclimate.com/github/jcpny1/portfolio-analyzer/maintainability)
[![Dependency Status](https://beta.gemnasium.com/badges/github.com/jcpny1/portfolio-analyzer.svg)](https://beta.gemnasium.com/projects/github.com/jcpny1/portfolio-analyzer)
[![Inline docs](http://inch-ci.org/github/jcpny1/portfolio-analyzer.svg)](http://inch-ci.org/github/jcpny1/portfolio-analyzer)

## Overview

The Portfolio Analyzer App is a portfolio monitoring tool.
You can enter your investment holdings and monitor their total value and intra-day value change.

![Portfolio Analyzer Positions Page](https://github.com/jcpny1/portfolio-analyzer/blob/master/Screenshot-2017-11-13%20PortfolioAnalyzer.png?raw=true "Portfolio Analyzer Positions Page")

It was created to meet the requirements of the [Flatiron School](https://flatironschool.com/)'s React Redux portfolio project.
It incorporates Rails, Node.js, React, Redux, Thunk, and Semantic-UI-React.

This repository contains the front end code in the client folder.
The remaining folders are primarily for the server code.

## History
```
dd-mmm-yy  x.y.z  Added more Jest tests.
                  Added option to bulk load series data only for symbols contained in Positions table.
                  Removed option to bulk load Series data only for symbols missing from Series table.
                  Increased index fetch and series fetch throttling delays. Keep tripping AV rate limits (might be a feed bug; it's not me).
                  Refresh Series data points for newly added Position Instrument.
10-Apr-18  0.6.1  Updated gems.
10-Apr-18  0.6.0  Enhanced series feed error handling.
                  Cut Sidekiq threads from 10 to 1. Reduces Heroku worker dyno memory utilization and prevents concurrent bulk operations.
                  Bulk refresh instrument prices will now update in sorted symbol order.
                  Localized refresh time string and hover tooltip.
                  Updated usage notes.
                  Updated gems.
                  Updated node packages.
                  Moved chart code out of formatter and into new ChartData class.
                  Memoized data feed vendor keys.
                  Added first jest test.
                  Only chart portfolio value to earliest end date of underlying instruments to avoid incorrect valuation due to missing data.
                  Reduction in RuboCop findings.
                  Reduced series fetch rate to prevent exceeding vendor limits.
                  Now storing all available series data; Removed hardcoded year 2013 start date. Pass date range from client.
                  Series fetch API now accepts a date range.
                  Removed dividend reinvestment adjustments from chart now that we are using adjusted data.
                  Moved Settings menu item from Help menu to main level.
                  When editing an existing position, the date-acquired field will now show the existing value instead of today's date.
                  Display portfolio name in red/green/black color depending on gain/loss value.
27-Mar-18  0.5.0  Added portfolio composite to chart in addition to individual instruments.
                  Reduced headlines refresh rate to not exceed the free license limit with just two Portfolio Analyzer apps running.
                  Bulk refresh series data will now update in symbol order.
                  Incorporated a few Code Climate suggestions. Also updated config file to V2.
                  Added new Decimal class data type 'percent'.
                  Added new derived field 'pctTotalMV' (percentage of Total Market Value of portfolio) to class Position.
                  Removed lastUpdate from the positions page.
                  Added pctTotalMV to the positions page.
                  Removed some code smells from feed handlers.
                  Starting chart date will be the latest start date of all instruments in the chart.
23-Mar-18  0.4.1  Update for loofah gem security fix.
                  Update chart $ symbol display.
                  Only keep the latest data point for each month in the monthly series table.
                  Added chart button to positions page next to portfolio name.
21-Mar-18  0.4.0  Monthly series data is now bulk loaded into the database on demand. Chart app now pulls data from database.
17-Mar-18  0.3.0  Switched from the default json serializer adapter to the more standard json_api serializer adapter.
03-Mar-18  0.2.0  Updates for changes to NewsApi.org's API. Fixed bug where a new position could not be added to a portfolio.
12-Nov-17  0.1.0  Initial release.
```

## Installation

Portfolio-Analyzer was developed using earlier versions of the following, but was released using Ruby 2.4.2, Rails 5.1.4, Node.js 8.9.1.

### Initialize the project
* Clone the [Portfolio Analyzer Repository](https://github.com/jcpny1/portfolio-analyzer).
* `cd` into the project directory.
* `bundle install`

### Install redis server (if not installed yet)
* `sudo apt-get install redis-server`
* In /etc/rc.local, add:
  ```
  if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
    echo never > /sys/kernel/mm/transparent_hugepage/enabled
  fi
  ```

### Setup the database
* `rake db:migrate`
* `rake db:seed`

### Install npm packages
* `cd client`
* `npm install`  (the default responses are ok)

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
* The server will start. When the server is ready, a new default browser tab will open at the Portfolio Analyzer home page.
* When your positions are first loaded, they will be priced with the latest available information from the Portfolio Analyzer database. Each time you hit Refresh, the prices will be updated with latest data from the market data provider.
* The latest news headlines and DJIA value are presently set to update as follows: on the initial page load, when the entire page is refreshed, and once per two minutes.
* Database seed data includes just ten ticker symbols to work with. If you need more, there are Help menu options to download a complete list of symbols from the market data vendor into the database and to download the latest prices into the database for each of those symbols.

## Warnings

* There is no login logic at this time. Any data you enter into the system is subject to being viewed, edited, or deleted by anyone else with access to the same server.
* The market data shown may not be the latest information available or may be inaccurate.
* Any data, tools, or methods offered are for software development practice only. They may not be accurate. No decisions should be based on what is presented in this application.

## Testing

To run the test suite:
* In one window, run `npm start` from the client directory.
* On another window, run `RAILS_ENV=test bundle exec rspec` from the project home directory.

You may have to migrate and seed the test database.

## Deployment

TBD

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jcpny1/portfolio-analyzer.
This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The application is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
