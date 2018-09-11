import utils from '../utils'
import assert from 'assert'

describe('Test Utils', () => {
  it('it should test generateQuoteSelectionData()', () => {

    const symbols = ['BTC', 'ETH']
    
    const result = utils.generateQuoteSelectionData(symbols)
    
    assert(result[0].value === symbols[0])
    assert(result[0].label === symbols[0])

    assert(result[1].value === symbols[1])
    assert(result[1].label === symbols[1])
  });

  it('it should test generateOrderBookColumnsData()', () => {
    
    const testData = generateTestCombinedBookData()
    
    const result = utils.generateOrderBookColumnsData(testData)
         
    assert(result[0].Header === 'Price')
    assert(result[0].accessor === 'price')

    assert(result[1].Header === 'testExchange1 amount')
    assert(result[1].accessor === 'testExchange1_amount')

    assert(result[2].Header === 'testExchange2 amount')
    assert(result[2].accessor === 'testExchange2_amount')
  });
  
  it('it should test generateOrderBookRowsData()', () => {
    const testData = generateTestCombinedBookData()

    const resultAsks = utils.generateOrderBookRowsData(testData, 'asks')
    const resultBids = utils.generateOrderBookRowsData(testData, 'bids')
    
    assert(resultAsks[0].price === 1)
    assert(resultAsks[0].testExchange1_amount === 1)
    assert(resultAsks[0].testExchange2_amount === 2)
    assert(resultAsks[0].combined === 3)

    assert(resultBids[0].price === 2)
    assert(resultBids[0].testExchange1_amount === 2)
    assert(resultBids[0].testExchange2_amount === 4)
    assert(resultBids[0].combined === 6)

    
  });
  
  it('it should test generateOverlapData()', () => {

    const testData = [{
      bid: {price: 2},
      ask: {price: 1},
      bidExchange: 'testExchange1',
      askExchange: 'askExchange1'
    }]
    
    const result = utils.generateOverlapData(testData)

    assert(result[0].bid === testData[0].bid.price)
    assert(result[0].bidExchange === 'testExchange1')
    assert(result[0].askExchange === 'askExchange1')
  });

  it('it should test fetchData()', async () => {
    global.fetch = jest.fn().mockImplementation((inputs) => {
      
      if(inputs.includes('/symbols')){
        return Promise.resolve(mockSymbolsResponseData())
      }

      if(inputs.includes('/overlaps')){
        return Promise.resolve(mockOverlapTestData())
      }

      if(inputs.includes('/combined')){
        return Promise.resolve(mockTestCombinedBookData())
      }

    });
    
    const result = await utils.fetchData('test.com', 'BTC', 'ETH', 8)
    
    assert(result.symbols[0] === 'BTC')
    assert(result.symbols[1] === 'ETH')

    assert(result.combinedBookData.hasOwnProperty('asks'))
    assert(result.combinedBookData.hasOwnProperty('bids'))
    assert(result.combinedBookData.exchangesIncluded[0] === 'testExchange1')
    assert(result.combinedBookData.exchangesIncluded[1] === 'testExchange2')

    assert(result.overlaps[0].hasOwnProperty('ask'))
    assert(result.overlaps[0].hasOwnProperty('bid'))
    assert(result.overlaps[0].bidExchange === 'testExchange1')
    assert(result.overlaps[0].askExchange === 'askExchange1')
  });
  
});

function generateTestCombinedBookData() {
  return {
    asks: [
      {price: 1, exchangeQuantities: {testExchange1: 1, testExchange2: 2}, combinedOrderCount: 3}
    ],
    bids: [
      {price: 2, exchangeQuantities: {testExchange1: 2, testExchange2: 4}, combinedOrderCount: 6}
    ],
    exchangesIncluded: ['testExchange1', 'testExchange2']
  }
}

function mockTestCombinedBookData() {
  return {

    json: () => {
      return {
        asks: [
          {price: 1, exchangeQuantities: {testExchange1: 1, testExchange2: 2}, combinedOrderCount: 3}
        ],
        bids: [
          {price: 2, exchangeQuantities: {testExchange1: 2, testExchange2: 4}, combinedOrderCount: 6}
        ],
        exchangesIncluded: ['testExchange1', 'testExchange2']
      }


    }
  }
}

function mockOverlapTestData() {
  return {
    json: () => [{
      bid: {price: 2},
      ask: {price: 1},
      bidExchange: 'testExchange1',
      askExchange: 'askExchange1'
    }]
  }
}

function mockSymbolsResponseData() {
  return {
    json: () => ['BTC', 'ETH']
  }
}

function mockOverlapResponseData() {
  return {
    json: () => ['BTC', 'ETH']
  }
}