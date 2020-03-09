import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { Resizable } from "re-resizable";

import '../css/popover.css';

export default class OrderPopover extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            popOverAnchor: null,
            popperAnchor: null,
            hour: this.props.hour,
            placement: 'right-start'
        };
    }

    setPopOverAnchor = event => {
        this.setState({
            popOverAnchor: event
        });
    }

    setPopperAnchor = event => {
        let anchor = this.state.popperAnchor === event ? null : event;
        this.setState({
            popperAnchor: anchor
        });
    }

    setPopperAnchorNull = event => {
        this.setState({
            popperAnchor: event
        });
    }

    render() {

        const { hour, popOverAnchor, popperAnchor, placement } = this.state;

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

        const formatTime = time => {
            if (time < 12) {
                return time + ":00 am";
            } else {
                return time + ":00 pm";
            }
            
        }

        const handlePopOverClick = event => {
            this.setPopOverAnchor(event.currentTarget);
          };
        
          const handlePopOverClose = () => {
            this.setPopOverAnchor(null);
          };

          const handlePopperClick = event => {
            this.setPopperAnchor(event.currentTarget);
          };
        
          const handlePopperClose = event => {
            event.preventDefault();  
            this.setPopperAnchorNull(null);
          };
        
          const popOverOpen = Boolean(popOverAnchor);
          const popperOpen = Boolean(popperAnchor);

        return (
            <div>
                <Resizable 
                defaultSize={{width: hour.width, height: 36}}
                enable={{top: false, right:true, bottom:false, left: false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                onResizeStop={(e, direction, ref, d) => this.props.resizeHandler(e, direction, ref, d, hour)}>
                    <Button 
                        variant="contained"
                        className={testDateClass(hour.startdate)}
                        fullWidth={true}
                        onClick={handlePopOverClick}
                        onDragStart = {(e) => this.props.dragStartHandler(e, hour.value)}
                        onDragEnd = {(e) => this.props.dragEndHandler(e)} 
                        disableRipple={true}
                        disableElevation
                        draggable>
                            {hour.value}
                    </Button>
                </Resizable>
                <Popover
                    open={popOverOpen}
                    anchorEl={popOverAnchor}
                    onClose={handlePopOverClose}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    >
                    <Popper open={popperOpen} anchorEl={popperAnchor} placement={placement} transition>
                    <div className="utilityMenu">
                        <button className="linkButton" onClick={handlePopperClose}> Notify </button>
                        <button className="linkButton" onClick={handlePopperClose}> Completed </button>
                        <button className="linkButton" onClick={handlePopperClose}> Reschedule </button>
                        <button className="linkButton" onClick={handlePopperClose}> Team Members </button>
                    </div>
                    </Popper>   
                      <div className="popOver">
                          <div className="popToolbar">
                            {formatTime(hour.starttime)} - {formatTime(hour.endtime)}
                            
                            <div className="utilMenuButton">
                            <Button size="small" onClick={handlePopperClick}>
                                <MoreVertIcon />
                            </Button>
                            </div>
                            
                          </div>
                     </div>  
                </Popover>
            </div>
        );
    }
}