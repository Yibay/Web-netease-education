(function(){
	// 将cookie转化成对象
	function getcookie(cookie){
		var obj= {};
		if(!cookie)return obj;
		var list= cookie.split("; ");
		for(var i=0;i<list.length;i++){
			var cell=list[i].split("=");
			obj[cell[0]]=cell[1];
		}
		return obj;
	}
	// 设置cookie
	function setcookie(name,value,path,domain,expires,secure){
		var cookie =encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if(expires) cookie += "; expires=" + expires.toGMTString();
		if(path) cookie += "; path=" + path;
		if(domain) cookie += "; domain=" + domain;
		if(secure) cookie += "; secure=" + secure;
		document.cookie = cookie;
	}
	// 删除cookie
	function removecookie(name,path,domain){
		document.cookie= name + "=; path=" + path + "; domain=" + domain + "; max-age=0";
	}
	// 对象序列化
	function serialize(obj){
		if(!obj)return "";
		var _array= [];
		for(var name in obj){
			if(!obj.hasOwnProperty(name))continue;
			if(typeof obj[name] === "function")continue;
			var value= encodeURIComponent(obj[name].toString());
			name= encodeURIComponent(name);
			_array.push(name + "=" + value);
		}
		return _array.join("&");
	}

	// click关注事件
	var care= document.querySelector(".g-topnav .m-topnav .care");
	var masklgn= document.querySelector(".g-masklgn");
	var fans= document.querySelector(".g-topnav .m-topnav .fans");
	addEvent(care,"click",checklogin);
	// 验证登录
	function checklogin(){
		var cookie= getcookie(document.cookie);
		if(!cookie.loginSuc){
			masklgn.className = masklgn.className.replace(" none","");
		}else{
			setcare();
		}
	}
	// 设置关注
	function setcare(){
		care.className += " cared";
		care.innerHTML = "已关注<span>取消</span>";
		fans.innerHTML = "粉丝 46";
		setcookie("followSuc",true,"/","");
		removeEvent(care,"click",checklogin);
		var cancel= document.querySelector(".g-topnav .m-topnav .care span");
		addEvent(cancel,"click",cancelcare);
	}
	// 取消关注
	function cancelcare(event){
		event = event || document.event;
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
		var cancel= document.querySelector(".g-topnav .m-topnav .care span");
		removeEvent(cancel,"click",cancelcare);
		care.innerHTML = "关注";
		fans.innerHTML = "粉丝 45";
		removecookie("followSuc","/","");
		care.className = care.className.replace(" cared","");
		addEvent(care,"click",checklogin);
	}
	// 关闭登陆框事件
	var close= document.querySelector(".g-masklgn .login .close");
	addEvent(close,"click",closelogin);
	function closelogin(){
		masklgn.className += " none";
	}
	// 登陆事件
	var submt= document.querySelector(".g-masklgn .login button");
	addEvent(submt,"click",checkuser);
	function checkuser(){
		var name= document.querySelector(".g-masklgn .login .name");
		var password= document.querySelector(".g-masklgn .login .password");
		var obj={};
		obj.userName= md5(name.value);
		obj.password= md5(password.value);
		var path= serialize(obj);
		ajaxcheck(path);
	}
	// 验证用户信息
	function ajaxcheck(path){
		var xhr= createXHR();
		var url="http://study.163.com/webDev/login.htm?"+path;
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if((xhr.status >= 200 && xhr.status <300 ) || xhr.status == 304 ){
					callback(xhr.responseText);
				}else{
					alert("Request was unsucessful: " + xhr.status);
				}
			}
		}
		xhr.open("get",url,true);
		xhr.send(null);
		function callback(num){
			if(Number(num)){
				setcookie("loginSuc",true,"/","");
				closelogin();
				setcare();
			}else{
				alert("账号或密码错误");
			}
		}
	}
	// 关闭通知条
	var closemes= document.querySelector(".g-message .m-message .close");
	var message= document.querySelector(".g-message");
	addEvent(closemes,"click",closemessage);
	function closemessage(){
		message.className += " none";
		setcookie("close",true,"/","")
	}
	// load事件验证cookie
	addEvent(window,"load",loadcheck);
	function loadcheck(){
		var cookie= getcookie(document.cookie);
		if(cookie.close){
			closemessage();
		}
		if(cookie.followSuc){
			setcare();
		}
	}
})();