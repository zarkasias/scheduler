import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

export default class DateRange extends Component {
    render() {
        return (
          <div className="rangeToolContainer">
               <Button
                className="rangeButton" 
                color="primary"
                onClick={() => this.props.datebuttonhandler(-1)} 
                disableElevation>
                     &lt;   
            </Button>
                <div className="dateRangeLabel">
                    {this.props.datelabel}
                </div>
            <Button 
                className="rangeButton" 
                color="primary"
                onClick={() => this.props.datebuttonhandler(1)} 
                disableElevation>
                    &gt;
            </Button>
          </div>
        );
    }
}