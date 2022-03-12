import React from 'react'
import { BottomNav } from './index.js'

import {faUndoAlt, faHome} from '@fortawesome/free-solid-svg-icons'

export default class ProblemReportView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type: 'fix'
    }
  }

  changeType = type => {
    this.setState(() => ({type}))
  }

  render(){
    return(
      <div className='row'>
        <h3>แจ้งปัญหา</h3>
          <div className="col-12">
            <div className="d-flex flex-column">
              <label className="label-control mt-4">หัวข้อ:</label>
              <input className="form-control mt-3" />
                <label className="label-control mt-4">รายละเอียด:</label>
                <textarea style={{height: '200px'}} className="form-control mt-3"></textarea>
            </div>
          </div>
          <div style={{height:'250px', width: '50px'}}>

          </div>
          <BottomNav
            icon1='ส่ง'
            icon2={faUndoAlt}
            onClick1={faHome}
            onClick2={() => this.props.changePage('main')}
             />
      </div>
    )
  }
}
