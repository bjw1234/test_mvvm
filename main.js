/**
 * 动手实现一个简单的数据双向绑定
 * name: Svm 
 * time:2018/05/02
 * author: zuozuomu
 */


/**
 * [Svm 构造函数]
 * @param {[object]} options [配置项]
 */
function Svm(options){	
	this._init(options);
}


// 初始化方法
Svm.prototype._init = function(options) {
	this.$options = options;
	this.$el = document.querySelector(options.el);
	this.$data = options.data;
	this.$methods = options.methods;

	this._binding = {}; 
	this._observe(this.$data);
	this._compile(this.$el);
};

// 添加get和set方法
Svm.prototype._observe = function(obj){
	for(let key in obj){
		if(obj.hasOwnProperty(key)){
			this._binding[key] = {
				_directives: [] // 指令集合
			};
			let value = obj[key];
		}
		// 递归调用
		if(typeof value === 'object'){
			this._observe(value);
		}
		let binding = this._binding[key];
		Object.defineProperty(this.$data,key,{
			enumerable:true,
			configurable:true,
			get:function(){
				return value;
			},
			set:function(val){
				if(val !== value){
					value = val;
					// 修改数据 --> 改变视图
					console.log(binding._directives);
					binding._directives.forEach(function(item){
						item.update();
					}); 
				}
			}
		});
	}
};

// 解析指令
Svm.prototype._compile = function(root){
	var _this = this;
	var nodes = root.children;
	for(var i=0,len = nodes.length;i<len;i++){
		var node = nodes[i];
		if(node.children.length){
			// 对所有元素进行处理
			this._compile(node);
		}

		// s-click属性
		if(node.hasAttribute('s-click')){
			node.onclick = (function(){
				var attrVal = node.getAttribute('s-click');		
				return _this.$methods[attrVal].bind(_this.$data);
			})();
		}

		// s-model属性
		if(node.hasAttribute('s-model') && node.tagName === 'INPUT' || node.tagName === 'TEXTAREA'){
			node.addEventListener('input',(function(key){
				var attrVal = node.getAttribute('s-model');
				_this._binding[attrVal]._directives.push(new Watcher(
					'input',
					node,
					_this,
					attrVal,
					'value'
				));	
				return function(e){			
					console.log(i);	
					// 修改视图 --> 改变数据	
					_this.$data[attrVal] = nodes[key].value;
				}
			})(i));
		}

		// s-bind指令
		if(node.hasAttribute('s-bind')){
			var attrVal = node.getAttribute('s-bind');
			_this._binding[attrVal]._directives.push(new Watcher(
				'text',
				node,
				_this,
				attrVal,
				'innerHTML'
			));
		}
	}
};


/**
 * [Watcher 监听数据更新DOM]
 * @param {[type]} name [指令名称]
 * @param {[type]} el   [指令对应的DOM元素]
 * @param {[type]} vm   [所属的Svm实例]
 * @param {[type]} exp  [data中的属性]
 * @param {[type]} attr [绑定的属性值]
 */
function Watcher(name,el,vm,exp,attr){
	this.name = name;
	this.el = el; 
	this.vm = vm;
	this.exp = exp; 
	this.attr = attr; 
	this.update();
}

// 更新数据
Watcher.prototype.update = function(){
	this.el[this.attr] = this.vm.$data[this.exp];
	// node.innerHTML = this.data.number;
}