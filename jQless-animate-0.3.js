/*

    The jQless JavaScript Library v0.3
    By Zheng Duan
    www.zovoland.com

*/
function bindEvent(obj,events,fn){ //bind event
	if(obj.addEventListener){
		obj.addEventListener(events,function(ev){
				if(fn.call(obj) == false){
					ev.preventDefault();
					ev.cancelBubble = true;
				}
				
		},false);
	}
	else{
		
		obj.listeners = obj.listeners || {}; //find all object
		
		obj.listeners[events] = obj.listeners[events] || [];
		
		obj.listeners[events].push(fn); //store in target arrays
		
		if(!obj.listeners.first){ //only once
		
			obj.listeners.first = obj.attachEvent('on'+events,function(){										 
				for(var i=0;i<obj.listeners[events].length;i++){ //run in order
						
					if(obj.listeners[events][i].call(obj) == false){
						window.event.cancelBubble = true;
						return false;
					}
				}
				
			});
		}
	}
}

function getByClass(oParent,sClass){
	var result = [];
	var aEle = oParent.getElementsByTagName('*');
	var re = new RegExp('\\b'+sClass+'\\b','i');
	
	for(var i=0;i<aEle.length;i++){
		if(re.test(aEle[i].className)){
			result.push(aEle[i]);
		}
	}
	
	return result;
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj,false)[attr];
	}
}

Array.prototype.addValue = function(arr){
	
	for(var i=0;i<arr.length;i++){
		this.push(arr[i]);
	}
	
	return this;
	
};

function jQless(vArg){    //main selector
	
	this.elements = [];  //store the elements we need
	
	switch(typeof vArg){
		case 'function':
			//window.onload = vArg;
			bindEvent(window,'load',vArg);
		break;
		case 'string':
			switch(vArg.charAt(0)){
				case '#':  //select by id
					this.elements.push(document.getElementById(vArg.substring(1)));
				break;
				case '.':  //select by class
					this.elements = getByClass(document,vArg.substring(1));
				break;
				default: //select by tag
					this.elements = document.getElementsByTagName(vArg);
				break;
				
			}
		break;
		case 'object':
			this.elements.push(vArg);
		break;
	}
	
}

jQless.prototype.html = function(str){
	if(arguments.length==1){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML = str;
		}
	}
	else{
		return this.elements[0].innerHTML;
	}
	return this;
};

jQless.prototype.bind = function(events,fn){
	
	for(var i=0;i<this.elements.length;i++){
		bindEvent(this.elements[i],events,fn);
	}
	
	return this;
	
};

jQless.prototype.click = function(fn){
	
	this.bind('click',fn);
	
	return this;
};

jQless.prototype.show = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';
	}
	return this;
};

jQless.prototype.hide = function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';
	}
	return this;
};

jQless.prototype.hover = function(fnOver,fnOut){
	
	this.bind('mouseover',fnOver);
	this.bind('mouseout',fnOut);
	return this;
};

jQless.prototype.css = function(attr,value){
	if(arguments.length==2){
		
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[attr] = value;
		}
		
	}
	else if(arguments.length == 1){
		if(typeof attr == 'object'){
			for(var i=0;i<this.elements.length;i++){
				for(var at in attr){
					this.elements[i].style[at] = attr[at];
				}
			}
		}
		else{
			return getStyle(this.elements[0],attr);
		}
	}
	
	return this;
};

jQless.prototype.attr = function(attr,value){
	
	if(attr == 'class'){
		attr = 'className';
	}
	
	if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i][attr] = value;
		}
	}
	else if(arguments.length==1){
		return this.elements[0][attr];
	}
	
	return this;
};

jQless.prototype.toggle = function(){
	
	var _arguments = arguments;
	
	for(var i=0;i<this.elements.length;i++){
		toChange(this.elements[i]);
	}
	
	function toChange(obj){
		var count = 0;
		obj.onclick = function(){
			_arguments[count%_arguments.length].call(this);
			count++;
		};
	}
	
	return this;
	
};

jQless.prototype.eq = function(index){
	
	return $(this.elements[index]);
	
};

jQless.prototype.index = function(){
	
	var brother = this.elements[0].parentNode.children;
	
	for(var i=0;i<brother.length;i++){
		if(brother[i] == this.elements[0]){
			return i;
		}
	}
	
};

jQless.prototype.find = function(vArg){
	
	var result = [];
	
	var newArr = $();
	
	switch(vArg.charAt(0)){
		case '.' :  //class
			for(var i=0;i<this.elements.length;i++){
				result.addValue(getByClass(this.elements[i],vArg.substring(1)));
			}
		break;
		default : // tag
			for(var i=0;i<this.elements.length;i++){
				result.addValue(this.elements[i].getElementsByTagName(vArg));
			}
		break;
	}
	
	newArr.elements = result;
	
	return newArr;
	
};

jQless.prototype.animate = function(json){

    for(var i=0;i<this.elements.length;i++){
        startMove(this.elements[i],json);
    }
}

jQless.prototype.fadeIn = function(){

    for(var i=0;i<this.elements.length;i++){
        startMove(this.elements[i],{opacity:100});
    }
}

jQless.prototype.fadeOut = function(){

    for(var i=0;i<this.elements.length;i++){
        startMove(this.elements[i],{opacity:0});
    }
}

function startMove(obj,json,fn){  //core move function
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){

        var bBtn = true;

        for(var attr in json){
            var iCur = 0;
            if(attr == 'opacity'){
                iCur = Math.round(parseFloat(getStyle(obj,attr))*100);
            }
            else{
                iCur = parseInt(getStyle(obj,attr));
            }

            var iSpeed = (json[attr] - iCur)/8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if(json[attr] != iCur){
                bBtn = false;
            }

            if(attr == 'opacity'){
                obj.style.filter = 'alpha(opacity='+ (iCur+iSpeed) +')';
                obj.style.opacity = (iCur+iSpeed)/100;
            }
            else{
                obj.style[attr] = (iCur+iSpeed) + 'px';
            }
            //console.log(iCur);  //log

        }
        if(bBtn){
            clearInterval(obj.timer);
            if(fn){
                fn.call(obj);
            }
        }

    },30);
}

function $(vArg){
    return new jQless(vArg);
}

