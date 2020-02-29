import React, { Component } from 'react';
 
import { StickyTable, Row, Cell } from 'react-sticky-table';

import OrderPopover from './OrderPopover';

import '../css/table.css';
 
export default class Calendar extends Component {

 
    
 render() {

    return (
      <div className="componentContainer">
        <div style={{width: '100%', height: '55vh'}}>
          <StickyTable>
            <Row>
              <Cell className="resourceHeader">Resource</Cell>
               {this.props.currenthours.map(time => (
                <Cell className="tableHeader" id={time.key}>
                    {time.value}
                </Cell>
               ))} 
            </Row>
            {this.props.calendar.map(row => (
                <Row key={row.id}>
                    <Cell className="cellStructure">{row.fname} {row.lname}</Cell>
                    {row.hours.map(hour => (
                        (!hour.value
                        ? <Cell 
                            key={hour.key} 
                            onDragOver={(e) => this.props.dragHandler(e)}
                            onDrop={(e) => this.props.dropHandler(e, hour)} 
                            className="cellStructure dataCell">
                                {hour.value}
                            </Cell>
                        : <Cell 
                            key={hour.key} 
                            className="cellStructure dataCell">
                                {/* <Button 
                                  variant="contained"
                                  className={testDateClass(hour.startdate)}
                                  fullWidth={true}
                                  disableRipple={true}
                                  disableElevation>
                                      {hour.value}
                              </Button> */}
                              <OrderPopover hour={hour} />
                            </Cell>   
                        )
                        
                    ))}
                </Row>
            ))}
          </StickyTable>
        </div>
      </div>
    );
  }
}