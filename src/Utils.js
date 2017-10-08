import tokenManager from "./TokenManager"
import axios from "axios"
export default class NONoPluginUtils{
      /**
       * 
       * @param {*File} file :binary file to upload
       */
      static uploadFile(file){
        return new Promise((resolve,reject)=>{
          const qiniuToken = tokenManager.getQiniuToken();
          if(!qiniuToken){
            reject({message:"upload token is invalid"})
          }

          let newFormData = new FormData();
          newFormData.append("file",file);
          newFormData.append("token",qiniuToken);
          axios.post('http://upload.qiniu.com/', newFormData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(({status,data})=>{
            if(status !=200){
              reject({message:"upload error:"+JSON.stringify(data)})
            }
            resolve({fileUrl:"http://7xrcdn.com1.z0.glb.clouddn.com/"+data.key})
          }).catch((err)=>{
            reject({message:"request image upload service error!"+JSON.stringify(err)})
          })
        })
      
      }
      static  uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
            v = c == 'x'
              ? r
              : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
    }