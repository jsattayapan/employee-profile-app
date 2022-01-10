import logo from './logo.svg';
import './App.css';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import Swal from 'sweetalert2'
import moment from 'moment'
import validator from 'validator'
import {Bar} from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import numeral from 'numeral'
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import resImage from './icons/restaurant.png'
import breakfastImage from './icons/breakfast.png'
import profitImage from './icons/profits.png'
import UserProfile from './page/user-profile'
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Routes,
  useParams
} from "react-router-dom";


import { IP, getJobList, createNewJob
 } from './tunnel'



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestFrame />} />
          <Route path="/user-profile/:id" element={<UserProfileHook />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}


const UserProfileHook = props => {
  let params = useParams();
  return <UserProfile id={params.id} />
}

const TestFrame = (props) => {

  let totalRestaurant = 30000;
  let totalBreakfast = 10000;

  return (
    <div className="container">
    <h2 className="green-text">Jep's Restaurant</h2>
    <div className="flex-container">
      <div className="flex-1">
        <img src={resImage} width="50px" />
        <br />
        <b className="sm-text">A La Carte</b>
        <br />
        <h3 className="green-text text-right">{numeral(totalRestaurant).format('0,0')}</h3>
      </div>
      <div className="flex-1">
        <img src={breakfastImage} width="50px" />
        <br />
        <b className="sm-text">Breakfast</b>
        <br />
        <h3 className="green-text text-right">{numeral(totalBreakfast).format('0,0')}</h3>
      </div>
      <div className="flex-1">
        <img src={profitImage} width="50px" />
        <br />
        <b className="sm-text">Sale</b>
        <br />
        <h3 className="green-text text-right">{numeral(totalRestaurant + totalBreakfast).format('0,0')}</h3>
      </div>
    </div>
    <br />
    <div className="flex-container">
      <div className="flex-2">
        <b className="sm-text sub-color">จำนวนลูกค้า</b>
        <h3 className="green-text">{numeral(1065).format('0,0')}</h3>
      </div>
      <div className="flex-2">
        <b className="sm-text sub-color">จำนวนโต๊ะ</b>
        <h3 className="green-text">{numeral(315).format('0,0')}</h3>
      </div>
      <div className="flex-2">
        <b className="sm-text sub-color">รายรับต่อคน</b>
        <h3 className="green-text">{numeral(870).format('0,0')}</h3>
      </div>
      <div className="flex-2">
        <b className="sm-text sub-color">คนไทย</b>
        <h3 className="green-text">{numeral(655).format('0,0')}</h3>
      </div>
      <div className="flex-2">
        <b className="sm-text sub-color">คนต่างชาติ</b>
        <h3 className="green-text">{numeral(410).format('0,0')}</h3>
      </div>
    </div>
  </div>
  )
}

class MainFrame extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'job-list',
      jobList: []
    }
  }

  componentDidMount(){
    getJobList(res => {
      if(res.status){
        this.setState(() => ({
          jobList: res.jobList
        }))
      }
    })
  }

  createNewJobBtn = () => {
    this.setState(() => ({
      currentPage: 'create-new-job'
    }))
  }

  changeCurrentPage = page => {
    this.componentDidMount()
    this.setState(() => ({
      currentPage: page
    }))
  }


  render(){

    return (
      <div className="container">
        {
          this.state.currentPage === 'create-new-job' &&
          <CreateNewJobSection
            jobList={this.state.jobList}
            changeCurrentPage={this.changeCurrentPage}
            />
        }
        { this.state.currentPage === 'job-list' && <div className="row">
          <div className="col-12 my-3">
            <button onClick={this.createNewJobBtn} className="btn btn-success">+ Job</button>
          </div>
          <div className="col-12 bg-light">
            <h4>Job List</h4>
          </div>
          <div className="col-12 border">
            {
              this.state.jobList.map(job => (
                <div className="row">
                  <div className="col-6">
                    <p>Detai: {job.detail}</p>
                    <p>Due date: {job.due === null ? 'ไม่ระบุ' : moment(job.due).format('DD/MM/YYYY HH:mm')}</p>
                    <p>Supervisor: {job.supervisor === null ? 'ไม่ระบุ' : job.supervisor}</p>
                  </div>
                  <div className="col-6">
                    <p>Status: {job.status}</p>
                    <p>Create At: {moment(job.createAt).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>}
      </div>
    )
  }
}


class CreateNewJobSection extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      detail: '',
      due: null,
      supervisor: '',
      addSup: false
    }
  }

  textOnChange = (e) => {
    let { value, name } = e.target
    this.setState(() => ({
      [name]: value
    }))
  }

  createNewJob = () => {
    let { detail, due, supervisor } = this.state
    console.log(due);
    if(detail.trim() === ''){
      Swal.fire({
        icon: 'error',
        title: 'กรุณาระบุ detail'
      })
      return
    }
    if(supervisor.trim() === ''){
      supervisor = null
    }
    if(due !== null){
      due = moment(due).format("YYYY-MM-DD HH:mm:ss");
    }
    createNewJob({detail, due, supervisor}, res => {
      if(res.status){
        Swal.fire({
          icon: 'success',
          title: 'ข้อมูลถูกบันทึก'
        })
        this.props.changeCurrentPage('job-list')
      }else{
        Swal.fire({
          icon: 'error',
          title: res.msg
        })
      }
    })
  }

  optionOnChange = (e) => {
    this.setState(() => ({
      supervisor: e.value
    }))
  }

  render(){
    const supervisorOption = this.props.jobList.reduce((options, job) => {
      if(job.supervisor === null){
        return options
      }
      let found = options.filter(opt => opt.value === job.supervisor)
      if(found.length !== 0){
        return options
      }else{
        return [ ...options, {label:job.supervisor, value: job.supervisor}]
      }
    }, [])
    return (
      <div className="row my-2">
      <div className="col-12 my-3">
        <h5>Create new job</h5>
        <label className="label-control">
          Detail:
        </label>
        <input name='detail' value={this.state.detail} onChange={this.textOnChange} className="form-control" />
          <label className="label-control">
            Due:
          </label>
          <DatePicker
          selected={this.state.due}
          onChange={date => {this.setState(() => ({due:date}))}}
          showTimeSelect
          timeIntervals={60}
          timeCaption="Time"
          dateFormat="dd/MM/yyyy HH:mm a"
          timeFormat="HH:mm"
          />
          <label className="label-control">
            Supervisor:
          </label>
          {
            !this.state.addSup ?
            <div className="row my-2">
              <div className="col-8">
                <Select onChange={this.optionOnChange} options={supervisorOption} />
              </div>
              <div className="col-4">
                <button onClick={() => this.setState(() => ({addSup: true}))} className="btn btn-success">+ Sup.</button>
              </div>
            </div>
            :
            <div className="row my-2">
              <div className="col-8">
                <input name='supervisor' value={this.state.supervisor} onChange={this.textOnChange} className="form-control" />
              </div>
              <div className="col-4">
                <button onClick={() => this.setState(() => ({addSup: false}))} className="btn btn-success">Select Sup.</button>
              </div>
            </div>
          }
          <div className='row my-4'>
            <div className="col-6 text-center">
              <button onClick={this.createNewJob} className="btn btn-lg btn-success">Create</button>
            </div>
            <div className="col-6 text-center">
              <button onClick={() => this.props.changeCurrentPage('job-list')} className="btn btn-lg btn-danger">Cancel</button>
            </div>
          </div>
      </div>
    </div>
    )
  }
}

export default App
