var watcher = (function(){
	var list=[],
		listen,
		trigger,
		remove;

	listen = function(key,fn){
		if(!list[key]){
			list[key] = [];
		}
		// 加入缓存列表
		if(fn || typeof fn === "function"){
			list[key].push(fn);
		}		
	};

	trigger = function(){
		var key = Array.prototype.shift.call(arguments);
		var fns = list[key];
		if(!fns || fns.length === 0){
			return;
		}
		for(var i=0,fn;fn=fns[i];i++){			
			fn.apply(null,arguments);
		}
	};

	remove = function(key,fn){
		var fns = list[key];
		if(!fns || fns.length === 0){
			return;
		}
		if(!fn){ // 删除该key对应的所有订阅者
			fns.length = 0;
		}
		for(var i = 0; i < fns.length; i ++){
			var _fn = fns[i];
			if(_fn === fn){
				 fns.splice(i,1); // 删除订阅者的回调函数
			}
		}		
	};

	return {
		listen:listen,
		trigger:trigger,
		remove:remove
	};
})();