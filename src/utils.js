
export default {


  // generates data used for quote symbol selection dropdown
  generateQuoteSelectionData: function(symbols) {
    return symbols.map( (symbol) => {
      return { value: symbol, label: symbol }
    })
  },

  // Generates labels for each column in the displayed order book table.  Can vary depending on how many exchanges were combined.
  generateOrderBookColumnsData: function(combinedBookData) {
    const columnItems = []
    columnItems.push({Header: "Price", accessor: 'price'})
    combinedBookData.exchangesIncluded.forEach( (exchange) => {
      columnItems.push({Header: exchange + ' amount', accessor: exchange + '_amount'})
    })
    columnItems.push({Header: '# of orders combined', accessor: 'combined'})
    return columnItems
  },

  // Generate all row data to be displayed in order book table.  Can be "bids" or "asks"
  generateOrderBookRowsData: function(combinedBookData, type) {
    const rowItems = combinedBookData[type].map( (order) => {
      const rowItem = {}
      rowItem.price = order.price
      Object.keys(order.exchangeQuantities).forEach( (exchange, index) => {
        rowItem[exchange + '_amount'] = order.exchangeQuantities[exchange]
      })
      rowItem.combined = order.combinedOrderCount
      return rowItem
    })
    return rowItems
  },

  // generates data for price overlap tables.
  generateOverlapData: function(overlaps) {
    return overlaps.map( (overlap) => {
      return {
        bid: overlap.bid.price,
        ask: overlap.ask.price,
        bidExchange: overlap.bidExchange,
        askExchange: overlap.askExchange
      }
    })
  },

  fetchData: async function (url, base, quote, precision) {
    const symbols = await fetch(url + '/symbols').then((results) => results.json())
    const overlaps = await fetch(url + '/overlaps').then((results) => results.json())
    const combinedBookData = await fetch(url + '/combined?base=' + base + '&quote=' + quote + '&precision=' + precision).then((results) => results.json())
    return {symbols, combinedBookData, overlaps}
  }

}