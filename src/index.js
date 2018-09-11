import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import SelectReact from 'react-select';
import utils from './utils';

class CombinedOrderBooks extends React.Component {

//  baseUrl = 'http://54.187.105.135:3001'
  baseUrl = 'http://localhost:3001'
szdfasdfdsadfsasfd
  
  // TODO write the readme and change ip address above
  constructor(props) {
    super(props)
    this.state = {
      // base and quote symbols for which order books to combine.  Default is the BTC-ETH combined order book
      base: 'BTC', 
      quote: 'ETH',
      
      // How much decimal precision to use for order book prices. 
      // Exchanges usually have 8 decimal places by default but this rarely results in orders being combined because the prices dont match
      precision: 4,

      // combined order book data
      combinedBookData: undefined,

      // overlapping order book data (arbitrage opportunities)
      overlaps: [],
      
      // available order books for quote side.
      symbols: undefined,
    }
  }
  
  async componentDidMount() {
    
    const fetched = await utils.fetchData(this.baseUrl, this.state.base, this.state.quote, this.state.precision)
    this.setState(fetched)
  }
  
  handleBaseChange = async (selectedBaseOption) => {
    this.setState({ base: selectedBaseOption.value });
    this.setState(await utils.fetchData(this.baseUrl, this.state.base, this.state.quote, this.state.precision))
  }
  handleQuoteChange = async (selectedQuoteOption) => {
    this.setState({ quote: selectedQuoteOption.value });
    this.setState(await utils.fetchData(this.baseUrl, this.state.base, this.state.quote, this.state.precision))
  }
  handlePrecisionChange = async (selectedPrecisionOption) => {
    this.setState({ precision: selectedPrecisionOption.value });
    this.setState(await utils.fetchData(this.baseUrl, this.state.base, this.state.quote, selectedPrecisionOption.value))
  }
  
  render() {

    const columnsData = this.state.combinedBookData ? utils.generateOrderBookColumnsData(this.state.combinedBookData) : []
    const bidsRowsData = this.state.combinedBookData ? utils.generateOrderBookRowsData(this.state.combinedBookData, 'bids') : []
    const asksRowsData = this.state.combinedBookData ? utils.generateOrderBookRowsData(this.state.combinedBookData, 'asks') : []
    const quoteSelectionOptions = this.state.symbols ? utils.generateQuoteSelectionData(this.state.symbols) : undefined
    const overlapData = this.state.overlaps ? utils.generateOverlapData(this.state.overlaps) : []
    
    return (
      <div>
        <div>
          Base Symbol
          <SelectReact 
            value={{value: this.state.base, label: this.state.base}}
            onChange={this.handleBaseChange}
            options={[
              { value: 'BTC', label: 'BTC' },
              { value: 'ETH', label: 'ETH' },
            ]}
          />
          Quote Symbol
          <SelectReact
            value={{value: this.state.quote, label: this.state.quote}}
            onChange={this.handleQuoteChange}
            options={quoteSelectionOptions}
          />
          Precision (Lower precision combines more orders)
          <SelectReact
            value={{value: this.state.precision, label: this.state.precision+' Decimals'}}
            onChange={this.handlePrecisionChange}
            options={[
              { value: 2, label: '2 Decimals' },
              { value: 3, label: '3 Decimals' },
              { value: 4, label: '4 Decimals' },
              { value: 5, label: '5 Decimals' },
              { value: 6, label: '6 Decimals' },
              { value: 7, label: '7 Decimals' },
              { value: 8, label: '8 Decimals' },
            ]}
          />
        </div>
        
        <div style={{paddingTop: '3em'}}>Combined Bids Order Book {this.state.base}-{this.state.quote}</div>
        <ReactTable
          data={bidsRowsData}
          columns={columnsData}
        />
        <div style={{paddingTop: '3em'}}>Combined Asks Order Book {this.state.base}-{this.state.quote}</div>
        <ReactTable
          data={asksRowsData}
          columns={columnsData}
        />
        <div style={{paddingTop: '3em'}}>Overlapping Bids / Asks (Arbitrage Opportunities) {this.state.base}-{this.state.quote}</div>
        <ReactTable
          data={overlapData}
          columns={[{
            Header: 'Bid Price',
            accessor: 'bid'
          }, {
            Header: 'Ask Price',
            accessor: 'ask'
          }, {
            Header: 'Bid Exchange',
            accessor: 'bidExchange'
          }, {
            Header: 'Ask Exchange',
            accessor: 'askExchange'
          }]}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <CombinedOrderBooks />,
  document.getElementById('root')
);
