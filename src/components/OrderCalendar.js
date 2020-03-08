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
            days: 1,
            hour_count: 24,
            start_hour: 2,
            end_hour: 11,
            resources: [{"id": "0", "fname": "", "lname": ""},{"id": "0", "fname": "", "lname": ""},{"id": "0", "fname": "", "lname": ""}],
            unscheduled_orders: [{"id": "0", "customerid": "0", "customername": null, "city": null, "detail": null, "scheduled": false}],
            scheduled_orders: [],
            hours: []
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleUtilClick = this.handleUtilClick.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.setCalendar = this.setCalendar.bind(this);

        this.onDragStart = this.onDragStart.bind(this);    
        this.onDragOver = this.onDragOver.bind(this); 
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDropHandler = this.onDropHandler.bind(this);
        this.onResizeStop = this.onResizeStop.bind(this);
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
                        wobj = {"id": window.orders[m].id, "key": (j+index)+"_window", "hour" : (j+1), "resourcekey" : index, "startdate": window.orders[m].scheduledate, "starttime": window.orders[m].starttime, "endtime": window.orders[m].endtime, "width": window.orders[m].width, "value": window.orders[m].serviceid};
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

   testDate(orderdate) {
       let currentdate = false;
       let odate = new Date(orderdate).setHours(0,0,0,0);
       let today = this.state.date.setHours(0,0,0,0);
       if (odate === today) {
        currentdate = true;
       }
       return currentdate;
   }


    //event handlers
    handleDateChange = date => {
        this.setState({
        date: new Date(date)
        }, 
        function() {
            this.setCalendar();
        });
    };

    handleUtilClick = () => {
        console.log('util click');
      } 

    handleOrderClick = orderId => {
        console.log(orderId);
    }

    onDragStart = (oEvent, id) => {
        oEvent.target.classList.add('inDrag');
        oEvent.dataTransfer.effectAllowed = "clone";
        oEvent.dataTransfer.setData("id", id);
    }
    
    onDragOver = (oEvent) => {
        oEvent.preventDefault();
    }

    onDragEnd = (oEvent) => {
        oEvent.target.classList.remove('inDrag');
    }

    onResizeStop = (oEvent, oDirection, oRef, oDimensions, order) => {
        const cellwidth = 140;

        let oScheduledOrders = this.state.scheduled_orders, oResizeOrder;
        //check to see if order is scheduled and update accordingly
        oScheduledOrders.forEach(current_order => {
            if (Number(current_order.id) === Number(order.id))
                oResizeOrder = current_order;
        });
       
        let updatedwidth = order.width + oDimensions.width;
        
        let updatedendtime = order.starttime + (Math.floor(updatedwidth/cellwidth) + 1);
        oResizeOrder.width = updatedwidth;
        oResizeOrder.endtime = updatedendtime;
        this.updateSchedule(oResizeOrder.id,oResizeOrder); 
    };
    
    onDropHandler = (oEvent, oCell) => {
        let todaysDate = new Date();
        let schDate = new Date(this.state.date); 

        if (todaysDate.setHours(0,0,0,0) > schDate.setHours(0,0,0,0)) {
            alert ("You can't schedule order in the past. Change start date to today or coming days.");
            return;
        }
        let id = oEvent.dataTransfer.getData("id");
        let oResource = this.state.resources[oCell.resourcekey];
        let oOpenOrders = this.state.unscheduled_orders, oScheduledOrder, oOpenOrder, oCurrentSchedule;
        let oScheduledOrders = this.state.scheduled_orders;


        //check to see if order is scheduled and update accordingly
        oScheduledOrders.forEach(order => {
            if (Number(order.serviceid) === Number(id))
                oCurrentSchedule = order;
        });

        if (oCurrentSchedule) {
            oCurrentSchedule.starttime = oCell.hour;
            oCurrentSchedule.endtime = (oCell.hour + 1);
            oCurrentSchedule.peopleid = Number(oResource.id);
        }
        
        //select current open order to update scheduled status
        oOpenOrders.forEach(order => {
            if(Number(order.id) === Number(id))
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
                "endtime": (oCell.hour + 1),
                "width": 114,
                "status": 1
            }
        
       if (oOpenOrder) {
        this.updateOrder(id,oOpenOrder); 
       }
          
       if (oCurrentSchedule) {
        this.updateSchedule(oCurrentSchedule.id,oCurrentSchedule); 
       }    
       if (oScheduledOrder) {
        this.setSchedule(oScheduledOrder);  
       }
       
       this.fetchOrders();
    }

    render() { 
      
        const { calendar, hours, unscheduled_orders, date } = this.state;
    
      return (
        <div className="appContainer">
            <Toolbar 
            dateHandler={this.handleDateChange} 
            utilHandler={this.handleUtilClick} 
            currentdate={date} />  
       <div>
            <Calendar 
            currenthours={hours} 
            calendar={calendar}
            dragStartHandler={this.onDragStart} 
            dragEndHandler={this.onDragEnd}
            dragHandler={this.onDragOver} 
            dropHandler={this.onDropHandler}
            resizeHandler={this.onResizeStop} />
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