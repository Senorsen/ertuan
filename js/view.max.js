// By : Sensor - zhs490770, 2013年8月28日19:00:24

var pds = {
	number:-1,
	total_page_cnt:-1,		//页码数目
	preload_cnt:3,			//预缓存的页码个数；和网络速度有关
	bg_music:'',			//存储在Manual/bgmusic文件夹
	video:''
};

var pda = {
	page_id:-2,
	is_video_stopped:false
};

var page_controller = {
	res_list:new Array(),
	res_list_p:{},
	load_stat:new Array(),
	load_stat_s:new Array(),
	div_html:new Array(),
	div_html_num:0,
	cur_pr:-1,
	pce:{},
	page_cb_init:function(){},
	__page_dom_ready:function(){
		//回调，等待其生成dom树
		$chdiv=$('#content-layer');
		$scroll=$('.scroll');
		$scroll.perfectScrollbar({wheelSpeed:40}).perfectScrollbar('update');
		$typewriter=$('.typewriter');
		$typewriter.typewriter();
		$chdiv.css("padding","3px 3px 3px 3px");
		this.page_cb_init();
		if(this.pce.start) this.pce.start();
	},
	___preview_mode:true,
	beforeInit:function(){
		//ajax读取配置
		_this=this;
		$(document.body).append('<div style="margin-left:auto;margin-right:auto;color:grey;font-size:15px;">Code by Sensor(zhs490770)</div>').append('<div style="position:fixed;right:3px;top:3px;"><a href="http://yunfeng.zju.edu.cn/catalog.php?catalog_fid=10083" target=_blank>下载iebook版</a></div>');
		$.ajaxSetup({async:true,cache:false});
		$.ajax({url:"Manual/settings/"+pds.number+".json",success:function(data){
			//console.debug(data);
			pds.total_page_cnt=data["page_cnt"];
			pds.bg_music=data["bg_music"];
			pds.video=data["video"];
			//_this.res_list_p=data["preload_list"];
			_this.res_list_p=new Array();
			for(var i=1;i<=pds.total_page_cnt;i++) _this.res_list_p[i]=new Array();			
			for(var i in data['preload_list'])
			{
				for(var j=1;j<=data['preload_list'][i]['last'];j++)
				{
					_this.res_list_p[data['preload_list'][i]['id']].push({"url":'Manual/innerpic/'+pds.number+'/'+data['preload_list'][i]['id']+'/'+j+'.'+data['preload_list'][i]['ext'],"type":data['preload_list'][i]['type']});
				}
			}
			__cb_ajax=function(pid){return function(data){_this.div_html[pid]=data;this.div_html_num++;};};
			for(var i=0;i<=pds.total_page_cnt;i++)
			{
				$.get("Manual/userhtml/"+pds.number+"/"+i+".html","",__cb_ajax(i),"text");
			}
			var this_wait_for_html_intv=setInterval(function(){
					if(pds.total_page_cnt>this.div_html_num) return;
					clearInterval(this_wait_for_html_intv);_this.initPage();},50);
				},
				type:"GET",dataType:"json",error:function(){page_controller.stopVideo();_this.myAlert('啊哈，读取配置文件时出错，暂时无法播放……');}})
	},
	initPage:function(){
		$("#page_id_layer").hover(function(){$(this).stop(true,false).animate({"opacity":"0.3"});},function(){$(this).stop(true,false).animate({"opacity":"0.7"});});
		for(var i=-1;i<=pds.total_page_cnt+1;i++)
		{
			with(this)
			{
				res_list[i]=new Array();
				res_list[i].push({url:'Manual/background/'+pds.number+'/'+i+'.png',type:"img"});
				load_stat[i]=false;
				load_stat_s[i]=new Array();
				load_stat_s[i].push(false);
				if(i>=0 && i<=pds.total_page_cnt)
				{
					for(cfg_r in res_list_p[i])
					{
						load_stat_s[i].push(false);
						res_list[i].push(res_list_p[i][cfg_r]);
					}
				}
			}
		}
		this.doPreload();
		$('body').keydown(function(event){
			//左37 右39，,Home36，PageUp33，PageDown34,回车13
			var keycode={37:1,39:1,36:1,33:1,34:1,13:1};
			if(event.which in keycode)
			{
				event.stopPropagation();
				event.preventDefault();
				switch(event.which)
				{
					case 37:
						$("#controller-prev").click();
						break;
					case 39:
						$("#controller-next").click();
						break;
					case 36:
						$("#controller-menu").click();
						break;
					case 33:
						$("#controller-first").click();
						break;
					case 34:
						$("#controller-end").click();
						break;
					case 13:
						$("#controller-fullscreen").click();
						break;
					default:
						break;
				}
			}
		});
		$mp3_layer=$("#main-mp3-layer");
		$mp3_layer.jPlayer({
			ready: function () {
				$(this).jPlayer("setMedia", {
					mp3: 'Manual/bgmusic/'+pds.bg_music,
				}). bind($.jPlayer.event.ended + ".jp-repeat", function(event) {
					$(this).jPlayer("play");
				});
			},
			swfPath: "js",
			supplied: "mp3"
		});
		$("#player").flowplayer(
		"flowplayer.swf",{
			clip:
			{
				url: "Manual/mov/"+pds.video,
				autoPlay: false,
				autoBuffering: true,
				onFinish:function(){
					page_controller.stopVideo();
				}
			},
			keyboard:false,
		}); 
		$("#controller-layer").css({right:"0px"});
		$(".controller-button:not(#controller-next,#controller-fullscreen)").css("visibility","hidden").eq(0)
				.attr("title","封面").next().attr("title","目录").next().attr("title","封底").next()
				.attr("title","上一页").next().attr("title","下一页").next().attr("title","全屏");
		$("#controller-next").attr("title","跳过片头动画");
		$(".controller-button").hover(
			function()
			{
				$(this).stop(true,false).animate({"opacity":"1"},200,"linear").css("filter","alpha(opacity=100)");
			},
			function()
			{
				if(!pda.is_video_stopped)
					$(this).stop(true,false).animate({"opacity":"0.20"},200,"linear").css("filter","alpha(opacity=20)");
				else
					$(this).stop(true,false).animate({"opacity":"0.4"},200,"linear").css("filter","alpha(opacity=40)");
			}
		).click(
			function()
			{
				if(!pda.is_video_stopped&&this.id!='controller-fullscreen')
				{
					page_controller.stopVideo();
					return;
				}
				var _act=
					{"next":
						function()
						{
							page_controller.gotoNext()
						},
					"prev":
						function()
						{
							page_controller.gotoPrev()
						},
					"menu":
						function()
						{
							page_controller.gotoPage(0)
						},
					"first":
						function()
						{
							page_controller.gotoPage(-1)
						},
					"end":
						function()
						{
							page_controller.gotoPage(pds.total_page_cnt+1)
						},
					"fullscreen":
						function()
						{
							page_controller.enterFullscreen();
						}
					};
				_act[/[-](\w+)/.exec(this.id)[1]]();
			}
		);
	},
	__preload_onload:function(th){
		$this = $(th);
		var cp=parseInt($this.attr('data-cp')),si=parseInt($this.attr('data-si'));
		this.load_stat_s[cp][si]=true;
		var _isok=true;
		for(o in this.load_stat_s[cp])
		{
			if(!(_isok=o)) break;
		}
		if(_isok) this.load_stat[cp] = true;
		this.doPreload();
	},
	doPreload:function(){
		var t_plded=0;
		$preloader=$("#preloader-layer");
		while(t_plded < pds.preload_cnt)
		{
			if(this.cur_pr>pds.total_page_cnt+1) return;
			if(this.cur_pr == -2) this.cur_pr++;
			while(this.load_stat[this.cur_pr])
			{
				this.cur_pr++;
				if(this.cur_pr>pds.total_page_cnt+1) return;
			}
			for(var s_i=0;s_i<this.load_stat_s[this.cur_pr].length;s_i++)
			{
				if(this.load_stat_s[this.cur_pr][s_i]) continue;
				src = this.res_list[this.cur_pr][s_i].url;
				type=this.res_list[this.cur_pr][s_i].type;
				if(type=='img')
					$preloader.append('<img src="'+src+'" id="pri_'+this.cur_pr+'_'+s_i+'" data-cp="'+this.cur_pr+'" data-si="'+s_i+'" onload="page_controller.__preload_onload(this);">');
			}
			this.cur_pr++;
		}
	},
	__lr_anim:function(intv,from,to,__is_proc,pgc)
	{
		if(!pgc) pgc=this;
		if(from == -2) from = -1;
		var mode_txt_str=new Array();
		mode_txt_str[-1]="封面";mode_txt_str[0]="目录";mode_txt_str[pds.total_page_cnt+1]="封底";
		var page_id=from;
		var modetxt='';
		if(page_id==-1) modetxt=' no-repeat top right';
		if(page_id==pds.total_page_cnt+1) modetxt=' no-repeat top left';
		$page_id=$('#page_id');
		if(page_id==-1 || page_id==0 || page_id==pds.total_page_cnt+1) $page_id.html('- '+mode_txt_str[page_id]+' -');else $page_id.html('- '+page_id+' -');
		$content_layer=$("#content-layer");
		$content_layer.html('');
		//预览模式
		this.___preview_mode=true;
		if(from==to)
		{
			//标明为非预览模式
			this.___preview_mode=false;
			if(this.div_html[from]) $content_layer.html(this.div_html[from]);
			$bgpic.css({"background":"url(Manual/background/"+pds.number+"/"+page_id+".png)"+modetxt,"left":"200px"}).animate({left:"0px",opacity:"1"},300,"swing").css("filter","alpha(opacity=100)");
			return;
		}
		if(this.div_html[from]) $content_layer.html(this.div_html[from]);
		$bgpic.stop(true,false).css({left:"0px",opacity:__is_proc?"0.4":"1",filter:"alpha(opacity="+(__is_proc?"40":"100")+")","background":"url(Manual/background/"+pds.number+"/"+page_id+".png)"+modetxt}).animate({left:"-200px",opacity:"0.2"},intv,"linear",function(){pgc.__lr_anim(intv,from+1,to,1,pgc);}).css("filter","alpha(opacity=20)");
	},
	__rl_anim:function(intv,from,to,__is_proc,pgc)
	{
		if(!pgc) pgc=this;
		var mode_txt_str=new Array();
		mode_txt_str[-1]="封面";mode_txt_str[0]="目录";mode_txt_str[pds.total_page_cnt+1]="封底";
		var page_id=from;
		var modetxt='';
		if(page_id==-1) modetxt=' no-repeat top right';
		if(page_id==pds.total_page_cnt+1) modetxt=' no-repeat top left';
		$page_id=$('#page_id');
		if(page_id==-1 || page_id==0 || page_id==pds.total_page_cnt+1) $page_id.html('- '+mode_txt_str[page_id]+' -');else $page_id.html('- '+page_id+' -');
		$content_layer=$("#content-layer");
		$content_layer.html('');
		//预览模式
		this.___preview_mode=true;
		if(from==to)
		{
			//标明为非预览模式
			this.___preview_mode=false;
			if(this.div_html[from]) $content_layer.html(this.div_html[from]);
			$bgpic.css({"background":"url(Manual/background/"+pds.number+"/"+page_id+".png)"+modetxt,"left":"-200px"}).animate({left:"0px",opacity:"1"},300,"swing").css("filter","alpha(opacity=100)");
			return;
		}
		if(this.div_html[from]) $content_layer.html(this.div_html[from]);
		$bgpic.stop(true,false).css({left:"0px",opacity:__is_proc?"0.4":"1",filter:"alpha(opacity="+(__is_proc?"40":"100")+")","background":"url(Manual/background/"+pds.number+"/"+page_id+".png)"+modetxt}).animate({left:"200px",opacity:"0.2"},intv,"linear",function(){pgc.__rl_anim(intv,from-1,to,1,pgc);}).css("filter","alpha(opacity=20)");
	},
	gotoPage:function(page_id){
		//-1:封面，0：目录
		var orgpi=pda.page_id;
		if(this.cur_pr<page_id)
		{
			this.cur_pr=page_id;
			this.doPreload();
		}
		var animate_type=pda.page_id<page_id?true:false;	//翻页类型，true为向前，false为向后
		pda.page_id=page_id;
		$page_id=$('#page_id');
		$page_id_layer=$("#page_id_layer");
		$bgpic=$('#bgpic-layer');
		if(this.pce.end) this.pce.end();
		this.page_cb_init = function(){};
		this.pce = {start:function(){},end:function(){}};
		$scroll=$('.scroll');
		$scroll.perfectScrollbar('destroy');
		if(animate_type)
		{
			this.__lr_anim(200/(page_id-orgpi),orgpi,page_id);
		}
		else
		{
			this.__rl_anim(200/(orgpi-page_id),orgpi,page_id);
		}
	},
	rfPage:function(){
		$.get("Manual/userhtml/"+pds.number+"/"+pda.page_id+".html","",function(data){
			page_controller.div_html[pda.page_id]=data;page_controller.gotoPage(pda.page_id);
		},"text");
	},
	gotoNext:function(){
		if(pda.page_id>=pds.total_page_cnt+1) return;
		this.gotoPage(pda.page_id+1);
	},
	gotoPrev:function()
	{
		if(pda.page_id<=-1) return;
		this.gotoPage(pda.page_id-1);
	},
	stopVideo:function(fail)
	{
		$('#player').css("display","none").html('').parent().css("display","none");
		pda.is_video_stopped=true;
		if(fail) return;
		$(".controller-button").animate({"opacity":"0.4"}).css("filter","alpha(opacity=40)");
		this.gotoPage(-1);
		$("#main-mp3-layer").jPlayer("play");
		$(".controller-button:not(#controller-next)").css("visibility","visible");
		$("#controller-next").attr("title","下一页");
		if(!/infoed=1/.test(document.cookie))
		{
			page_controller.myAlert('操作说明：左右键换页，PageUp封面，Home目录，PageDown封底，回车键全屏。',5000,"tips")
				.click(function(){document.cookie="infoed=1"});
		}
		$("#controller-layer").animate({right:"40px"});
	},
	enterFullscreen:function(){
		//从stackoverflow处抄来的代码。
		try
		{
			var objWs = new ActiveXObject("Wscript.Shell");
			objWs.SendKeys("{F11}");
		}
		catch(e){}
		if(/msie/.test(navigator.userAgent.toLowerCase()))
		{
			this.myAlert('您的浏览器不支持自动全屏。请尝试按F11键进入全屏模式。',3000);
			return;
		}
		var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method  
				(document.mozFullScreen || document.webkitIsFullScreen);
	
		var docElm = document.documentElement;
		if (!isInFullScreen) {
	
			if (docElm.requestFullscreen) {
				docElm.requestFullscreen();
			}
			else if (docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			}
			else if (docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
			
		}
		else
		{
			if(document.webkitCancelFullScreen) document.webkitCancelFullScreen();
			else if(document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if(document.exitFullscreen) document.exitFullscreen();
		}
	},
	myAlert:function(s,t,id){
		if(!id) id='alert-'+Math.random();
		var $this_alert;
		$('#active-layer').append($this_alert=$('<div class="alert" id="'+id+'"></div>').click(
			function()
			{
				$(this).fadeOut(300);
			})
		.html(s).css({'display':'block','opacity':0,'filter':'alpha(opacity=0)'})
		.animate({'opacity':'0.7'},200,"swing").css('filter','alpha(opacity=70)'));
		if(typeof t!='undefined') setTimeout(function(){$this_alert.each(function(){$(this).click();})},t);
		return $this_alert;
	}
};

$(document).ready(function(){
	//if($.browser.msie) alert($.browser.msie)   ←这个貌似从哪个版本来着的jq里……去掉了233
	page_controller.beforeInit();
});