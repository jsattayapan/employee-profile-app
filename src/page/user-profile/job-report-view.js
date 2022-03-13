import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronCircleRight, faChevronCircleLeft, faArrowUp, faArrowDown,faUsersCog,
  faBuilding, faSave, faCloudSun, faBed,faExclamationTriangle, faCoffee, faUndoAlt,
  faUser, faCalendarAlt, faHome, faTools, faFileInvoiceDollar,faBullhorn, faPencilAlt, faLocationArrow,faChevronDown
 } from '@fortawesome/free-solid-svg-icons'

import { BottomNav } from './index.js'
import Swal from 'sweetalert2'
import ImageResize from 'image-resize';

import { IP,
  getJobs,
  getBuildingsAndProperties,
  getJobsByCreateBy,
  submitNewJob
} from './../../tunnel'
export default class JobReportView extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'list',
      currentMonth: new Date,
      buildingList: [],
      roomList: [],
      jobList: [],
      allJoblList: []
    }
  }

  componentDidMount(){
    getJobs(res => {
      if(res.status){
        console.log(res);
        let jobList = res.jobList
        if(this.props.verify('uywovfl0oxjfgc')){
          jobList = jobList.filter(x => x.createBy.id === this.props.employeeId)
        }
        let result = this.reformatJobList(jobList)
        console.log(result);
        result = result.filter(x => (moment(x.timestamp).isSame(moment(this.state.currentMonth, 'month'))))
        this.setState(() => ({
          jobList: result,
          allJoblList: jobList
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

  reformatJobList = list => {
    let result = []
    list.forEach((job) => {
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

    return result
  }

  monthOnChange = (input) => {
    let {currentMonth, allJoblList} = this.state
    let { employeeId } = this.props
    if(input){
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }else{
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    }

    let result = allJoblList.filter(x => {
      return moment(x.timestamp).isSame(moment(currentMonth), 'month')
    })
    result = this.reformatJobList(result)
    this.setState(() => ({
      currentMonth,
      jobList: result
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
                      if(x.type === 'งานภายในอาคาร' || x.type === 'งานภายในห้องพัก'){
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
    let color = ''
    if(x.status === 'เสร็จ'){
      color = '#95ff6b'
    } else if (x.status === 'กำลังทำ'){
      color = 'orange'
    } else{
      color = 'red'
    }
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className="row">
            <div className="col-6">
              <p><span style={{color}}>[{x.status}]</span> {x.detail}</p>
              {!(x.type === 'งานภายในอาคาร' || x.type === 'งานภายในห้องพัก') && <span style={{fontWeight: '300', color: '#999999'}}><FontAwesomeIcon icon={faLocationArrow} /> {x.location}</span>}
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
    let totalJob = x.jobList.filter(x => x.status !== 'ยกเลิก')
    let completeJob = x.jobList.filter(x => x.status === 'เสร็จ')
    return(
      <tr className="my-3">
        <td style={{background: '#424241'}}>
          <div className='row'>
            <div className="col-6">
              <span style={{fontWeight: '300', color: '#999999'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBuilding } />: {x.buildingName} ({completeJob.length}/{totalJob.length})
              </span>
            </div>
            <div className="col-4">
              {x.propertyName && <span style={{fontWeight: '300', color: '#999999'}}>
                <FontAwesomeIcon
                  size="1x"
                  icon={ faBed } />: {x.propertyName}
              </span>}
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
