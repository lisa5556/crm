$(function(){
    // 获取元素
    let $navBoxList=$(".navBox>a");
    let $itemBoxList=null;
    init ();

    let $plan=$.Callbacks();//用来实现发布订阅
    $plan.add((_,baseInfo)=>{
        // console.log("渲染用户信息和实现退出登录",baseInfo)
        $(".baseBox>span").html(`你好，${baseInfo.name||''}`)

        $(".baseBox>a").click(async function(){
            let result=await axios.get("/user/signout")
            if(result.code ==0){
                window.location.href ="login.html"
                return;
            }
            alert("网路不给力，稍后再试")
        })
    })

   

    $plan.add((power)=>{
        // console.log("渲染菜单",power)
        let str = '';
        if(power.includes("userhandle")){
            str += `
            <div class="itemBox" text="员工管理">
                <h3>
                    <i class="iconfont icon-yuangong"></i>
                    员工管理
                </h3>
                <nav class="item">
                    <a href="page/userList.html" target="iframeBox">员工列表</a>
                    <a href="page/useradd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>
            `
        }
        if(power.includes("departhandle")){
            str += `
            <div class="itemBox" text="部门管理">
                <h3>
                    <i class="iconfont icon-yuangong"></i>
                    部门管理
                </h3>
                <nav class="item">
                    <a href="page/departList.html" target="iframeBox">员工列表</a>
                    <a href="page/departadd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>
            `
        }
        if(power.includes("jobhandle")){
            str += `
            <div class="itemBox" text="职位管理">
                <h3>
                    <i class="iconfont icon-yuangong"></i>
                    职位管理
                </h3>
                <nav class="item">
                    <a href="page/jobList.html" target="iframeBox">员工列表</a>
                    <a href="page/josadd.html" target="iframeBox">新增员工</a>
                </nav>
            </div>
            `
        }
        if(power.includes("customerall")){
            str += `
            <div class="itemBox" text="客户管理">
                <h3>
                    <i class="iconfont icon-kehuguanli"></i>
                    客户管理
                </h3>
                <nav class="item">
                    <a href="page/customerList.html" target="iframeBox">我的客户</a>
                    <a href="page/customerList.html" target="iframeBox">全部客户</a>
                    <a href="page/customeradd.html" target="iframeBox">新增客户</a>
                </nav>
            </div>
            `
        }
        $(".menuBox").html(str)

        $itemBoxList=$(".menuBox").find(".itemBox")
    })

    // 控制组织结构和客户管理点击切换
    function handGroup(index){
        // 分两组
        let $group1=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            return text === "客户管理"
        })
        let $group2=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr("text");
            return /^(员工管理|部门管理|职位管理)/.test(text)
        })
        // 控制那一组显示
        if(index === 0){
            $group1.css("display","block");
            $group2.css("display","none");
        }else if(index === 1){
            $group1.css("display","none");
            $group2.css("display","block");
        }
    }

    // 实现tab选项卡功能
    $plan.add(power=>{
        // 控制默认显示哪一个
        let  initIndex=power.includes("customer") ? 0: 1;
        $navBoxList.eq(initIndex).addClass("active").siblings().removeClass("active");
        handGroup(initIndex)


        // 点击切换
        $navBoxList.click(function(){
            let index=$(this).index();
            let text=$(this).html().trim()

            if((text === "客户管理") && !/customerall/.test(power) ||(text === "组织结构") && !/(userhandle|departhandle|jobhandle)/.test(power)){
                alert("没有权限访问！！！")
                return
            }
            if(index === initIndex) return;


            $(this).addClass("active").siblings().removeClass("active")
            handGroup(index)
            initIndex=index
        })
    })
    // 控制默认的iframe的src
    $plan.add(power=>{
        let url="page/customerList.html"
        if(power.includes("customerall")){
            $(".iframeBox").attr("src",url)
        }
    })

    async function init(){
        let result =await axios.get("/user/login");
        // console.log(result)

        if (result.code != 0){
            alert("你还没有登录，请先登录。。。")
            window.location.href="login.html";
            return;
        }

        // 代表你登录成功了
        let [power,baseInfo]=await axios.all([
            axios.get("/user/power"),
            axios.get("user/info")
        ])
        // console.log(power)
        // console.log(  baseInfo )
        power.code === 0 ? power = power.power :null;
        baseInfo.code ===0?baseInfo = baseInfo.data : null;

        $plan.fire(power,baseInfo)
    }
})