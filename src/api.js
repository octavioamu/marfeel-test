const graphApi = {
    pathUrl : './data.json',
  
    call: function () {
      let path = `${this.pathUrl}`
      return new Promise((resolve, reject)=> {
        fetch(path).then(res => {
        
          return res.json();
        
        }).then(data=> {
          return resolve(data);
        }).catch(error => {
          return Promise.reject(Error(error.message))
        })
      })
      .catch((err)=> {
        throw new Error (err)
      })
    }
  
  };
  export default graphApi