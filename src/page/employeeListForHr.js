import React from 'react'
import Select from 'react-select'
import validator from 'validator';
import numeral from 'numeral'

import { IP,
  getEmployeeListForHr
 } from './../tunnel'

export default class EmployeeListForHr extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      employeeList: []
    }
  }

  componentDidMount(){
    getEmployeeListForHr(res => {
      console.log(res);
    })
  }

  render(){
    return(
      <div className="container">
      </div>
    )
  }
}
