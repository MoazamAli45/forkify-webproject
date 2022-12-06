import {async} from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config'; // 10sec importing from config so we can easily change if appliaction update

// console.log(TIMEOUT_SEC)
// couple of function that we reuse again
// return reject promise for number of seconds
// Check if page is loading late
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
// Refactoring both methods as same 
 export const AJAX=async function(url,uploadData=undefined){
 // if upload data exist than first on eotherwise just second in which only url
 try {
  const fetchPro=uploadData?fetch(url,{
    method: 'POST',
    // headers are snippets of data
    headers:{
// we are telling thet data is in json format 
      'Content-type':'application/json'
    },
    //data we want to send
    body:JSON.stringify(uploadData)
   }):fetch(url);
    // it will take two promise
    
    // promise .race promise which will be rejected early fulfill will win the promise
    const res = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      // in data object that  message will print
      throw new Error(`${data.message} (${res.status})`);
      // as async function
      
    }
    return data;// data will become resrved value of promise 
  } catch (err) {
    // console.log(err);
    throw err;  // when promise rejected throw error
  }

  }


/*
export const getJSON = async function (url) {
  try {
    // it will take two promise
    const fetchPro=fetch(url);
    // promise .race promise which will be rejected early fulfill will win the promise
    const res = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      // in data object that  message will print
      throw new Error(`${data.message} (${res.status})`);
      // as async function
      
    }
    return data;// data will become resrved value of promise 
  } catch (err) {
    // console.log(err);
    throw err;  // when promise rejected throw error
  }
};
export const sendJSON = async function (url,uploadData) {
  try {
  // we can send by post 
   const fetchPro=fetch(url,{
    method: 'POST',
    // headers are snippets of data
    headers:{
// we are telling thet data is in json format 
      'Content-type':'application/json'
    },
    //data we want to send
    body:JSON.stringify(uploadData)
   })
    const res = await Promise.race([fetchPro,timeout(TIMEOUT_SEC)]);
    const data = await res.json(); // return the data
    // console.log(data);

    if (!res.ok) {
      // in data object that  message will print
      throw new Error(`${data.message} (${res.status})`);
      // as async function
      
    }
    return data;// data will become resrved value of promise 
  } catch (err) {
    // console.log(err);
    throw err;  // when promise rejected throw error
  }
};
*/