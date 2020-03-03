import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

import { Resizable } from "re-resizable";

export default class OrderPopover extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            anchor: null,
            hour: this.props.hour 
        };
    }

    setAnchor = event => {
        this.setState({
            anchor: event
        });
    }

    render() {

        const { hour, anchor } = this.state;

        const testDateClass = date => {
            var dateClass = "statusButton";
            var odate = new Date(date).setHours(0,0,0,0);
            var today = new Date().setHours(0,0,0,0);
            if (odate < today) {
                dateClass = "statusButton redStatus";
            }
            if (odate > today) {
              dateClass = "statusButton greenStatus";
            }
            return dateClass;
        }

        const handleClick = event => {
            this.setAnchor(event.currentTarget);
          };
        
          const handleClose = () => {
            this.setAnchor(null);
          };
        
          const open = Boolean(anchor);

        return (
            <div>
                {/* <Resizable defaultSize={{width: 114, height: 36}}> */}
                    <Button 
                        variant="contained"
                        className={testDateClass(hour.startdate)}
                        fullWidth={true}
                        onClick={handleClick}
                        onDragStart = {(e) => this.props.dragStartHandler(e, hour.value)}
                        onDragEnd = {(e) => this.props.dragEndHandler(e)} 
                        disableRipple={true}
                        disableElevation
                        draggable>
                            {hour.value}
                    </Button>
                {/* </Resizable> */}
                <Popover
                    open={open}
                    anchorEl={anchor}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                    >
                      <div className="popOver">
                      {hour.value}
                     </div>  
                        
                </Popover>
            </div>
        );
    }
}