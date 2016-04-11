(function(){
	// 获得节点
	var mask= document.querySelector(".g-mask");
	var video= document.querySelector(".g-mask .video");
	// 调动浮层，播放视频
	var play= document.querySelector(".g-aside .m-movie .movie .play");
	addEvent(play,"click",function(){
		mask.className= mask.className.replace(" none","");
		video.currentTime= 0;
		video.play();
	});
	// 关闭浮层
	var close= document.querySelector(".g-mask .close");
	addEvent(close,"click",function(){
		mask.className += " none";
		video.pause();
	});
	// 播放暂停控件
	var control= document.querySelector(".g-mask .m-control .control");
	var playlogo= document.querySelector(".g-mask .playlogo");
	addEvent(control,"click",playcontrol);
	addEvent(playlogo,"click",playcontrol);
	addEvent(video,"click",playcontrol);
	function playcontrol(){
		if(video.paused){
			video.play();
			control.className= control.className.replace("play","pause");
			playlogo.className += " none";
		}else{
			video.pause();
			control.className= control.className.replace("pause","play");
			playlogo.className= playlogo.className.replace(" none","");
		}
	}
	// 播放进度监控
	var time= document.querySelector(".g-mask .time");
	var buffer= document.querySelector(".g-mask .time .buffered");
	var currenttime= document.querySelector(".g-mask .time .currentTime");
	var current= document.querySelector(".g-mask .m-control .clock .current");
	var duration= document.querySelector(".g-mask .m-control .clock .during");
	setInterval(checkTime,50);
	function checkTime(){
		var offset= parseInt(time.clientWidth)/video.duration;
		currenttime.style.width= parseInt(video.currentTime*offset) + "px";
		current.innerHTML= clocktime(video.currentTime);
		duration.innerHTML= clocktime(video.duration);
	}
	function clocktime(num){
		var minutes= parseInt(num/60);
		var seconds= parseInt(num - minutes*60);
		return (minutes<10 ? "0"+minutes : minutes) + ":" +(seconds<10 ? "0"+seconds : seconds);
	}
})();