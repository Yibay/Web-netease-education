// 封装函数
(function(){
	var message= getElementsByClassName(document,"m-message")[0];
	var size = parseInt(message.clientWidth) == 1205 ? 20 : 15;
	// 课程列表请求参数初始化
	var data= {};
	data.pageNo= 1;
	data.psize= size;
	data.type= 10;
	// 添加修改请求参数的事件
	var m_course= document.getElementById("m-course");
	var tab1= getElementsByClassName(m_course,"tab1")[0];
	var tab2= getElementsByClassName(m_course,"tab2")[0];
	var prev= getElementsByClassName(m_course,"prev")[0];
	var next= getElementsByClassName(m_course,"next")[0];
	var num= getElementsByClassName(m_course,"num");
	var index= 1;
		// 清除状态函数
	function clearcur(Array){
		for(var i=0;i<Array.length;i++){
			Array[i].className= Array[i].className.replace(" current","");
		}
	}
	addEvent(tab1,"click",function(event){
		event= event || window.event;
		var target= event.target || event.srcElement;
		clearcur(target.parentNode.children);
		target.className += " current";
		data.type= 10;
		data.pageNo= 1;
		index= data.pageNo;
		outcourse();
		incourse(index);
	});
	addEvent(tab2,"click",function(event){
		event= event || window.event;
		var target= event.target || event.srcElement;
		clearcur(target.parentNode.children);
		target.className += " current";
		data.type= 20;
		data.pageNo= 1;
		index= data.pageNo;
		outcourse();
		incourse(index);
	});
	addEvent(prev,"click",function(){
		data.pageNo--;
		index= data.pageNo;
		outcourse();
		incourse(index);
	});
	addEvent(next,"click",function(){
		data.pageNo++;
		index= data.pageNo;
		outcourse();
		incourse(index);
	});
	for(var i=0;i<num.length;i++){
		addEvent(num[i],"click",function(event){
			event= event || window.event;
			var tag= event.target || event.srcElement;
			data.pageNo= tag.innerText || tag.textContent;
			index= data.pageNo;
			outcourse();
			incourse(index);
		})
	}
	// 因为resize 在FF\IE8中有多次执行的Bug，导致课程列表无法正常显示
	// 所以加入width参数检验width是否真的变化
	var width= message.clientWidth;
	addEvent(window,"resize",function(){
		// 加入了if语句，让后续多次执行失效。
		if(message.clientWidth != width){
			outcourse();
			var sizechange= parseInt(message.clientWidth) == 1205 ? 20 : 15;
			data.psize= sizechange;
			incourse(index);
			width= message.clientWidth;
		}
	});

	// 载入列表
	function incourse(index){

		// 请求参数序列化
		function serialize(data){
			if(!data) return"";
			var pairs= [];
			for (var name in data){
				if(!data.hasOwnProperty(name)) continue;
				if(typeof data[name]=== "function") continue;
				var value= data[name].toString();
				name= encodeURIComponent(name);
				value= encodeURIComponent(value);
				pairs.push(name + "=" + value); 
			}
			return pairs.join("&");
		}

		// 创建XHR对象
		var xhr= createXHR();
		// 监听，并处理返回数据(异步数据不可用全局变量取出，进行对象操作，因为取出执行时，异步数据尚未get；而应该在异步数据监听中，直接用函数处理，这样才能保证在异步数据get后才进行相应操作。)
		xhr.onreadystatechange= function(){
			if(xhr.readyState == 4){
				if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
					createcourse(JSON.parse(xhr.responseText));
				}else{
					alert("Request was unsuccessful: " + xhr.status);
				}
			}
		}
		// 发送请求
		var url= "http://study.163.com/webDev/couresByCategory.htm?" + serialize(data);
		xhr.open("get",url,true);
		xhr.send(null);

		// 处理返回函数: 
		function createcourse(obj){
			if(!obj)return "";
			var course= getElementsByClassName(m_course,"course")[0];
			// 价格显示处理
			var makeprice= function(num){
				if(num== 0)return "免费";
				var intnum= Math.floor(num);
				var floatnum= Math.round((num - intnum)*100)<10 ? "0"+Math.round((num - intnum)*100) : Math.round((num - intnum)*100);
				return "￥"+ intnum + "." + floatnum;
			}
			// 将课程项目插入课程列表中
			for(var i=0;i<obj.list.length;i++){
				var cell= document.createElement("div");
				var text='<img class="img-m" src="'+ obj.list[i].middlePhotoUrl+ '">\
							<div class="name">'+ obj.list[i].name + '</div>\
							<div class="prov">'+ obj.list[i].provider + '</div>\
							<div class="count">'+ obj.list[i].learnerCount + '</div>\
							<div class="price">'+ makeprice(obj.list[i]. price) +'</div>\
							<div class="float">\
								<div class="up">\
									<img class="img-f" src="'+ obj.list[i].middlePhotoUrl +'"/>\
									<div class="right">\
									<div class="name-f">'+ obj.list[i].name +'</div>\
									<div class="count-f">'+ obj.list[i].learnerCount +'人在学</div>\
									<div>发布者：'+ obj.list[i].provider +'</div>\
									<div>分类：'+ obj.list[i].categoryName +'</div>\
									</div>\
								</div>\
								<div class="down">\
									<div class="descrip">'+ obj.list[i].description +'</div>\
								</div>\
							</div>';
				cell.innerHTML= text;
				cell.className= "box";
				course.appendChild(cell);
			}
			// 清除选中样式
			clearcur(num);
			// 检验并修改页数索引
			if(!index) return "";
			var start;
			if(index<5){
				start= 1;
			}else if(index>(obj.pagination.totlePageCount - 3)){
				start= obj.pagination.totlePageCount - 7;
			}else{
				start= index - 4;
			}
			for(var i=0;i<num.length;i++,start++){
				num[i].innerText ? num[i].innerText= start : num[i].textContent= start;
				var text= num[i].innerText || num[i].textContent;
				if(text==index){
					num[i].className += " current";
				}
			}
		}
	}
	// 清除列表
	function outcourse(){
		var clearlist= getElementsByClassName(m_course,"box");
		for(var i=clearlist.length-1;i>0||i==0;i--){
			clearlist[i].parentNode.removeChild(clearlist[i]);
		};
	}

	// 初次载入列表
	incourse(index);

})();