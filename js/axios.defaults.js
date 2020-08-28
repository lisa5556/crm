// 对axios进行二次封装
axios.defaults.baseURL="http://localhost:8888";

// 数据以表单形式扔给服务器
axios.defaults.headers["Content-Type"]="application/x-www-form-urlencoded";
// 还是以表单形式扔给服务器
axios.defaults.transformRequest=function(data){
    if (!data) return data;
    let result = "";
    for (let attr in data){
        if (!data.hasOwnProperty(attr)) break;
        result += `&${attr}=${data[attr]}`;
    }
    return result.substring(1);
}

// 配置请求拦截器
axios.interceptors.request.use(config => {
    return config
})

// 配置响应拦截器
axios.interceptors.response.use(response => {
    return response.data;
},reason=>{
    // 路径出错，返回404 还有其他错误
    // console.dir(reason)
    if (reason.response){
        switch (String(reason.response.status)){
            case "404":
                alert("当前请求的地址不存在！")
                break;
            default:
                break;
        }
    }

    // 直接创建出一个失败的promise
    return Promise.reject(reason);
        
    }
)