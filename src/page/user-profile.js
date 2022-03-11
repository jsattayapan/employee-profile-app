import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'
import ImageResize from 'image-resize';
import  { Navigate } from 'react-router-dom'
import numeral from 'numeral'
import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'
import { IP,
  getEmployeeProfileByLineId,
  updatePhoneByUserId,
  getMonthlyTimeScanByEmployeeId,
  getEmployeeAccountById,
  showPrintReceipt,
  getBuildingsAndProperties,
  submitNewJob,
  getJobsByCreateBy,
  getJobs
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
          this.state.page === 'timetable' && <TimetableView employeeId={this.state.id} changePage={this.changePage} />

        }
        {
          this.state.page === 'SalaryView' && <SalaryView changePage={this.changePage} employeeId={this.state.id} />
        }
        {
          this.state.page === 'jobReport' && <JobReportView employeeId={this.state.id} changePage={this.changePage} />
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
      <span onClick={props.onClick1} style={{color: '#f2c66f'}}>{props.icon1}</span>
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
      currentPage: 'list',
      currentMonth: new Date,
      buildingList: [],
      roomList: [],
      jobList: []
    }
  }

  componentDidMount(){

    getJobs(res => {
      if(res.status){
        console.log(res);
        let result = []
        res.jobList.forEach((job) => {
          if(job.type === 'งานภายในห้องพัก'){
            let found = result.filter(x => (x.propertyId === job.propertyId && x.type === 'งานภายในห้องพัก' ))
            if(found.length !== 0){
              let oldJob = found[0]
              let oldList = oldJob.jobList
              let payload = {
                ...oldJob, jobList: [job, oldList]
              }
              let noneLeft = result.filter(x => !(x.propertyId === job.propertyId && x.type === 'งานภายในห้องพัก' ))
              result = [ ...noneLeft, payload]
            } else {
              result = [ ...result, {
                propertyId: job.propertyId,
                buildingName: job.building.name,
                propertyName: job.property.name,
                type: job.type,
                jobList: [job]
              }]
            }
          } else if(job.type === 'งานภายในอาคาร'){
            let found = result.filter(x => (x.buildingId === job.buildingId && x.type === 'งานภายในอาคาร' ))
            if(found.length !== 0){
              let oldJob = found[0]
              let oldList = oldJob.jobList
              let payload = {
                ...oldJob, jobList: [job, oldList]
              }
              let noneLeft = result.filter(x => !(x.buildingId === job.buildingId && x.type === 'งานภายในอาคาร' ))
              result = [ ...noneLeft, payload]
            } else {
              result = [ ...result, {
                buildingId: job.buildingId,
                buildingName: job.building.name,
                type: job.type,
                jobList: [job]
              }]
            }
          } else {
            result = [ ...result, job ]
          }

        });
        console.log(result);
        this.setState(() => ({
          jobList: result
        }))
      }
    })
    getBuildingsAndProperties(res => {
      if(res.status){
        this.setState(() => ({
          roomList: res.propertyList,
          buildingList: res.buildingList,
          buildingId: res.buildingList[0].id
        }))
      }
    })
  }

  monthOnChange = (input) => {
    let {currentMonth} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }
    this.setState(() => ({
      currentMonth
    }))
  }

  changePage = page => {this.setState(() => ({currentPage: page}))}

  render(){
    let  { currentPage } = this.state
    return (
      currentPage !== 'createNewJob' ?
      <div className="row">
        <div className="col-6">
          <h3>รายงานซ่อม</h3>
        </div>
        <div className="col-6">
          <div onClick={() => this.changePage('list')} className={`${currentPage !== 'list' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            List
          </div>
          <div onClick={() => this.changePage('room')} className={`${currentPage !== 'room' ? 'sub-menu-item' : 'sub-menu-item-check'}`}>
            Room
          </div>
        </div>
        {
          currentPage === 'list' &&
          <div>
            <div className="d-flex flex-row justify-content-center mt-4">
              <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
              <span id="month-title">
                {moment(this.state.currentMonth).format('MMMM')}
              </span>
              <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
            </div>
            <div className="d-flex flex-row justify-content-center mt-4">
              <table style={{color: 'white', fontSize: '13px'}} className="table">
                <tbody>
                  {
                    this.state.jobList.map(x => {
                      let htmlCode = ''
                      if(x.type === 'งานภายในอาคาร'){
                       htmlCode =
                        <tr className="my-3">
                          <td style={{background: '#424241'}}>
                            <div className='row'>
                              <div className="col-6">
                                <span style={{fontWeight: '300', color: '#999999'}}>
                                  <FontAwesomeIcon
                                    size="1x"
                                    icon={ faBuilding } /> : {x.buildingName}
                                </span>
                              </div>
                              <div className="col-4">
                              </div>
                              <div className="col-2 text-right">
                                <span style={{fontWeight: '300', color: '#999999'}}>
                                  <FontAwesomeIcon
                                    size="1x"
                                    icon={ faChevronDown } />
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      } else if (x.type === 'งานภายในห้องพัก') {
                        htmlCode =
                         <SubJobList job={x} />
                      } else {
                        htmlCode =
                        <SubJobListDetail job={x} />
                      }
                      return htmlCode

                    })
                  }
                </tbody>
              </table>
            </div>
            <BottomNav
              icon1='รายงานใหม่'
              icon2={faUndoAlt}
              onClick1={() => this.changePage('createNewJob')}
              onClick2={() => this.props.changePage('main')}
               />
          </div>
        }


        {
          currentPage === 'room' &&
          <div>
            <div className="d-flex flex-row justify-content-center mt-4">
            </div>
            <div className="d-flex flex-column mb-3 pb-3">
                {
                  this.state.buildingList.map(x => (
                    <div>
                    <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>{x.name}</u></p>
                    <div className="room-selection-building">
                      {this.state.roomList.filter(y => y.buildingId === x.id).map(room => (
                        <div className="room-item">
                          {room.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  ))
                }
            </div>
            <BottomNav
              icon1='รายงานใหม่'
              icon2={faUndoAlt}
              onClick1={() => this.changePage('createNewJob')}
              onClick2={() => this.props.changePage('main')}
               />
          </div>
        }

      </div>:
      <CreateNewJob
        employeeId={this.props.employeeId} changePage={this.changePage}
         />

    )
  }
}


class SubJobListDetail extends React.Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }
  render(){
    const x = this.props.job
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className="row">
            <div className="col-6">
              <p>[{x.status}] {x.detail}</p>
              <span style={{fontWeight: '300', color: '#999999'}}><FontAwesomeIcon icon={faLocationArrow} /> {x.location}</span>
                {
                  x.workerList.length ?
                  <div className="row mt-2">
                    {
                      x.workerList.map(y => (
                        <div className="col-2">
                          <img style={{verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '50%'}} src={IP + '/public/employee/' + y.imageUrl} />
                        </div>
                      ))
                    }
                  </div> : ''
                }
            </div>
            <div className="col-6">
              {
                x.imageList.length !== 0 &&
                <img style={{width: '140px', height:'140px', objectFit: 'cover'}} className="jobImage" src={IP + '/public/storageJobImages/' + x.imageList[0].filename} />
              }
            </div>
          </div>
          <hr />
          <div className='row'>
            <div className="col-3">
              <span style={{fontWeight: '300', color: '#999999'}}>Type:&nbsp;
                <FontAwesomeIcon
                  size="1x"
                  icon=
                  {
                    x.type === 'งานภายในห้องพัก'? faBed :
                    x.type === 'ซ่อมอุปกรณ์'? faTools :
                    x.type === 'ติดตั้งอุปกรณ์'? faUsersCog :
                    x.type === 'งานภายนอกอาคาร'? faCloudSun : faBuilding
                  } />
              </span>
            </div>
            <div className="col-5">
              <span style={{fontWeight: '300', color: '#999999'}}><FontAwesomeIcon icon={faUser} /> {x.createBy.name !== undefined ? x.createBy.name : x.createBy.first_name}</span>
            </div>
            <div className="col-4">
              <span style={{fontWeight: '300', color: '#999999'}}>{moment(x.timestamp).fromNow()}</span>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}

class SubJobList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      showList: false
    }
  }

  showListOnClick = () => {
    this.setState(() => ({
      showList: !this.state.showList
    }))
  }

  render(){
    const x = this.props.job
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className='row'>
            <div className="col-6">
              <span style={{fontWeight: '300', color: '#999999'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBuilding } />: {x.buildingName}
              </span>
            </div>
            <div className="col-4">
              <span style={{fontWeight: '300', color: '#999999'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBed } />: {x.propertyName}
              </span>
            </div>
            <div className="col-2 text-right">
              <span onClick={this.showListOnClick} style={{fontWeight: '300', color: '#999999'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faChevronDown } />
              </span>
            </div>
            {
              this.state.showList &&
              <div className="col-12">
                <table>
                  {
                    x.jobList.map(x => <SubJobListDetail job={x} />)
                  }
                </table>
              </div>
            }
          </div>
        </td>
      </tr>
    )
  }
}

class CreateNewJob extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type: 'ซ่อมอุปกรณ์',
      roomList: [],
      buildingList: [],
      detail: '',
      location: '',
      buildingId: '',
      selectedRoomList: [],
      imageList: []
    }
  }


  imageOnChange = e => {

    var imageResize = new ImageResize({
      format: 'png',
      width: 500,
      quantity: 1
    });
    let dataURLtoFile = (dataurl, filename) => {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)

      while(n--){
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime})
    }
    let name = e.target.files[0].name
    imageResize.play(URL.createObjectURL(e.target.files[0])).then(res => {
      let file = dataURLtoFile(res,name)
      let imageList = this.state.imageList
      imageList = [ ...imageList, {file, url: URL.createObjectURL(file)}]
      this.setState(() => ({
        imageList
      }))
    })

  }

  componentDidMount(){
    getJobsByCreateBy({id: this.props.employeeId}, res => {
      console.log(res);
    })
    getBuildingsAndProperties(res => {
      if(res.status){
        console.log(res);
        this.setState(() => ({
          roomList: res.propertyList,
          buildingList: res.buildingList,
          buildingId: res.buildingList[0].id
        }))
      }
    })
  }

  changeType = type => {
    this.setState(() => ({
      type,
      detail: '',
      location: '',
      selectedRoomList: [],
      buildingId:  this.state.buildingList[0].id
    }))
  }

  onTextChange = e => {
    let  { name, value } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  roomClick = room => {
    let {selectedRoomList} = this.state
    let found = selectedRoomList.filter(x => x.id ===room. id)
    if(found.length !== 0){
      selectedRoomList = selectedRoomList.filter(x => x.id !== room.id)
    }else{
      selectedRoomList = [ ...selectedRoomList,  room]
    }
    this.setState(() => ({
      selectedRoomList
    }))
  }

  inSelectedRoomList = room => {
    let {selectedRoomList} = this.state
    let found = selectedRoomList.filter(x => x.id ===room. id)
    if(found.length !== 0){
      return true
    }else{
      return false
  }
}


selectBuildingOnChange = e => {
  this.setState(() => ({
    buildingId: e.target.value
  }))
}

removeImage = url => {
  let imageList = this.state.imageList.filter(x => x.url !== url)
  this.setState(() => ({
    imageList
  }))
}


submitNewJob = () => {
  let { imageList, type, detail, location, selectedRoomList, buildingId } = this.state

  if(detail.trim() === ''){
    Swal.fire({
      title: 'กรุณาระบุรายละเอียด',
      icon: 'error'
    })
    return
  }

  if((type === 'งานภายนอกอาคาร' || type === 'ติดตั้งอุปกรณ์' || type === 'ซ่อมอุปกรณ์') && location.trim() === ''){
    Swal.fire({
      title: 'กรุณาใส่สถานที่ที่ทำงาน',
      icon: 'error'
    })
    return
    }

    if(type === 'งานภายในห้องพัก' && selectedRoomList.length === 0){
      Swal.fire({
        title: 'กรุณาเลือกห้องพัก',
        icon: 'error'
      })
      return
    }
    if(type === 'งานภายในอาคาร' && buildingId === ''){
      Swal.fire({
        title: 'กรุณาเลือกอาคาร',
        icon: 'error'
      })
      return
    }


  if( imageList.length === 0){
    submitNewJob({
      type,
      detail,
      location,
      buildingId,
      roomList: selectedRoomList,
      createBy: this.props.user.username
    }, res => {
      if(res.status){
        Swal.fire({
          title: 'ข้อมูลถูกบันทึก',
          icon: 'success'
        })
      }
    })
  }
}


  render(){
    let { detail, location } = this.state
    return(
      <div className='row'>
        <h3>ประเภท</h3>
        <div className="d-flex flex-row justify-content-between ">
          <div
            onClick={() => this.changeType('ซ่อมอุปกรณ์')}
            style={this.state.type === 'ซ่อมอุปกรณ์'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'ซ่อมอุปกรณ์'? '#333': '#f2c66f'} icon={faTools} />
            <p>ซ่อม/บำรุง</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายในห้องพัก')}
            style={this.state.type === 'งานภายในห้องพัก'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายในห้องพัก'? '#333': '#f2c66f'} icon={faBed} />
            <p>ห้องพัก</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายในอาคาร')}
            style={this.state.type === 'งานภายในอาคาร'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายในอาคาร'? '#333': '#f2c66f'} icon={faBuilding} />
            <p>ในอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('งานภายนอกอาคาร')}
            style={this.state.type === 'งานภายนอกอาคาร'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'งานภายนอกอาคาร'? '#333': '#f2c66f'} icon={faCloudSun} />
            <p>นอกอาคาร</p>
          </div>
          <div
            onClick={() => this.changeType('ติดตั้งอุปกรณ์')}
            style={this.state.type === 'ติดตั้งอุปกรณ์'? {background: '#f2c66f', color: '#333'}: {}}
            className="small-box text-center">
            <FontAwesomeIcon size='2x' color={this.state.type === 'install'? '#333': '#f2c66f'} icon={faUsersCog} />
            <p>ติดตั้ง</p>
          </div>
        </div>
        <h3 className="mt-4">ข้อมูล</h3>
          <div className="col-12">
            <div className="d-flex flex-column">
                <label className="label-control mt-4">รายละเอียดงาน:</label>
                <input value={detail} name='detail' onChange={this.onTextChange} className="form-control mt-3" />
            </div>
            {
              (this.state.type === 'งานภายนอกอาคาร' || this.state.type === 'ติดตั้งอุปกรณ์' || this.state.type === 'ซ่อมอุปกรณ์') &&
                <div className="d-flex flex-column">
                  <label className="label-control mt-4">สถานที่:</label>
                  <input value={location} name='location' onChange={this.onTextChange} className="form-control mt-3" />
                </div>
              }

              {
                this.state.type === 'งานภายในอาคาร' &&
                  <div className="d-flex flex-column">
                    <label className="label-control mt-4">เลือกอาคาร</label>
                      <select onChange={this.selectBuildingOnChange} className="form-control mt-3" name="building">
                        {
                          this.state.buildingList.map(x => <option value={x.id}>{x.name}</option>)
                        }
                      </select>
                  </div>
              }

              {
                this.state.type === 'งานภายในห้องพัก' &&
                  <div className="d-flex flex-column">
                    <label className="label-control mt-4">เลือกห้องพัก</label>
                    <div className="room-selection-container">
                      {
                        this.state.buildingList.map(x => (
                          <div>
                          <p className="py-2 pl-2 text-center" style={{color: 'white'}}><u>{x.name}</u></p>
                          <div className="room-selection-building">
                            {this.state.roomList.filter(y => y.buildingId === x.id).map(room => (
                              <div onClick={() => this.roomClick(room)} className={this.inSelectedRoomList(room) ? "room-item-check" :"room-item"}>
                                {room.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        ))
                      }
                    </div>
                  </div>

                }
                <div>
                  <label for="image" className='profile-block mt-3'>ใส่รูป</label>
                  <input id="image" onChange={this.imageOnChange} name="image" placeholder="is" type="file" style={{display: 'none'}} />
                </div>


              <div className="d-flex job-image-list mt-4">
                {
                  this.state.imageList.map(x =>(
                    <div className="job-image-container">
                      <div onClick={() => this.removeImage(x.url)} className="delete-image-btn">ลบ
                      </div>
                      <img className="job-image" src={x.url} height="120px" />
                    </div>
                  ))
                }
              </div>
              <div style={{height:'100px', width: '50px'}}>

              </div>
            </div>

        <BottomNav
          icon1='บันทึก'
          icon2={faUndoAlt}
          onClick1={this.submitNewJob}
          onClick2={() => this.props.changePage('list')}
           />
      </div>
    )
  }
}


class SalaryView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentMonth: new Date(),
      accountList: [],
      receipt: ''
    }
  }

  componentDidMount(){
    getEmployeeAccountById({employeeId: this.props.employeeId, month: this.state.currentMonth}, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          accountList: res.accountList,
          receipt: res.receipt
        }))
      }
    })
  }

  monthOnChange = (input) => {
    let {currentMonth} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }
    getEmployeeAccountById({employeeId, month: currentMonth}, res => {
      console.log(res);
      if(res.status){
        this.setState(() => ({
          accountList: res.accountList,
          receipt: res.receipt,
          currentMonth
        }))
      }
    })
  }

  showPrintReceipt = () => {
    showPrintReceipt({
      month : this.state.currentMonth,
      employeeId: this.props.employeeId
    }, res => {
      if(res.status){
        window.open(res.uri, "_blank");
      }
    })
  }

  render(){
    let {receipt, accountList} = this.state
    //
    let incomeList = accountList.filter(x => x.type === 'เงินได้')
    let outcomeList = accountList.filter(x => x.type === 'เงินหัก')
    let totalIncome = incomeList.reduce((total, x) => total += x.amount , 0)
    let totalOutcome = outcomeList.reduce((total, x) => total += x.amount , 0)
    console.log(totalOutcome);

    if(receipt.earning !== undefined) {
      totalIncome =+ receipt.earning
    }
    if(receipt.socialSecurity !== undefined) {
      totalOutcome = totalOutcome + receipt.socialSecurity
    }
    let remainTotal = totalIncome - totalOutcome
    // receipt.socialSecurity !== undefined && totalOutcome =+ receipt.socialSecurity
    // let incomeList = []
    // let outcomeList = []
    console.log(totalOutcome);


    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            {moment(this.state.currentMonth).format('MMMM')}
          </span>
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <div className="d-flex flex-column align-items-center mt-4">
          { this.state.receipt !== '' ? <h1>{numeral(remainTotal).format('0,0')}.-</h1>: 'N/A'}
          <p>REMAINING</p>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}}><FontAwesomeIcon size='2x' color="green" icon={faArrowUp} /> เงินได้</th>
              <th style={{textAlign: 'right'}}>{numeral(totalIncome).format('0,0')}.-</th>
            </thead>
            <tbody >
              {
                receipt.earning !== undefined && <tr>
                <td>เงินเดือน</td>
                <td style={{textAlign: 'right'}}>{numeral(receipt.earning).format('0,0')}.-</td>
              </tr>
              }
              {
                incomeList.map(x => (
                  <tr>
                    <td>{x.remark}</td>
                    <td style={{textAlign: 'right'}}>{numeral(x.amount).format('0,0')}.-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <table style={{width: '90%'}} className="table table-sm text-light ">
            <thead>
              <th style={{width: '60%'}} ><FontAwesomeIcon size='2x' color="red" icon={faArrowDown} /> เงินหัก</th>
              <th style={{textAlign: 'right'}}>{numeral(totalOutcome).format('0,0')}.-</th>
            </thead>
            <tbody >
              {
                receipt.socialSecurity !== undefined && <tr>
                <td>ประกันสังคม</td>
                <td style={{textAlign: 'right'}}>{numeral(receipt.socialSecurity).format('0,0')}.-</td>
              </tr>
              }
              {
                outcomeList.map(x => (
                  <tr>
                    <td>{x.remark}</td>
                    <td style={{textAlign: 'right'}}>{numeral(x.amount).format('0,0')}.-</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="col-12 mt-4 text-center">
          <button onClick={this.showPrintReceipt} style={{width: '90%'}} className={`${this.state.receipt === '' ? 'profile-block disable' : 'profile-block'}`} disabled={this.state.receipt === ''}>ดาวน์โหลดสลิป</button>
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
      timetableList: [],
      currentMonth: new Date()
    }
  }

  componentDidMount(){
    let { employeeId } = this.props
    let { currentMonth } = this.state
    getMonthlyTimeScanByEmployeeId({employeeId, inputMonth: currentMonth}, res => {
      if(res.status){
        console.log(res.payload);
        this.setState(() => ({
          timetableList: res.payload
        }))
      }
    })
  }

  monthOnChange = (input) => {
    let {currentMonth} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }
    getMonthlyTimeScanByEmployeeId({employeeId, inputMonth: currentMonth}, res => {
      if(res.status){
        console.log(res.payload);
        this.setState(() => ({
          timetableList: res.payload,
          currentMonth
        }))
      }
    })
  }


  render(){

    let {timetableList, currentMonth} = this.state

    return (
      <div className="row">
        <div className="d-flex flex-row justify-content-center mt-4">
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(false)} color="#f2c66f" icon={faChevronCircleLeft} />
          <span id="month-title">
            {moment(currentMonth).format('MMMM')}
          </span>
          <FontAwesomeIcon size='2x' onClick={() => this.monthOnChange(true)} color="#f2c66f" icon={faChevronCircleRight} />
        </div>
        <p style={{fontSize: '13px', color: 'white'}} className="mt-3">* หากเวลาไม่ถูกต้อง สามารถไปที่ "แจ้งปัญหา"</p>
        <div className="d-flex flex-row justify-content-center">
          <table className="table table-sm text-light timetable">
            <thead>
              <tr style={{color: '#f2c66f', width: '40%'}}>
                <th>วันที่</th>
                <th style={{ width: '15%'}} align="center">เข้า</th>
                <th style={{ width: '15%'}} align="center">พัก</th>
                <th style={{ width: '15%'}} align="center">กลับเข้า</th>
                <th style={{ width: '15%'}} align="center">ออก</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.timetableList.map(x => {
                  return (
                    <tr style={{borderBottom: '1px solid white'}}>
                      <td className="align-middle" style={{fontSize: '13px', fontWeight: '', width: '40%'}}>{x.date}<br />
                      <span style={{color: '#919191'}}>
                        {
                          x.timetable !== undefined ?
                          x.timetable.breakTime !== null ?
                          `${moment(x.timetable.startTime).format('HH:mm')} - ${moment(x.timetable.breakTime).format('HH:mm')}, ${moment(x.timetable.continueTime).format('HH:mm')} - ${moment(x.timetable.endTime).format('HH:mm')}`
                          :
                          `${moment(x.timetable.startTime).format('HH:mm')} - ${moment(x.timetable.endTime).format('HH:mm')}`
                          :
                          ''
                        }</span>
                      </td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.start !== undefined ? x.start.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.break !== undefined ? x.break.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.continue !== undefined ? x.continue.time : '-' }</td>
                      <td className="align-middle" style={{fontSize: '13px', width: '15%'}} align="center">{x.end !== undefined ? x.end.time : '-' }</td>
                    </tr>
                  )
                }
                )
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
                <td className="pro-value">{this.props.dob}</td>
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
