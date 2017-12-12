import React, {Component} from 'react';

// import customPropTypes from 'material-ui/utils/customPropTypes';
// import { withStyles, createStyleSheet } from 'material-ui/styles';

import TextField from 'material-ui/TextField'; 


const defaultProps = {}

// var classes;

// const styleSheet = createStyleSheet('FormControlInternal', (theme) => ({
// 	root: {

// 	},
// }));

export default class FormControl extends Component{

	constructor(props){

		super(props);

		this.state = {}
	}

	componentWillMount(){

    // classes = this.context.styleManager.render(styleSheet);
	}

	componentDidMount(){

	}

  componentDidUpdate(){

    if(this.props.debug){
      console.log("FormControl componentDidUpdate", this);
    }
  }

	render(){

		const {component} = this.props;

		return <TextField 
			{...this.props}
			InputProps={{
				component:(props) => {return this.props.children},
			}}
			children={null}
			> 
		</TextField>;
	}
}

FormControl.defaultProps = defaultProps;

// FormControl.contextTypes = {
//   styleManager: customPropTypes.muiRequired,
// };
