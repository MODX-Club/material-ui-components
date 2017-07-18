import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import customPropTypes from 'material-ui/utils/customPropTypes';

import TextField from 'material-ui/TextField';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import GooglePlaceAutocomplete from '../GooglePlaceAutocomplete/';

import GoogleMapsLoader from 'google-maps'; // only for common js environments 

const defaultProps = {

	googleOptions: {
    center: {lat: 55.7545372, lng: 37.6678356},
    zoom:12,
    mapTypeControl: false,	
		scrollwheel: true,
  },
}

const styleSheet = createStyleSheet('GoogleMap', (theme) => ({
  root: {
  	position: 'relative',
  	height: 400,
  },

}));

var classes;
 

export default class GoogleMap extends Component{

	constructor(props){

		super(props);

		this.state = { 
			// map: null,
		}
	}
 

  componentWillMount(){
    classes = this.context.styleManager.render(styleSheet);

    this.classes = classes;
  } 

  componentDidUpdate(prevProps, prevState){

    if(!prevState.map && this.state.map){

    	let {map} = this.state;
    }
  }
 

  componentDidMount(){


    if(typeof window != "undefined"){ 

	  	// console.log('Map componentDidMount', this, this.refs, this.refs.mapContainer);
	  	
	  	// let element = ReactDOM.findDOMNode(this.GoogleMapContainer);
	  	// console.log('Map componentDidMount', element); 


      GoogleMapsLoader.KEY = 'AIzaSyBdNZDE_QadLccHx5yDc96VL0M19-ZPUvU';
      // GoogleMapsLoader.onLoad(function(google) {
      //     console.log('I just loaded google maps api');
      // });
      GoogleMapsLoader.LIBRARIES = ['places'];

      GoogleMapsLoader.load(google => this.onMapLoaded(google));

    }

    return;
  }


  onMapLoaded(google){


  	let element = this.GoogleMapContainer;

  	if(!element){

  		console.error('GoogleMap', "Can not get element");
  		return;
  	}


    var options = this.prepareGoogleOptions();

    // console.log('options', options);

    var map = new google.maps.Map(element, options); 

   //  var centerControlDiv = this.AutoComplete;

	  // map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


	  // console.log('map.controls AutoComplete', this.AutoComplete);
	  // console.log('map.controls', map.controls);


	 //  var Latlng;

	 //  if(this.props.markerLat && this.props.markerLng){
	 //  	Latlng = new google.maps.LatLng(this.props.markerLat, this.props.markerLng);
	 //  }
	 //  else{
	 //  	Latlng = map.center;
	 //  }

		// var marker = new google.maps.Marker({
	 //    position: Latlng, 
	 //    map: map, 
	 //    draggable:true
		// });
		// google.maps.event.addListener(
	 //    marker,
	 //    'drag',
	 //    () => {
	 //      var lat = marker.position.lat();
	 //      var lng = marker.position.lng();

	 //      if(this.props.onMarkerChangePosition){
	 //      	this.props.onMarkerChangePosition(lat, lng);
	 //      }
	 //    }
		// );

    this.setState({map, google});
  }


  prepareGoogleOptions(){
    var options = {};

    let {googleOptions} = this.props;

    for(var i in googleOptions){
      var value = googleOptions[i];

      switch(i){

        case 'center':
          // value = value.split(",");
          // value = new google.maps.LatLng(Number(value[0]),Number(value[1]));
          value = new google.maps.LatLng(value);
          break;

        default:;
      }

      options[i] = value;
    } 

    return options;
  }

  // <div
  //       ref={(div) => { this.AutoComplete = div; }}	
		// 	>
				
		// 		{this.state.map ? <GooglePlaceAutocomplete 
	 //    		// onNewRequest={(value) => {}}
	 //    		// onChange={(value) => {}}
	 //    		map={this.state.map}
	 //    	/> : null}
		// 	</div>

	render(){

		let {
			googleOptions,
			onMarkerChangePosition,
			children,
			...other,
		} = this.props;

		return <div
			className={[classes.root, this.props.className].join(" ")}
      ref={(div) => { this.GoogleMapContainer = div; }}	
      {...other}	
		> 
			{children}

		</div>;
	}
}

GoogleMap.defaultProps = defaultProps;

GoogleMap.contextTypes = {
  styleManager: customPropTypes.muiRequired,
};

GoogleMap.propTypes = {
  onMarkerChangePosition: PropTypes.func,
}
