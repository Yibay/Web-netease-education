// 封装函数
(function(){
	// 获取最热课程列表数据
	var xhr= createXHR();
	xhr.onreadystatechange= function(){
		if(xhr.readyState == 4){
			if((xhr.status >= 200 && xhr.status < 300 )|| xhr.status == 304){
				inhot(JSON.parse(xhr.responseText));
			}else{
				alert("Request was unsucessful:" + xhr.status);
			}
		}
	};
	xhr.open("get","http://study.163.com/webDev/hotcouresByCategory.htm",true);
	xhr.send(null);
	// 处理返回函数
	function inhot(obj){
		var m_aside= document.getElementById("m-aside");
		var hotcourse= getElementsByClassName(m_aside,"hotcourse")[0];
		var i;
		var flag= false;
		for(i=0;i<10 && i<obj.length;i++){
			var box= document.createElement("div");
			var html= '<img class="img" src="'+ obj[i].smallPhotoUrl +'">\
				<h3 class="name">'+ obj[i].name +'<h3>\
				<div class="count">'+ obj[i].learnerCount +'</div>';
			box.innerHTML= html;
			box.className= "box";
			hotcourse.appendChild(box);
		}
		flag= true;
		if(flag){
			function step(){
				hotcourse.removeChild(firstElementChild(hotcourse));
				var box= document.createElement("div");
				var html= '<img class="img" src="'+ obj[i].smallPhotoUrl +'">\
					<h3 class="name">'+ obj[i].name +'<h3>\
					<div class="count">'+ obj[i].learnerCount +'</div>';
				box.innerHTML= html;
				box.className= "box";
				hotcourse.appendChild(box);
				i++;
				i=i%20;
			}
			setInterval(step,5000);
		}
	}
})();