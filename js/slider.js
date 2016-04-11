// 封装函数
(function(){
	// 选取节点
	var slider= getElementsByClassName(document,"g-slider m-slider")[0];
	var banner= getElementsByClassName(slider,"banner");
	var index= slider.getElementsByTagName("li"); 
	// 设置切换目标参数
	var i= 1;
	// 计时器参数
	var during= 500;
	var intrvl= 20;
	var count= Math.floor(during/intrvl);
	var offset= 1/count;
	var wait;
	var fadein;

	// 等待5s函数
	function bannerwait(){
		// 5s等待
		wait= setTimeout(bannerin,5000);
	}

	// 淡入函数
	function bannerin(){
		// 判断是否hover
		if(flag){
			bannerwait();
		}else{
		// 淡入前 状态初始化
			i=i%3;
			banner[i].className +=" block";
			banner[(i+1)%3].className= banner[(i+1)%3].className.replace(" block","");
			banner[(i+2)%3].className= banner[(i+2)%3].className.replace(" block","");
			banner[i].style.opacity= 0;
			index[i].className += "currer";
			index[(i+1)%3].className= index[(i+1)%3].className.replace("currer","");
			index[(i+2)%3].className= index[(i+2)%3].className.replace("currer","");
		// 单步淡入动画
			function step(){
				if(parseFloat(banner[i].style.opacity)+offset<1){
					banner[i].style.opacity= parseFloat(banner[i].style.opacity)+offset;
				}else{
					banner[i].style.opacity= 1;
					clearInterval(fadein);
					i++;
					bannerwait();
				}
			}
			fadein= setInterval(step,intrvl);
		}
	}

	// 注册hover事件
	var flag= false;
	for(var j=0;j<3;j++){
		addEvent(banner[j],"mouseenter",function(){
			flag= true;
		});
		addEvent(banner[j],"mouseleave",function(){
			flag= false;
		});
	};

	// 注册click事件
	for(var j=0;j<3;j++){
		addEvent(index[j],"click",function(event){
			clearTimeout(wait);
			clearInterval(fadein);
			event= event || window.event;
			var tag = event.target || event.srcElement;
			i= parseInt(tag.innerText || tag.textContent);
			bannerin();
		});
	};

	// 开始轮播
	bannerwait();
})();