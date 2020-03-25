import React, { Component } from 'react';

import Toolbar from './Toolbar';
import Calendar from './Calendar';
import Orders from './Orders';

import '../css/App.css';

export default class OrderCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            host: 'http://localhost:4000',
            calendar: [],
            date: new Date(),
            datelabel: "Today",
            days: 1,
            hour_count: 24,
            start_hour: 2,
            end_hour: 11,
            cellwidth: 140,
            resources: [{"id": "0", "fname": "", "lname": ""},{"id": "0", "fname": "", "lname": ""},{"id": "0", "fname": "", "lname": ""}],
            unscheduled_orders: [{"id": "0", "customerid": "0", "customername": null, "city": null, "detail": null, "scheduled": false}],
            scheduled_orders: [],
            hours: []
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleDateButtonHandler = this.handleDateButtonHandler.bind(this);
        this.handleUtilClick = this.handleUtilClick.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.setCalendar = this.setCalendar.bind(this);

        this.onDragStart = this.onDragStart.bind(this);    
        this.onDragOver = this.onDragOver.bind(this); 
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDropHandlerNew = this.onDropHandlerNew.bind(this);
        this.onResizeStopNew = this.onResizeStopNew.bind(this);
    }

    componentDidMount() {
        fetch(this.state.host + "/resources")
          .then(res => res.json())
          .then(
            (result) => { 
                  this.setState({
                      resources: result
                  });
                  this.fetchSchedules();  
                  this.fetchOrders();   
            },
            (error) => {
                this.setCalendar(); 
            }
          )
      }

      fetchSchedules() {
        fetch(this.state.host + "/schedules")
        .then(res => res.json())
        .then(
          (result) => {
                this.setState({
                    scheduled_orders: result
                });
               this.setCalendar();               
          },
          (error) => {
            console.log(error);
          }
        )
      }

      fetchOrders() {
        fetch(this.state.host + "/orders?status=1")
        .then(res => res.json())
        .then(
          (result) => {
                this.setState({
                    unscheduled_orders: result
                });   
          },
          (error) => {
            console.log(error);
          }
        )
      }

      setSchedule(order) {
          fetch(this.state.host + "/schedules", {
              method: "post",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(order)
          }).then(res => res.json())
            .then(
            (result) => {
                this.fetchSchedules();
            },
            (error) => {
                console.log(error);
            }
        )
      }

      updateSchedule(id,order) {
        fetch(this.state.host + "/schedules/" + id , {
            method: "put",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(order)
        }).then(res => res.json())
          .then(
          (result) => {
              this.fetchSchedules();
          },
          (error) => {
              console.log(error);
          }
      )
    }

      updateOrder(id,order) {
          fetch(this.state.host + "/orders/" + id, {
              method: "put",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(order)
          }).then(res => res.json())
          .then(
          (result) => {
              //console.log(result);
          },
          (error) => {
              console.log(error);
          }
      )
      }

      setCalendar() {
        let resources = this.state.resources;  
        let orders = this.state.scheduled_orders;

        let dailyhours = []; 
        //for (let i = 0; i < this.state.hour_count; i++) {
        for (let i = this.state.start_hour -1; i < this.state.end_hour; i++) {    
            let hobj = {"key": i+"_hour", "value": i+1};
            dailyhours.push(hobj);
        } 

        resources.forEach((window, index) => {
            let windowarray = [];
            window.orders = [];
            orders.forEach(order => {
                if (order.peopleid === Number(window.id)) {
                    if (this.testDate(order.scheduledate)) {
                        window.orders.push(order);
                    }
                }
            })
            //for (let j = 0; j < this.state.hour_count; j++) {
            for (let j = this.state.start_hour -1; j < this.state.end_hour; j++) {
                  let wobj = {"key": (j+index)+"_window", "hour" : (j+1), "resourcekey" : index, "startdate": "", "value": false};
                  for (let m = 0; m < window.orders.length; m++) {
                    if (window.orders[m].starttime === (j+1)) {
                        wobj = {"id": window.orders[m].id, "key": window.orders[m].serviceid, "hour" : (j+1), "resourcekey" : index, 
                        "startdate": window.orders[m].scheduledate, "starttime": window.orders[m].starttime, 
                        "endtime": window.orders[m].endtime, "startminute": window.orders[m].startminute, 
                        "endminute": window.orders[m].endminute, "width": window.orders[m].width, "value": window.orders[m].serviceid
                        };
                    }
                  }      
                windowarray.push(wobj);
             } 
             window.hours = windowarray;
        });
       this.setState({
           calendar: resources,
           hours: dailyhours
       })
   }


   determineDay(date) {
    let currdate = new Date(date).setHours(0,0,0,0);
    let today = new Date().setHours(0,0,0,0); 
    let difference = Math.floor(((today - currdate) / (1000 * 60 * 60)));
    let dlabel = "Today";
    if (difference === 24) {    
        dlabel = "Yesterday";
    } 
    else if (difference > 24 || difference < -24) {
        dlabel = date.toLocaleDateString();
    }
    else if (difference === -24) {
        dlabel = "Tomorrow";
    }
    return dlabel;
   }

   testDate(orderdate) {
       let currentdate = false;
       let odate = new Date(orderdate).setHours(0,0,0,0);
       let today = this.state.date.setHours(0,0,0,0);
       if (odate === today) {
        currentdate = true;
       }
       return currentdate;
   }

   processEndTime(currentwidth, updatewidth) {
       let diff = updatewidth/currentwidth;
       return diff.toFixed(2);
   }


    //event handlers
    handleDateChange = date => {
        let datelabel = this.determineDay(date);
        this.setState({
        date: new Date(date),
        datelabel: datelabel
        }, 
        function() {
            this.setCalendar();
        });
    };

    handleDateButtonHandler = value => {
        var cdate = new Date(this.state.date);

        if (value === 1) {
              cdate.setDate(cdate.getDate() + 1);

        }
        else if (value === -1) {
            cdate.setDate(cdate.getDate() - 1);
        }
        this.handleDateChange(cdate);
    }

    handleUtilClick = () => {
        console.log('util click');
      } 

    handleOrderClick = orderId => {
        console.log(orderId);
    }

    onDragStart = (oEvent, id, type) => {
        //store clientx and clienty of existing order when item is dragged
        if (type === undefined) {
            this.dragorder = {id: id, startX: oEvent.clientX, startY: oEvent.clientY};
        }
        oEvent.target.classList.add('inDrag');
        oEvent.dataTransfer.effectAllowed = "clone";
        oEvent.dataTransfer.setData("id", id);
    }
    
    onDragOver = (oEvent) => {
        oEvent.preventDefault();
    }

    onDragEnd = (oEvent) => {
        oEvent.preventDefault();
        oEvent.target.classList.remove('inDrag');
    }

    onResizeStopNew = (oEvent, oDirection, oRef, oDimensions, order) => {
        let oScheduledOrders = this.state.scheduled_orders,
            oResizeOrder;
        //console.log('onResizeStopNew...........');
            // no change in dragging
        if (oDimensions.width === 0) {
            return;
        }
        //check to see if order is scheduled and update accordingly
        oScheduledOrders.forEach(current_order => {
            if (Number(current_order.id) === Number(order.id))
                oResizeOrder = current_order;
        });
        let updatedwidth, updatedposition, minute = "00";

        updatedwidth = order.width + oDimensions.width;
        if (updatedwidth < 70) {
            return; // at minimum 30 minutes must schedule
        }

        oResizeOrder.endtime = oResizeOrder.starttime + Math.floor(updatedwidth / this.state.cellwidth);

        let mn = updatedwidth % this.state.cellwidth;

        if (mn === 35) {
            oResizeOrder.endminute = '15'
        } else if (mn > 35 && mn <= 70 ) {
            oResizeOrder.endminute = '30'
        } else if (mn > 70 && mn <= 105 ) {
            oResizeOrder.endminute = '45'
        } else {
            oResizeOrder.endminute = '00'
        }

        oResizeOrder.width = updatedwidth;
        //oResizeOrder.minute = minute;
        
        this.updateSchedule(oResizeOrder.id, oResizeOrder);
        this.setCalendar(); //DILIP
    };
    
    
    onDropHandlerNew = (oEvent, oCell) => {
        let todaysDate = new Date();
        let schDate = new Date(this.state.date);
        let minute = "00";
        let hourchange = 0;
        let moveHr = 0;
        let positive = true;

        if (todaysDate.setHours(0, 0, 0, 0) > schDate.setHours(0, 0, 0, 0)) {
            alert("You can't schedule order in the past. Change start date to today or coming days.");
            return;
        }
        let id = oEvent.dataTransfer.getData("id");
        let oResource = this.state.resources[oCell.resourcekey];
        let oOpenOrders = this.state.unscheduled_orders,
            oScheduledOrder, oOpenOrder, oCurrentSchedule;           
        let oScheduledOrders = this.state.scheduled_orders;


        //check to see if order is scheduled and update accordingly
        oScheduledOrders.forEach(order => {
            if (Number(order.serviceid) === Number(id))
                oCurrentSchedule = order;
        });
        
        if (oCurrentSchedule) {
            //get updated clientx and clienty of dragged target
            //also use the x from currentTarget which is the cell in order to calculate the differential because of the location of the mouse click
            if (this.dragorder) {
                let adjustedX = (oEvent.clientX - this.dragorder.startX);
                positive = adjustedX < 0 ? false : true;
                           
                if (positive)
                {

                    let rem = adjustedX % this.state.cellwidth;
                    moveHr = Math.floor(adjustedX / this.state.cellwidth);
                    if (rem != 0 && (rem > 120)) {
                        moveHr = moveHr + 1;
                        rem = 0;
                    }
                    if (rem > 0) {
                        if (rem >= 25 && rem <= 52) {
                            minute = "15";
                        } else if (rem >= 53 && rem <= 87) {
                            minute = "30";
                        } else if (rem >= 88 && rem <= 120) {
                            minute = "45";
                        }
                        
                    }


                    let mn = Number(minute) + Number(oCurrentSchedule.startminute);
                    oCurrentSchedule.starttime = oCurrentSchedule.starttime + moveHr + Math.floor(mn/60);
                    mn = mn % 60;
                    oCurrentSchedule.startminute = mn.toString();
                    mn = Number(minute) + Number(oCurrentSchedule.endminute);
                    oCurrentSchedule.endtime = oCurrentSchedule.endtime + moveHr +  Math.floor(mn/60);
                    mn = mn % 60;
                    oCurrentSchedule.endminute = mn.toString();
                    oCurrentSchedule.peopleid = Number(oResource.id);                    
                    
                } else {
                    
                    //console.log('adjustedX: ' + adjustedX + ' positive: ' + positive); 
                    //console.log('moveHr0: ' + moveHr);
                    let rem = Math.abs(adjustedX % this.state.cellwidth);
                    moveHr = Math.floor(Math.abs(adjustedX) / this.state.cellwidth);
                    //console.log('moveHr1: ' + moveHr);
                    if (rem != 0 && (rem > 120)) {
                        moveHr = moveHr + 1;
                        rem = 0;
                    }
                    //console.log('moveHr2: ' + moveHr);
                    if (rem > 0) {
                        if (rem >= 25 && rem <= 52) {
                            minute = "15";
                        } else if (rem >= 53 && rem <= 87) {
                            minute = "30";
                        } else if (rem >= 88 && rem <= 120) {
                            minute = "45";
                        }
                        //console.log('minute: ' + minute);
                    }                                        
        
                    let mn = Number(oCurrentSchedule.startminute) - Number(minute);
                    if (mn < 0) {
                        oCurrentSchedule.starttime = oCurrentSchedule.starttime - (moveHr + 1);
                    } else {
                        oCurrentSchedule.starttime = oCurrentSchedule.starttime - moveHr;
                    }                    
                    mn = Math.abs(mn);
                    oCurrentSchedule.startminute = mn.toString();

                    mn = Number(oCurrentSchedule.endminute) - Number(minute);
                    if (mn < 0) {
                        oCurrentSchedule.endtime = oCurrentSchedule.endtime - (moveHr + 1);
                    } else {
                        oCurrentSchedule.endtime = oCurrentSchedule.endtime - moveHr;
                    }
                    mn = Math.abs(mn);
                    oCurrentSchedule.endminute = mn.toString();

                    oCurrentSchedule.peopleid = Number(oResource.id);                    
                }
            }

            //let currenthour = oCell.hour + hourchange;
            //oCurrentSchedule.starttime = currenthour;            
            //oCurrentSchedule.startminute = minute;
            //oCurrentSchedule.endminute = minute;            
            //oCurrentSchedule.endtime = currenthour + Math.floor(oCurrentSchedule.width / this.state.cellwidth);
            
            //oCurrentSchedule.peopleid = Number(oResource.id);
        }

        //select current open order to update scheduled status
        oOpenOrders.forEach(order => {
            if (Number(order.id) === Number(id))
                oOpenOrder = order;
        });

        if (oOpenOrder) {
            oOpenOrder.scheduled = true;
            oOpenOrder.status = 2;
        }


        //create new scheduled order to be posted to API   
        if (!oCurrentSchedule)
            oScheduledOrder = {
                "id": this.state.scheduled_orders.length + 1,
                "serviceid": Number(id),
                "peopleid": Number(oResource.id),
                "scheduledate": new Date(this.state.date).toISOString(),
                "starttime": oCell.hour,
                "startminute": "00",
                "endtime": (oCell.hour + 1),
                "endminute": "00",
                "width": 140,
                "status": 1
            }

        if (oOpenOrder) {
            this.updateOrder(id, oOpenOrder);
        }

        if (oCurrentSchedule) {
            this.updateSchedule(oCurrentSchedule.id, oCurrentSchedule);
        }
        if (oScheduledOrder) {
            this.setSchedule(oScheduledOrder);
        }

        this.fetchOrders();
    }

    render() { 
      
        const { calendar, hours, unscheduled_orders, date, datelabel } = this.state;
    
      return (
        <div className="appContainer">
            <Toolbar 
            dateHandler={this.handleDateChange}
            dateButtonHandler={this.handleDateButtonHandler} 
            utilHandler={this.handleUtilClick} 
            currentdate={date}
            datelabel={datelabel} />  
       <div>
            <Calendar 
            currenthours={hours} 
            calendar={calendar}
            dragStartHandler={this.onDragStart} 
            dragEndHandler={this.onDragEnd}
            dragHandler={this.onDragOver} 
            dropHandler={this.onDropHandlerNew}
            resizeHandler={this.onResizeStopNew} />
      </div>
      <div>
            <Orders 
            orders={unscheduled_orders} 
            orderHandler={this.handleOrderClick} 
            dragStartHandler={this.onDragStart} 
            dragEndHandler={this.onDragEnd}
            currentdate={date} />
      </div>
    </div>
      );
    }

}