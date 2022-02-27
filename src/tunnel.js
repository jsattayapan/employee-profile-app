import axios from 'axios'


export let IP = 'https://tunit3-samed.ap.ngrok.io';

function makePostRequest(route, data, callback){
  axios.post(`${IP}/${route}`, data).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}

function makeGetRequest(route, callback){
  axios.get(`${IP}/${route}`).then(res => {
     callback(res.data)
  }).catch(e => {
    console.log(e);
    callback({status: false, msg: 'ไม่สามารถเชื่อมต่อ Server ได้'})
  })
}




///



export const getItems = (callback) => {
  makeGetRequest('stock/getItems', res => callback(res))
}

/////


export const getNoneRecipeMenuItems = (callback) => {
  makeGetRequest('restaurant/getNoneRecipeMenuItems', res => callback(res))
}


export const deleteIngredientFromRecipe = (data, callback) => {
  makePostRequest('restaurant/deleteIngredientFromRecipe', data, res => callback(res))
}

export const submitIngredientToRecipe = (data, callback) => {
  makePostRequest('restaurant/submitIngredientToRecipe', data, res => callback(res))
}

export const getRecipes = (callback) => {
  makeGetRequest('restaurant/getRecipes', res => callback(res))
}

export const submitNewRecipe = (data, callback) => {
  makePostRequest('restaurant/submitNewRecipe', data, res => callback(res))
}
export const getRecipe = (data, callback) => {
  makePostRequest('restaurant/getRecipe', data, res => callback(res))
}

////


export const updatePhoneByUserId = (data, callback) => {
  makePostRequest('hr/updatePhoneByUserId', data, res => callback(res))
}

export const getEmployeeProfileByLineId = (data, callback) => {
  makePostRequest('hr/getEmployeeProfileByLineId', data, res => callback(res))
}


///////////////////////


export const getJobList = (callback) => {
  makeGetRequest('jobProgress/getJobList', res => callback(res))
}


export const getJobLogById = (data, callback) => {
  makePostRequest('jobProgress/getJobLogById', data, res => callback(res))
}


export const createNewLog = (data, callback) => {
  makePostRequest('jobProgress/createNewLog', data, res => callback(res))
}

export const createNewJob = (data, callback) => {
  makePostRequest('jobProgress/createNewJob', data, res => callback(res))
}

export const updateDueDate = (data, callback) => {
  makePostRequest('jobProgress/updateDueDate', data, res => callback(res))
}

export const updateStatus = (data, callback) => {
  makePostRequest('jobProgress/updateStatus', data, res => callback(res))
}

export const updateSupervisor = (data, callback) => {
  makePostRequest('jobProgress/updateSupervisor', data, res => callback(res))
}