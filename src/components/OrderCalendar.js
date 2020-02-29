import React, { Component } from 'react';

import Toolbar from './Toolbar';
import Calendar from './Calendar';
import Orders from './Orders';

import '../css/App.css';

export default class OrderCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            host: 'http://localhost:3000',
            calendar: [],
            date: new Date(),
            days: 1,
            hour_count: 24,
            resources: [],
            unscheduled_orders: [],
            scheduled_orders: [],
            hours: []
        };
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleUtilClick = this.handleUtilClick.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.setCalendar = this.setCalendar.bind(this);

        this.onDragStart = this.onDragStart.bind(this);    
        this.onDragOver = this.onDragOver.bind(this); 
        this.onDropHandler = this.onDropHandler.bind(this);
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
              console.log(error);
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
        fetch(this.state.host + "/orders")
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

      updateOrder(id,order) {
          fetch(this.state.host + "/orders/" + id, {
              method: "put",
              headers: {'Content-Type':'application/json'},
              body: JSON.stringify(order)
          }).then(res => res.json())
          .then(
          (result) => {
              console.log(result);
          },
          (error) => {
              console.log(error);
          }
      )
      }

      setCalendar() {
        var resources = this.state.resources;  
        var orders = this.state.scheduled_orders;

        var dailyhours = []; 
        for (var i = 0; i < this.state.hour_count; i++) {
            var hobj = {"key": i+"_hour", "value": i+1};
            dailyhours.push(hobj);
        } 

        resources.forEach((window, index) => {
            var windowarray = [];
            window.orders = [];
            orders.forEach(order => {
                if (order.peopleid === Number(window.id)) {
                    if (this.testDate(order.scheduledate)) {
                        window.orders.push(order);
                    }
                }
            })
            for (var j = 0; j < this.state.hour_count; j++) {
                  var wobj = {"key": (j+index)+"_window", "hour" : (j+1), "resourcekey" : index, "value": false};
                  for (var m = 0; m < window.orders.length; m++) {
                    if (window.orders[m].starttime === (j+1)) {
                        wobj = {"key": (j+index)+"_window", "hour" : (j+1), "resourcekey" : index, "value": window.orders[m].serviceid};
                 }
                  }      
                windowarray.push(wobj);
             } 
             window.hours = windowarray;
        })

       this.setState({
           calendar: resources,
           hours: dailyhours
       })
   }

   testDate(orderdate) {
       var currentdate = false;
       var odate = new Date(orderdate).setHours(0,0,0,0);
       var today = this.state.date.setHours(0,0,0,0);
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
        oEvent.dataTransfer.setData("id", id);
    }
    
    onDragOver = (oEvent) => {
        oEvent.preventDefault();
    }
    
    onDropHandler = (oEvent, oCell) => {
        var id = oEvent.dataTransfer.getData("id");
        var oResource = this.state.resources[oCell.resourcekey];
        var oOpenOrders = this.state.unscheduled_orders, oOpenOrder;

        //select current open order to update scheduled status
        oOpenOrders.forEach(order => {
            if(Number(order.id) === Number(id))
                oOpenOrder = order;
        });
        oOpenOrder.scheduled = true;

        //create new scheduled order to be posted to API    
        var oScheduledOrder = {
            "id": this.state.scheduled_orders.length + 1,
            "serviceid": Number(id),
            "peopleid": Number(oResource.id),
            "scheduledate": new Date(this.state.date).toISOString(),
            "starttime": oCell.hour,
            "endtime": (oCell.hour + 1),
            "status": 1
            }
       this.updateOrder(id,oOpenOrder);     
       this.setSchedule(oScheduledOrder);  
    }

    render() { 
      
        const { calendar, hours, unscheduled_orders, date } = this.state;
    
      return (
        <div className="appContainer">
            <Toolbar dateHandler={this.handleDateChange} utilHandler={this.handleUtilClick} currentdate={date} />  
       <div>
            <Calendar currenthours={hours} calendar={calendar} dragHandler={this.onDragOver} dropHandler={this.onDropHandler} />
      </div>
      <div>
            <Orders orders={unscheduled_orders} orderHandler={this.handleOrderClick} dragStartHandler={this.onDragStart} currentdate={date} />
      </div>
    </div>
      );
    }

}