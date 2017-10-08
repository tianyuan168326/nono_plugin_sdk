class TokenManager{
    setQiniuToken(_qiniu_token){
        this.qiniu_token =  _qiniu_token
    }
    getQiniuToken(){
        return this.qiniu_token;
    }
}
let _tokenmanager = new TokenManager;
export default _tokenmanager;