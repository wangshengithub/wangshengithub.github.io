define([], function(){
	// 原 switch 切换机制已移除（左栏改为平铺一级列表），此处无需初始化。
	// 保留空 init 供 main.js 的 loadPC 调用，避免 require 找不到模块。
	return {
		init: function(){}
	}
});
