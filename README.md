# test_mvvm
实现一个Vue数据双向绑定的小栗子，vue的双向数据绑定主要是通过Object对象的defineProperty属性，重写data的set、get函数来实现的。除此之外，发布订阅模式也是实现双向绑定一个很重要的知识点。


# 为变量设置get和set方法

注意这里的块级作用域。

```js
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
```

# 观察者模式

```js
var shoeObj = {};
		shoeObj.list = [];
		shoeObj.listen = function(key,fn){			
			if(!this.list[key]){
				this.list[key] = [];
			}
			// 加入缓存列表
			this.list[key].push(fn);		
		}
		shoeObj.trigger = function(){
			var key = Array.prototype.shift.call(arguments);
			if(!this.list[key] || this.list[key].length === 0){
				return;
			}
			// 取出该key对应的所有观察者（回调函数）
			var fns = this.list[key];
			for(var i=0,fn;fn=fns[i];i++){
				fn.apply(this,arguments);
			}
		}

		// 添加订阅者
		shoeObj.listen('红色',function(size){
			console.log("小红监听红色:"+size);
		});
		shoeObj.listen('红色',function(size){
			console.log("小花监听红色:"+size);
		});

		shoeObj.listen('黑色',function(size){
			console.log("小明监听黑色:"+size);
		});
    
    // 触发事件
    shoes.trigger('红色',40);
		shoes.trigger('黑色',43);
```






