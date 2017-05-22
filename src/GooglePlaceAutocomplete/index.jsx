
import React, { Component } from 'react';
import AutoComplete from '../AutoComplete';

class GooglePlaceAutocomplete extends Component {

  constructor(props) {
    super(props);

    var google_map = googleMutant._mutant;
    // window.google_map = google_map;

    // this.autocompleteService = new google.maps.places.AutocompleteService();
    this.autocompleteService = new google.maps.places.PlacesService(google_map);
    this.state = {
      dataSource: [],
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.searchText !== nextProps.searchText) {
      this.onUpdateInput(nextProps.searchText, this.state.dataSource);
      this.onInputChange(nextProps.searchText);
    }
  }

  updateDatasource(data) {

    console.log('updateDatasource', data);

    // if(!data || !data.length) {
    //   return false;
    // }

    var data = data || [];

    if(this.state.data) {
      this.previousData = { ...this.state.data };
    }
    this.setState({
      dataSource: data.map(place => place.name),
      data
    });

    if(this.props.onUpdateDatasource){
      this.props.onUpdateDatasource(data);
    }
  }

  getBounds() {
    // if(!this.props.bounds || (!this.props.bounds.ne && !this.props.bounds.south)) {
    //   return undefined;
    // }
    //
    // if(this.props.bounds.ne && this.props.bounds.sw) {
    //   return new google.maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
    // }
    //
    // return {
    //   ...this.props.bounds
    // };

    // return map.getBounds();

    return google_map.getBounds();
  }

  onUpdateInput(searchText, dataSource) {
    if (!searchText.length || !this.autocompleteService) {
      return false;
    }

    // console.log('searchText', searchText);
    // console.log('getBounds', this.getBounds());

    let request = {
      query: searchText,
      bounds: this.getBounds()
    };

    // this.autocompleteService.getPlacePredictions(request, data => this.updateDatasource(data));
    // this.autocompleteService.getQueryPredictions(request, data => this.updateDatasource(data));
    // this.autocompleteService.radarSearch(request, data => this.updateDatasource(data));
    this.autocompleteService.textSearch(request, data => this.updateDatasource(data));
  }

  onNewRequest(searchText, index) {

    console.log('GooglePlaceAutocomplete onNewRequest', searchText, index);

    if(index === -1) {
      return false;
    }

    console.log('GooglePlaceAutocomplete onNewRequest 2', searchText, index);

    const data = this.previousData || this.state.data;

    this.props.onNewRequest(data[index], searchText, index);
  }

  onInputChange(searchText, dataSource, params) {
    this.props.onChange({target: {value: searchText}}, dataSource, params);
  }

  render() {
    const {location, radius, bounds, ...autoCompleteProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <AutoComplete
        {...autoCompleteProps}
        ref={this.props.getRef}
        filter={this.props.filter}
        onUpdateInput={this.onInputChange.bind(this)}
        dataSource={this.state.dataSource}
        onNewRequest={this.onNewRequest.bind(this)}
      />
    );
  }
}

GooglePlaceAutocomplete.propTypes = {
  location: React.PropTypes.object,
  radius: React.PropTypes.number,
  onNewRequest: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  getRef: React.PropTypes.func,
  types: React.PropTypes.arrayOf(React.PropTypes.string),
  bounds: React.PropTypes.object
};

GooglePlaceAutocomplete.defaultProps = {
  location: {lat: 0, lng: 0},
  radius: 0,
  filter: AutoComplete.noFilter
};

export default GooglePlaceAutocomplete;