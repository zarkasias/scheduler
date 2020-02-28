import React, { Component } from 'react';

import DatePicker from 'react-datepicker';
import DateRangeIcon from '@material-ui/icons/DateRange';

import "react-datepicker/dist/react-datepicker.css";
import '../css/picker.css';

export default class Picker extends Component {

    
    render() { 
      
      const PickerInput = ({ value, onClick }) => (
        <button className="picker-input" onClick={onClick}>
          {value}
          <DateRangeIcon style={{ marginLeft: '3px', color: '#999' }} />
        </button>
      );

    return (

        <DatePicker 
            selected={this.props.currentdate} 
            onChange={this.props.dateHandler}
            customInput={<PickerInput />} />
    );
  }
}