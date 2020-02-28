import React, { Component } from 'react';
 
import { StickyTable, Row, Cell } from 'react-sticky-table';
 
export default class Orders extends Component {
  

  render() {
    return (
      <div className="orderComponentContainer">
        <div style={{width: '100%', height: '25vh'}}>
          <StickyTable leftStickyColumncount={0} borderWidth={0}>
            <Row>
              <Cell>Order #</Cell>
              <Cell>Customer</Cell>
              <Cell>City</Cell>
              <Cell>Detail</Cell>
              <Cell>Status</Cell>
              <Cell>Priority</Cell>
              <Cell>Type</Cell>
              <Cell>Start Date</Cell>
              <Cell>End Date</Cell>
            </Row>
            {this.props.orders.map((order, index) => (
              <Row
                className="draggableRow" 
                key={index + "_order"}
                onDragStart = {(e) => this.props.dragStartHandler(e, order.id)} 
                draggable>
              <Cell className="orderCellStructure"><a className="orderLink" onClick={() => this.props.orderHandler(order.id)} href="#">{order.id}</a></Cell>
              <Cell className="orderCellStructure">{order.customername}</Cell>
              <Cell className="orderCellStructure">{order.city}</Cell>
              <Cell className="orderCellStructure">{order.detail}</Cell>
              <Cell className="orderCellStructure">{!order.scheduled ? "New" : "In Progress"}</Cell>
              <Cell className="orderCellStructure">{order.priority ? order.priority : "Medium"}</Cell>
              <Cell className="orderCellStructure">{order.type ? order.type : "Maintenance"}</Cell>
              <Cell className="orderCellStructure">{order.startdate ? order.startdate : ""}</Cell>
              <Cell className="orderCellStructure">{order.enddate ? order.enddate : ""}</Cell>
            </Row>
            ))}
            
         
          </StickyTable>
        </div>
      </div>
    );
  }
}