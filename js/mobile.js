define([], function(){
	var _isShow = false;
	var $tag, $toys;
	var ctn, basicwrap;

	// 从 PC 左栏复制内容到移动端抽屉
	var combine = function(){
		if($tag){ document.getElementById("js-mobile-tagcloud").innerHTML = $tag.innerHTML; }
		if($toys){ document.getElementById("js-mobile-toys").innerHTML = $toys.innerHTML; }
	};

	// 渲染抽屉 DOM（高度交给 CSS：#viewer 全屏 fixed，#viewer-box height:100%）
	var renderDOM = function(){
		var $viewer = document.createElement("div");
		$viewer.id = "viewer";
		$viewer.className = "hide";
		$tag = document.getElementById("js-tagcloud");
		$toys = document.getElementById("js-toys");
		var tagStr = $tag ? '<span class="viewer-title">标签</span><div class="viewer-div tagcloud" id="js-mobile-tagcloud"></div>' : "";
		var toysStr = $toys ? '<span class="viewer-title">一些小玩意儿</span><div class="viewer-div toys" id="js-mobile-toys"></div>' : "";
		$viewer.innerHTML = '<div id="viewer-box"><div class="viewer-box-l"><div class="viewer-header"><span class="viewer-header-title">导航</span><span class="viewer-close" id="viewer-close" aria-label="关闭"><i class="fa-solid fa-xmark"></i></span></div><div class="viewer-box-wrap">'+toysStr+tagStr+'</div></div><div class="viewer-box-r"></div></div>';
		document.getElementsByTagName("body")[0].appendChild($viewer);
		basicwrap = document.getElementById("viewer-box");
	};

	var show = function(){
		var viewer = document.getElementById("viewer");
		viewer.className = "";                                // 显示遮罩
		basicwrap.className = "";                             // 确保从滑出态开始
		_isShow = true;
		setTimeout(function(){ basicwrap.className = "anm-swipe"; }, 20);  // 触发滑入动画
	};

	var hide = function(){
		if(!_isShow) return;
		_isShow = false;
		basicwrap.className = "";                             // 移除 anm-swipe，滑回
		// 兜底：动画结束后隐藏遮罩（不依赖 transitionend）
		setTimeout(function(){
			var v = document.getElementById("viewer");
			if(v && !_isShow){ v.className = "hide"; }
		}, 300);
	};

	var bindDOM = function(){
		// 滑动结束隐藏遮罩（标准 transitionend + webkit 兜底）
		var onTransEnd = function(){
			if(!_isShow){ document.getElementById("viewer").className = "hide"; }
		};
		basicwrap.addEventListener("transitionend", onTransEnd, false);
		basicwrap.addEventListener("webkitTransitionEnd", onTransEnd, false);

		// slider-trigger：点开关（toggle）
		ctn.addEventListener("click", function(e){
			e.stopPropagation();
			_isShow ? hide() : show();
		}, false);

		// 点抽屉右侧空白关闭
		var $right = document.getElementsByClassName("viewer-box-r")[0];
		if($right){ $right.addEventListener("click", function(){ hide(); }, false); }

		// 点关闭按钮 ×
		var $close = document.getElementById("viewer-close");
		if($close){ $close.addEventListener("click", function(){ hide(); }, false); }

		// Esc 关闭
		document.addEventListener("keydown", function(e){
			if(e.key === "Escape" && _isShow){ hide(); }
		}, false);

		// 顶部 overlay 滚动 fixed + 作者名回顶
		var $overlay = $("#mobile-nav .overlay");
		var $header = $(".js-mobile-header");
		window.onscroll = function(){
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if(scrollTop >= 69){ $overlay.addClass("fixed"); }else{ $overlay.removeClass("fixed"); }
			if(scrollTop >= 160){ $header.removeClass("hide").addClass("fixed"); }else{ $header.addClass("hide").removeClass("fixed"); }
		};
		if($header[0]){
			$header[0].addEventListener("click", function(){ $('html, body').animate({scrollTop:0}, 'slow'); }, false);
		}
	};

	return {
		init: function(){
			ctn = document.getElementsByClassName("slider-trigger")[0];
			if(!ctn) return;
			renderDOM();
			combine();
			bindDOM();
		}
	};
});
