# Introduction

This frontend react app displays combined order books and arbitrage opportunity data
(overlapping bid / ask orders) for specified base-quote symbol pairs from the following exchanges:

- Bittrex
- Poloniex
- Kraken
- Binance
- Hitbtc

It offers the ability to choose from ETH or BTC as the base symbol to be paired
with large number of possible quote symbols.  ETH-BTC is the default pair if none are specified.


## Setup

1. Install Node js 8 or higher

2. Run `npm install` from the project root

## Running the server

1. Clone and start the backend repository:  https://github.com/elmutt/combiner_backend
1. Run `npm start` from the project root.

## Running tests

1. Run `npm test` from the project root

## Notes

#### Price Precision

Most exchanges offer 8 decimal places of precision, making it very rare that orders
from multiple order books fall on the same price and be combined.

For this reason the precision can be changed, allowing the user to seehow different
precisions effect how orders are combined across order books from different exchanges.
