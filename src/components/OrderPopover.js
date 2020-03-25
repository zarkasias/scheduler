import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import BusinessIcon from '@material-ui/icons/Business';
import BuildIcon from '@material-ui/icons/Build';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';

import { Resizable } from "re-resizable";

import '../css/popover.css';
import '../css/Chip.css';

export default class OrderPopover extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            popOverAnchor: null,
            menuAnchor: null,
            hour: this.props.hour
        };
    }

    componentDidUpdate(prevProps) {
        let hour = this.state.hour;
        if (prevProps.hour !== this.props.hour) {
            hour = this.props.hour;
        }
       
        if (hour !== this.state.hour) {
          this.setState(prevState => ({
            ...prevState,
            hour: hour
          }))
        }
    
      }

    setPopOverAnchor = event => {
        if (event === null) {
            this.setState({
                popOverAnchor: event,
                menuAnchor: false
            });
        } else {
            this.setState({
                popOverAnchor: event
            });
        }
    }

    setMenuAnchor = event => {
        this.setState({
            menuAnchor: event
        });
    }

    getMinuteFormatted(m) {
        let ret = '' + m;
        if (ret.length === 1) {
            ret = '0' + ret;
        }
        return ret;
    } 

    render() {

        const { hour, popOverAnchor, menuAnchor} = this.state;

        const testDateClass = (date, minute) => {
            var dateClass = "statusButton";
            var odate = new Date(date).setHours(0,0,0,0);
            var today = new Date().setHours(0,0,0,0);
            if (odate < today) {
                dateClass = "statusButton redStatus";
            }
            if (odate > today) {
              dateClass = "statusButton greenStatus";
            }

            switch(minute) {
                case "15":
                    dateClass = dateClass + " minute_15";
                    break;
                case "30":
                    dateClass = dateClass + " minute_30";
                    break;
                case "45":
                    dateClass = dateClass + " minute_45";
                    break;
                default:
                    dateClass = dateClass + " minute_00";            
            }
            return dateClass;
        }

        const formatTime = (time, minute) => {
            if (time < 12) {
                return time + ":" + this.getMinuteFormatted(minute) + " am";
            } else {
                return time + ":" + this.getMinuteFormatted(minute) + " pm";
            }
            
        }

        const handlePopOverClick = event => {
            this.setPopOverAnchor(event.currentTarget);
        };

        const handleMenuClick = event => {
            this.setMenuAnchor(event.currentTarget);
        }
        
        const handlePopOverClose = () => {
           this.setPopOverAnchor(null);
        };

        const handleMenuClose = () => {
            this.setMenuAnchor(null);
        }

        const handleMenuItemClick = item => {
            console.log(item);
            handleMenuClose();
        }

        const addTechnicians = event => {
            console.log('add technicians');
        }



    
          const popOverOpen = Boolean(popOverAnchor);


        return (
            <div>
                <Resizable 
                grid={[35, 35]} 
                snapGap={35} 
                defaultSize={{width: hour.width, height: 36}}
                enable={{top: false, right:true, bottom:false, left: false, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                onResizeStop={(e, direction, ref, d) => this.props.resizeHandler(e, direction, ref, d, hour)}>
                    <Button 
                        variant="contained"
                        className={testDateClass(hour.startdate, hour.startminute)}
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
                    <Menu className="popperMenu" open={Boolean(menuAnchor)} keepMounted anchorEl={menuAnchor} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleMenuItemClick("notify")}> Notify </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick("completed")}> Completed </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick("reschedule")}> Reschedule </MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick("members")}> Team Members </MenuItem>
                    </Menu>   
                      <div className="popOver">
                          <div className="popToolbar">
                            {formatTime(hour.starttime, hour.startminute)} - {formatTime(hour.endtime, hour.endminute)}
                            
                            <div className="utilMenuButton">
                            <Button size="small" onClick={handleMenuClick}>
                                <MoreVertIcon />
                            </Button>
                            </div>
                            
                          </div>
                          <div className="popContent">
                              <div className="popAddress">
                                  123 Rodeo Drive, Dublin, CA
                              </div>
                              <div className="popStatus">
                                  Critical - High
                              </div>
                              <div className="popParameter">
                                  Temperature
                              </div>
                              <div className="popChips">
                              <Chip label="Medium" className="chip yellowchip" variant="default" />
                              <Chip label="repair" className="chip redchip" variant="default" />
                              </div>
                              <div className="workOrderInfo">

                                  <div className="workOrder">
                                      <div className="workIcon">
                                            <BusinessIcon className="iconColor" />
                                      </div>
                                      <div className="workDetails">
                                          <div className="detailTitle">
                                                Customer
                                          </div>
                                          <div className="detailContent">
                                                Silicon Valley Power
                                          </div>
                                      </div>
                                  </div>

                                  <div className="workOrder">
                                      <div className="workIcon">
                                            <BuildIcon className="iconColor" />
                                      </div>
                                      <div className="workDetails">
                                          <div className="detailTitle">
                                                Equipment
                                          </div>
                                          <div className="detailContent">
                                                Multi Eco 22i / NA-MZ-FG-P0002
                                          </div>

                                          <div className="detailTitle">
                                                Notes (for the technician)
                                          </div>
                                          <div className="detailContent">
                                               High Temperature for device verizon_device_2
                                          </div>
                                      </div>
                                  </div>

                                  <div className="workOrder">
                                      <div className="workIcon">
                                            <LocalShippingIcon className="iconColor" />
                                      </div>
                                      <div className="workDetails">
                                          <div className="detailTitle">
                                                Service Request
                                          </div>
                                          <div className="detailContent">
                                                <a href="#">{hour.value}</a>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="technicianLink">
                                  <a href="#" onClick={addTechnicians}>Add Technicians</a>
                              </div>
                          </div>
                     </div>  
                </Popover>
            </div>
        );
    }
}