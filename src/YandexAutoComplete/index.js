import React, {Component} from 'react';

import PropTypes from 'prop-types';

import AutoComplete from '../AutoComplete';

import { YMaps} from 'react-yandex-maps';


const defaultProps = {
}


export class YaAutoComplete extends AutoComplete{

  loadData(){

    // console.log('searchText loadData', this.state.searchText);

    let {
      searchText,
    } = this.state;

    let {
    	ymaps,
    } = this.props;

    if (!ymaps || !searchText.length) {
      return false;
    }
    
 		ymaps.geocode(searchText).then(
 			res => {
 				// console.log('res', res);

 				let dataSource = [];

 				res.geoObjects.each(geoObject => {
 					// console.log('geoObject', geoObject);

 					let {
 						name,
 						text,
 						description,
 						metaDataProperty: {
 							GeocoderMetaData,
 						},
 						geometry,
 						...other
 					} = geoObject.properties.getAll();

 					let {
 						geometry: {
 							_coordinates: coordinates,
 						},
 					} = geoObject;

 					// console.log('GeocoderMetaData', GeocoderMetaData);
 					// console.log('geometry', geometry);
 					// console.log('coordinates', coordinates);

 					dataSource.push({
 						id: GeocoderMetaData.id,
 						name: name,
 						formattedName: text,
 						coordinates,
 					});
 				});

 				this.setState({dataSource});
 			}
 		)
  }


	cleanupProps(props){

		let {
			ymaps,
			map,
			google,
			...other
		} = props;

		return super.cleanupProps(other);
	}
}

YaAutoComplete.propTypes = {
	ymaps: PropTypes.object,
};

export default class YandexAutoComplete extends Component{

	cleanupProps(props){

		let {
			...other
		} = props;

		return other;
	}

	render(){

		let props = this.cleanupProps(this.props);

		// console.log('YMapsProps', YMapsProps);

		return <YMaps
			children={function(ymaps){
				return <YaAutoComplete 
					ymaps={ymaps}
					// map={map}
					// google={google}
					// onChange={event => {
					// 	console.log('Ya AutoComplete onChange', event);
					// }}
					// onUpdateInput={event => {
					// 	console.log('Ya AutoComplete onUpdateInput', event);
					// }}
					{...props}
					// onNewRequest={(event, value, item) => {
					// 	console.log('onNewRequest 3',  event, value, item);

				 //  	let {
				 //  		coordinates,
				 //  	} = item;

				 //  	console.log('item');

				 //  	map.setCenter(new google.maps.LatLng(coordinates[0],coordinates[1]));
					// }}
				/>
			}}
		>
	  </YMaps>;
	}
}