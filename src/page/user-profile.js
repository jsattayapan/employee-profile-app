import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import  { Navigate } from 'react-router-dom'
import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt
 } from '@fortawesome/free-solid-svg-icons'
import { IP,
  getEmployeeProfileByLineId,
  updatePhoneByUserId
 } from './../tunnel'



export default class UserProfile extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      page: 'main',
      name: '',
      id: '',
      imageUrl: 'person.png',
      department: '',
      role: '',
      phone: '',
      startJob: '',
      workingTimeText: ''
    }
  }

  componentDidMount(){
    getEmployeeProfileByLineId({id: this.props.id}, res => {
      if(res.status){
        this.setState(() => (res.employee))
      }else{
        // window.location.replace("http://192.168.100.32:3000/");
        Swal.fire({
          'title': res.msg,
          'icon': 'danger',
          color: 'white',
          background: '#333',
          confirmButtonText: 'ปิด',
        })
      }
    })
  }

  changePage = page => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState(() => ({
      page
    }))
  }

  render(){
    return (
      <div className="container-fluid user-profile-container pt-4">
        {
          this.state.page === 'main' &&
        <div className="col-12">
          <div className="row">
            <div className="col-12">
              <div className="profile-block">
                <div className="block-item">
                  <img id="profile-image" src={`${IP}/public/employee/${this.state.imageUrl !== null ? this.state.imageUrl : 'person.png'}`} width="60px" height="60px" />
                </div>
                <div className="block-item name-info">
                  <p id="name">{this.state.name}</p>
                  <p>ID: {this.state.id}</p>
                </div>
                <div className="block-item">
                  <div onClick={() => this.changePage('profile')} className="profile-btn">
                    ดูข้อมูลส่วนตัว
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12">
              <div className="circle-head">
                <p>เวลาสะสม</p>
                <p>{this.state.workingTimeText}</p>
                <p id="lastest-update-time"><FontAwesomeIcon icon={faUndoAlt} /> {moment().format('hh:mm A')}</p>
              </div>
            </div>
          </div>
          <div className="main-menu mt-4">
            <div onClick={() => this.changePage('timetable')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faCalendarAlt} />
              <p class="menu-item-sub">ตารางาน</p>
            </div>
            <div onClick={() => this.changePage('SalaryView')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faFileInvoiceDollar} />
              <p class="menu-item-sub">สลิปเงินเดือน</p>
            </div>
            <div onClick={() => this.changePage('jobReport')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faTools} />
              <p class="menu-item-sub">แจ้งซ่อม</p>
            </div>
          </div>
          <div className="main-menu mt-4">
            <div className="menu-item">
            </div>
            <div onClick={() => this.changePage('problemReport')} className="menu-item">
              <FontAwesomeIcon size="2x" icon={faExclamationTriangle} />
              <p class="menu-item-sub">แจ้งปัญหา</p>
            </div>
            <div className="menu-item">
              <FontAwesomeIcon size="2x" icon={faBullhorn} />
              <p class="menu-item-sub">ข่าวสาร</p>
            </div>
          </div>
          <div style={{height:'180px', width: '50px'}}>

          </div>
        </div>
        }
        {
          this.state.page === 'profile' && <ProfileView
          id={this.state.id}
          name={this.state.name}
          phone={this.state.phone}
          imageUrl={this.state.imageUrl}
          department={this.state.department}
          role={this.state.role}
          startJob={this.state.startJob}
          changePage={this.changePage} />

        }
        {
          this.state.page === 'timetable' && <TimetableView changePage={this.changePage} />

        }
        {
          this.state.page === 'SalaryView' && <SalaryView changePage={this.changePage} />
        }
        {
          this.state.page === 'jobReport' && <JobReportView changePage={this.changePage} />
        }
        {
          this.state.page === 'problemReport' && <ProblemReportView changePage={this.changePage} />
        }
      </div>
    )
  }

}

const BottomNav = props => (
  <nav className="navbar fixed-bottom navbar-dark bg-dark justify-content-around text-center">
    {
      typeof props.icon1 === 'string' ?
      <span style={{color: '#f2c66f'}}>{props.icon1}</span>
      :   <span className="navbar-brand"><FontAwesomeIcon color={props.icon1 === null ? '#212529' : '#fff'} onClick={props.onClick1}  icon={props.icon1} /></span>
    }

    <span className="navbar-brand"><FontAwesomeIcon onClick={props.onClick2} icon={props.icon2} /></span>
  </nav>
)



class ProblemReportView extends React.Component {
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

class JobReportView extends React.Component {
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
        <h3>ประเภท</h3>
        <div className="d-flex flex-row justify-content-between ">
          <div
            onClick={() => this.changeType('fix')}
            style={this.state.type === 'fix'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'fix'? '#333': '#f2c66f'} icon={faTools} />
            <p>ซ่อม/บำรุง</p>
          </div>
          <div
            onClick={() => this.changeType('room')}
            style={this.state.type === 'room'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'room'? '#333': '#f2c66f'} icon={faBed} />
            <p>ห้องพัก</p>
          </div>
          <div
            onClick={() => this.changeType('building')}
            style={this.state.type === 'building'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'building'? '#333': '#f2c66f'} icon={faBuilding} />
            <p>ในอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('outdoor')}
            style={this.state.type === 'outdoor'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'outdoor'? '#333': '#f2c66f'} icon={faCloudSun} />
            <p>นอกอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('install')}
            style={this.state.type === 'install'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'install'? '#333': '#f2c66f'} icon={faUsersCog} />
            <p>ติดตั้ง</p>
          </div>
        </div>
        <h3 className="mt-4">ข้อมูล</h3>

          {
            (this.state.type === 'outdoor' || this.state.type === 'install' || this.state.type === 'fix') &&
            <div className="col-12">
              <div className="d-flex flex-column">
                  <label className="label-control mt-4">รายละเอียดงาน:</label>
                  <input className="form-control mt-3" />
                    <label className="label-control mt-4">สถานที่:</label>
                    <input className="form-control mt-3" />
              </div>
              <div className="profile-block mt-4">+ เพิ่มรูปภาพ</div>
              <div className="d-flex job-image-list mt-4">
                <div className="job-image-container">
                  <div className="delete-image-btn">ลบ
                  </div>
                  <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
                </div>
                <div className="job-image-container">
                  <div className="delete-image-btn">ลบ
                  </div>
                  <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
                </div>
                <div className="job-image-container">
                  <div className="delete-image-btn">ลบ
                  </div>
                  <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
                </div>
                <div className="job-image-container">
                  <div className="delete-image-btn">ลบ
                  </div>
                  <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
                </div>
                <div className="job-image-container">
                  <div className="delete-image-btn">ลบ
                  </div>
                  <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
                </div>
              </div>
              <div style={{height:'100px', width: '50px'}}>

              </div>
            </div>
          }

      {
        this.state.type === 'building' &&
        <div className="col-12">
          <div className="d-flex flex-column">
            <label className="label-control mt-4">เลือกอาคาร</label>
              <select className="form-control mt-3" name="cars" id="cars">
                <option value="volvo">Avatara</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
              </select>
              <label className="label-control mt-4">รายละเอียดงาน:</label>
              <input className="form-control mt-3" />
          </div>
          <div className="profile-block mt-4">+ เพิ่มรูปภาพ</div>
          <div className="d-flex job-image-list mt-4">
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
          </div>
          <div style={{height:'100px', width: '50px'}}>

          </div>
        </div>
      }

      {
        this.state.type === 'room' &&
        <div className="col-12">
          <div className="d-flex flex-column">
            <label className="label-control mt-4">รายละเอียดงาน:</label>
            <input className="form-control mt-3" />
            <label className="label-control mt-4">เลือกห้องพัก</label>
            <div className="room-selection-container">
              <div>
              <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>เสม็ดพาวิลเลี่ยน</u></p>
              <div className="room-selection-building">
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
              </div>
            </div>
              <div>
              <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>Avatara</u></p>
              <div className="room-selection-building">
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
                <div className="room-item">
                  M3002
                </div>
              </div>
              </div>
            </div>
          </div>
          <div className="profile-block mt-4">+ เพิ่มรูปภาพ</div>
          <div className="d-flex job-image-list mt-4">
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
            <div className="job-image-container">
              <div className="delete-image-btn">ลบ
              </div>
              <img className="job-image" src="https://tunit3-samed.ap.ngrok.io/public/employee/BS0001.jpg" height="120px" />
            </div>
          </div>
          <div style={{height:'100px', width: '50px'}}>

          </div>
        </div>
      }
        <BottomNav
          icon1='บันทึก'
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('main')}
           />
      </div>
    )
  }
}


class SalaryView extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){
    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            November
          </span>
          <FontAwesomeIcon size='2x' color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <div className="d-flex flex-column align-items-center mt-4">
          <h1>23,000</h1>
          <p>REMAINING</p>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}}><FontAwesomeIcon size='2x' color="green" icon={faArrowUp} /> เงินได้</th>
              <th style={{textAlign: 'right'}}>23,848.-</th>
            </thead>
            <tbody >
              <tr>
                <td>เงินเดือน:</td>
                <td style={{textAlign: 'right'}}>23,848.-</td>
              </tr>
              <tr>
                <td>คืนค่าน้ำาไฟ (30%):</td>
                <td style={{textAlign: 'right'}}>1,848.-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}} ><FontAwesomeIcon size='2x' color="red" icon={faArrowDown} /> เงินหัก</th>
              <th style={{textAlign: 'right'}}>23,848.-</th>
            </thead>
            <tbody >
              <tr>
                <td>ประกันสังคม:</td>
                <td style={{textAlign: 'right'}}>23,848.-</td>
              </tr>
              <tr>
                <td>ค่าน้ำ:</td>
                <td style={{textAlign: 'right'}}>1,848.-</td>
              </tr>
              <tr>
                <td>ค่าไฟ:</td>
                <td style={{textAlign: 'right'}}>1,848.-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-12 mt-4 text-center">
          <div style={{width: '90%'}} className="profile-block">ดาวน์โหลดสลิป</div>
        </div>
        <div style={{height:'150px', width: '50px'}}>

        </div>
        <BottomNav
          icon1={null}
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('main')}
           />
      </div>
    )
  }
}


class TimetableView extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }

  render(){

    let payload = []
    for(let count = 0; count < 30; count++){
      const result = {
        date: moment().subtract(count, 'days').format('DD/MM/YY'),
        start: '10:00 AM',
        break: '-',
        continue: '-',
        end: '8:00 PM'
      }
      payload = [ ...payload, result ]
    }

    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            November
          </span>
          <FontAwesomeIcon size='2x' color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <p style={{fontSize: '13px', color: 'white'}} className="mt-3">* หากเวลาไม่ถูกต้อง สามารถไปที่ "แจ้งปัญหา"</p>
        <div className="d-flex flex-row justify-content-center">
          <table className="table table-sm text-light timetable">
            <thead>
              <tr style={{color: '#f2c66f'}}>
                <th>วันที่</th>
                <th align="center">เข้า</th>
                <th align="center">พัก</th>
                <th align="center">กลับเข้า</th>
                <th align="center">ออก</th>
              </tr>
            </thead>
            <tbody>
              {
                payload.map(x => (
                  <tr>
                    <td style={{fontSize: '13px', fontWeight: 'bold'}}>{x.date}</td>
                    <td style={{fontSize: '13px'}} align="center">{x.start}</td>
                    <td style={{fontSize: '13px'}} align="center">{x.break}</td>
                    <td style={{fontSize: '13px'}} align="center">{x.continue}</td>
                    <td style={{fontSize: '13px'}} align="center">{x.end}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div style={{height:'100px', width: '50px'}}>

        </div>
        <BottomNav
          icon1={null}
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('main')}
           />
      </div>
    )
  }
}


class ProfileView extends React.Component {
  constructor(props){
    super(props)
    let phone = this.props.phone
    this.state = {
      phone
    }
  }

  editPhone = async () => {
    let phoneInput = await Swal.fire({
      'title': 'เบอร์ติดต่อ',
      'input': 'text',
      color: 'white',
      background: '#333',
      inputPlaceholder: 'required',
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'กลับ',
      showCancelButton: true,
      inputValidator: (value) => new Promise((resolve, reject) => {
        if(value === ''){
          resolve('กรุณาเบอร์ติดต่อ')
        }else{
          resolve()
        }
      })
    })
    if(phoneInput.isConfirmed){
      updatePhoneByUserId({id: this.props.id, phone: phoneInput.value}, res => {
        if(res.status){
          Swal.fire({
            'title': 'เบอร์ติดต่อของคุณได้เปลี่ยนแล้ว',
            'icon': 'success',
            color: 'white',
            background: '#333',
            confirmButtonText: 'ปิด',
          })
          this.setState(() => ({
            phone: phoneInput.value
          }))
        }else{
          Swal.fire({
            'title': res.msg,
            'icon': 'success',
            color: 'white',
            background: '#333',
            confirmButtonText: 'ปิด',
          })
        }
      })
    }
  }

  render(){
    moment(this.props.startJob, 'DD/MM/YYYY')
    var start = moment(this.props.startJob, 'DD/MM/YYYY');
    var end = moment()

    var years = end.diff(start, 'year');
    start.add(years, 'years');

    var months = end.diff(start, 'months');
    start.add(months, 'months');

    var days = end.diff(start, 'days');
    let workSince = years + ' years ' + months + ' months ' + days + ' days'
    return (
      <div className="row px-3">
        <div className="mt-4 d-flex flex-column justify-content-center align-items-center">
          <img id="profile-image" src={`${IP}/public/employee/${this.props.imageUrl !== null ? this.props.imageUrl : 'person.png'}`} width="120px" height="120px" />
          <h5 className="mt-2">{this.props.name}</h5>
          <span className="mt-2" style={{ fontWeight: 'bold', background: '#f2c66f',color: 'black', padding: '5px 10px', borderRadius: '5px' }}>{this.props.id}</span>
        </div>
        <div className="d-flex justify-content-center">
          <table style={{width: '80%'}} className="">
            <tbody>
              <tr>
                <td className="pro-title">Phone:</td>
                <td className="pro-value">{this.state.phone} <FontAwesomeIcon onClick={this.editPhone} color="grey" icon={faPencilAlt} /></td>
              </tr>
              <tr>
                <td className="pro-title">DOB:</td>
                <td className="pro-value">Nov 22</td>
              </tr>
              <tr>
                <td className="pro-title">Employee Since:</td>
                <td className="pro-value">{workSince}</td>
              </tr>
              <tr>
                <td className="pro-title">Department:</td>
                <td className="pro-value">{this.props.department}</td>
              </tr>
              <tr>
                <td className="pro-title">Position:</td>
                <td className="pro-value">{this.props.role}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{height:'200px', width: '50px'}}>

        </div>
        <BottomNav
          icon1={null}
          icon2={faUndoAlt}
          onClick1={faHome}
          onClick2={() => this.props.changePage('main')}
           />
      </div>
    )
  }
}