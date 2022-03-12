import React from 'react'
import  {
  getPageSettingPermission,
  updatePermission
} from './../tunnel'

export default class PageSetting extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pageList: [],
      employeeList: []
    }
  }

  componentDidMount(){
    getPageSettingPermission(res => {
      if(res.status){
        this.setState(() => ({
          pageList: res.page,
          employeeList: res.empList
        }));
      }
    })

  }

  updatePermission = (employeeId, pageId) => {
    updatePermission({employeeId, pageId}, res => {
      if(res.status){
        this.componentDidMount()
      }else{
        alert(res.msg)
      }
    })
  }

  render(){
    let {pageList, employeeList} = this.state
    return(
      <div className="col-12">
        <table className="table">
          <thead>
            <tr>
              <th>Name\Page</th>
              {pageList.map(page => <th>{page.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {
              employeeList.map(emp =>
                <tr>
                  <td>[{emp.id}] {emp.name}</td>
                  {pageList.map(page => {
                    let found = emp.pagePermission.filter(x => x.pageId === page.id)
                    return found.length === 0 ?
                    <td><button onClick={() => this.updatePermission(emp.id, page.id)} className="btn btn-sm btn-danger">OFF</button></td> :
                    <td><button onClick={() => this.updatePermission(emp.id, page.id)} className="btn btn-sm btn-success">ON</button></td>
                  })}
                </tr>
              )
            }
          </tbody>
        </table>

      </div>
    )
  }
}
