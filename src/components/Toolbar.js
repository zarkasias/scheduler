import React, { Component } from 'react';

import Picker from './Picker';
import DateRange from './DateRange';

import Button from '@material-ui/core/Button';

import '../css/toolbar.css';

 
export default class Toolbar extends Component {

 
  

  render() {
    return (
      <div className="toolbarContainer">
          <div className="dateLabel">
              Starting Date
          </div>
          <Picker dateHandler={this.props.dateHandler} currentdate={this.props.currentdate} />
          <DateRange datelabel={this.props.datelabel} datebuttonhandler={this.props.dateButtonHandler} />
          
          <div className="utilButton">
            <Button 
                variant="outlined" 
                color="primary"
                onClick={this.props.utilHandler} 
                disableElevation>
                    Utilization
            </Button>
          </div>
          
      </div>
    );
  }
}