/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window){
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function(){
        var ls = window.localStorage;
        if(isAndroid){
           ls = os.localStorage();
        }
        return ls;
    };
    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.trim = function(str){
        if(String.prototype.trim){
            return str == null ? "" : String.prototype.trim.call(str);
        }else{
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str){
        return str.replace(/\s*/g,'');
    };
    u.isElement = function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj){
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj){
        if(JSON.stringify(obj) === '{}'){
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if(el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function(){
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelector){
                return document.querySelector(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelector){
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelectorAll){
                return document.querySelectorAll(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelectorAll){
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id){
        return document.getElementById(id);
    };
    u.first = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':first-child');
        }
    };
    u.last = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':last-child');
        }
    };
    u.eq = function(el, index){
        return this.dom(el, ':nth-child('+ index +')');
    };
    u.not = function(el, selector){
        return this.domAll(el, ':not('+ selector +')');
    };
    u.prev = function(el){
        if(!u.isElement(el)){
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el){
        if(!u.isElement(el)){
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector){
        if(!u.isElement(el)){
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el){
            var i = 0, len = doms.length;
            for(i; i<len; i++){
                if(doms[i].isEqualNode(el)){
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector){
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while(!targetDom){
                el = el.parentNode;
                if(el != null && el.nodeType == el.DOCUMENT_NODE){
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent,el){
        var mark = false;
        if(el === parent){
            mark = true;
            return mark;
        }else{
            do{
                el = el.parentNode;
                if(el === parent){
                    mark = true;
                    return mark;
                }
            }while(el === document.body || el === document.documentElement);

            return mark;
        }
        
    };
    u.remove = function(el){
        if(el && el.parentNode){
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value){
        if(!u.isElement(el)){
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length == 2){
            return el.getAttribute(name);
        }else if(arguments.length == 3){
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name){
        if(!u.isElement(el)){
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        var arr = el.className.split(' ');
        if(arr.indexOf(cls) > -1){
            return true;
        }else{
            return false;
        }
    };
    u.addCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.add(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls +' '+ cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.remove(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
       if('classList' in el){
            el.classList.toggle(cls);
        }else{
            if(u.hasCls(el, cls)){
                u.removeCls(el, cls);
            }else{
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val){
        if(!u.isElement(el)){
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            switch(el.tagName){
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if(arguments.length === 2){
            switch(el.tagName){
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }
        
    };
    u.prepend = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.innerHTML;
        }else if(arguments.length === 2){
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt){
        if(!u.isElement(el)){
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.textContent;
        }else if(arguments.length === 2){
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el){
        if(!u.isElement(el)){
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css){
        if(!u.isElement(el)){
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if(typeof css == 'string' && css.indexOf(':') > 0){
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop){
        if(!u.isElement(el)){
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json){
        if(typeof json === 'object'){
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str){
        if(typeof str === 'string'){
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value){
        if(arguments.length === 2){
            var v = value;
            if(typeof v == 'object'){
                v = JSON.stringify(v);
                v = 'obj-'+ v;
            }else{
                v = 'str-'+ v;
            }
            var ls = uzStorage();
            if(ls){
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key){
        var ls = uzStorage();
        if(ls){
            var v = ls.getItem(key);
            if(!v){return;}
            if(v.indexOf('obj-') === 0){
                v = v.slice(4);
                return JSON.parse(v);
            }else if(v.indexOf('str-') === 0){
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key){
        var ls = uzStorage();
        if(ls && key){
            ls.removeItem(key);
        }
    };
    u.clearStorage = function(){
        var ls = uzStorage();
        if(ls){
            ls.clear();
        }
    };

   
    /*by king*/
    u.fixIos7Bar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    u.fixStatusBar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if(sysType == 'ios'){
            u.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                // el.style.paddingTop = '25px';
                this.addCls( el, 'fixStatusBar' );
            }
        }
    };
    u.post = function(/*url,data,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function(/*url,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };

    u.thisActive = function( obj ){
		var eP = obj.el.parentNode.querySelectorAll( obj.el.tagName ),
            index ;
		for( var x in eP ){
            if( eP[x].nodeType ){
                if( eP[x] === obj.el ){
                    $api.addCls(  eP[x], obj.class || 'active' );
                    index = x;
                }else{
                    $api.removeCls(  eP[x], obj.class || 'active' );
                };
            };
		};
        return index;
    };
    u.aes = function(postData,decode){
    	var signature = api.require('signature');
    	var kkey = 'six.video.bb';
    	if(decode){
    		if(this.sign_type == 'base'){
    			return signature.base64DecodeSync({
				    data: postData,
				    uppercase: false
				});
    		}
    		return signature.aesDecodeSync({
			    data: postData,
			    key: kkey
			});
    		return postData;
    	}
    	var strData = '';
    	if(true){
    		//postData.uri = '/'+postData.uri;
    		
    		for(var i in postData){
    			if(this.isArray(postData[i])){
    				postData[i] = JSON.stringify(postData[i]);
    			}
    		}
    		var arr = [];
    		for(var k in postData){
    			postData[k] = this.trim(postData[k]);
    			if( (postData[k] || postData[k] === 0) && postData[k] != 'null' && postData[k] != null  ){
    				arr.push(k+'='+postData[k]);
    			}
    		}
    		strData = arr.join('&');
    		
    	}
    	if(this.sign_type == 'base'){
    		return signature.base64Sync({
			    data: strData,
			    uppercase: false
			});
    	}
    	return signature.aesSync({
		    data: strData,
		    key: kkey
		});
    };
    u.is_aes = 1;
    u.sign_type = 'base';//base=>base64;aes=>aes
    u.ajax = function( obj, callBack, count ){
    	if(api.connectionType == 'none'){
    		api.hideProgress();
    		api.refreshHeaderLoadDone();
    		api.toast({
	            msg:'当前网络不可用，请检查你的网络设置',
	            location:'middle'
            });
    		return false;
    	}
    	var uuid = this.getStorage('uuid');
    	if(!uuid){
        	uuid = this.uuid();
        	this.setStorage('uuid',uuid);
        }
    	if( obj.data == undefined ){
    		obj.data = {
    			device_id : api.deviceId,
    			//app_version : api.appVersion,
    			//system_type : api.systemType,
    			//system_version : api.systemVersion,
    			//device_token : api.deviceToken,
    			//device_model : api.deviceModel
    			uuid: uuid
    		};
    	}else{
    		obj.data.device_id = api.deviceId;
    		obj.data.uuid = uuid;
    		//obj.data.app_version = api.appVersion;
    		//obj.data.system_type = api.systemType;
    		//obj.data.system_version = api.systemVersion;
    		//obj.data.device_token = api.deviceToken;
    		//obj.data.device_model = api.deviceModel;
    	}
    	var api_url = 'http://wsx.xianxiazhifu.net/router/rest?sign_type=1&method=';
    	//obj.data.data = this.aes(obj.data);
    	//console.log(obj.data.data);
    	//console.log(this.aes(obj.data.data,true));
    	var is_aes = this.is_aes;//1;//加密传输
    	if(is_aes){
    		obj.data = {
	    		data: this.aes(obj.data)
	    	};
    	}else{
    		obj.data.enc = 1;
    	}
    	//console.log(obj.data.data);return;
    	$that = this;
    	var token = this.getStorage('token');
    	if(token == undefined || token == 'undefined'){
    		token = '';
    	}
        var data = {
            url: api_url + obj.method + '&token='+token,
            method: obj.type || 'post',
            cache : obj.cache || false,
            data: {
                values: obj.data || '',
                files: obj.files || ''
            }
        }
        count = count ? count : 1;//token 获取次数
        //console.log(data.url);
        //console.log(obj.data.data);
        var filePath = SHA1( JSON.stringify( data ));
        this.hasNetwork(filePath, function( ret, hasNetwork  ){
            if( hasNetwork ){
                callBack( ret );
            }else{
                api.ajax(data, function (ret, err) {
                	//console.log(obj.method+'=>'+$that.aes(ret.data,true));
                	if(is_aes){
                		ret.data = JSON.parse($that.aes(ret.data,true));
                	}
                	//console.log(JSON.stringify(ret.data));
                	if(obj.method == 'token'){
                		$that.setStorage('token',ret.data.token);
                    	$that.setStorage('user_id',ret.data.user_id);
                	}
                    if( ret ){
                        if( data.cache ){
                            api.writeFile({
                                path: 'fs://cache/'+filePath+'.txt',
                                data: encodeURI( JSON.stringify( ret ) )
                            });
                        }
                        if ( ret.code != undefined && ret.code == '10001' ){
                        	if(count > 4){
		            			api.hideProgress();
		            			api.refreshHeaderLoadDone();
		            			
		            			/*
		            			api.toast({
	                                msg:'非法请求',
	                                location:'middle'
                                });
                                */
                                
		            			return false;
		            		}
		            		count++;
		            		api.ajax({
	                            url:api_url+'token',
	                            method: obj.type || 'post',
					            cache : obj.cache || false,
					            data: {
					                values: obj.data || ''
					            },
					            headers:{
							        "User-Agent":'SixVideo/0.0.1(20160525)'
							    }
                            },function(ret,err){
                            	if(is_aes){
			                		ret.data = JSON.parse($that.aes(ret.data,true));
			                	}
                            	if(ret.code == 0){
    								$that.setStorage('token',ret.data.token);
    								$that.setStorage('user_id',ret.data.user_id);
    							}
                            	$that.ajax(obj, callBack,count);
                            });
		            	}else{
		            		callBack(ret, err);
		            	}
                        
                    }else{
                        //$api.toast( JSON.stringify(err))
                        $api.toast( '出错咯！' );
                    }
                });
            }
        })
    };
   
   //   用户是否存在否则跳到登陆页面 
    u.hasLoginIn = function( obj, callBack ){
        if( typeof obj == 'object' ){
            if( obj.el.getAttribute('data-has-loginIn') ){
                this.getLocal( 'config', 'user', function( ret ){
                    if( ret ){
                        callBack( obj );
                    }else{
                        $api.intoHeader( 'signIn' );
                    }
                });
            }else{
                callBack( obj );
            }
        }else{
            callBack( obj );
        }
    };
    
    
    //  跳转到公共的 headerAndFoot.html   
    u.intoHeader = function( obj, ty ){
        if( typeof obj != 'string' && ! ty ){
            window.event.stopPropagation();
        }
        this.hasLoginIn(obj, function( ){
            obj = {
                name: typeof obj == 'string' ? obj : obj.el.getAttribute('data-html'),
                url: api.wgtRootDir+'/html/public/headerAndFooter.html',
                pageParam : {
                    param : typeof obj == 'object' ? obj.el.querySelector('i.hide') ? obj.el.querySelector('i.hide').innerHTML : false : false
                }
            };
            if ( obj.name == 'cart' || obj.name == 'payMode' ) {
            	obj.slidBackEnabled = false;
            }
            // alert( JSON.stringify( obj ))
            api.openWin(obj);
        });
    }
    
    //  提示框
    u.toast = function( obj ){
        api.toast({
            msg: typeof obj == 'string' ? obj : obj.msg || '加载异常...',//JSON.stringify( obj ),
            duration: obj.duration || 2000,
            location: obj.location || 'bottom'
        });
    }
    
    
    //  功能待完善
    u.noPerfact = function(  ){
        this.toast('审核中');
    }
    
    
    //  是否联网
    u.hasNetwork = function(filePath, callback ){
        if( api.connectionType.indexOf('none') != -1  ){
            api.readFile({
                path:'fs://cache/'+filePath+'.txt'
            }, function(ret, err){
                if( ret.data ){
                    callback( JSON.parse( decodeURI( ret.data )), true );
                }else{
                    $api.toast( {msg:'网络连接失败(⊙o⊙)哦',location:'middle'} );
                }
            });
        }else{
            callback( callback, false );
        }
    }
    
    
    //  获取本地 JSON 缓存
    u.getLocal = function( key, value, callback ){
        var local = JSON.parse( localStorage.getItem( key ) ) || {};
        if( local[value] ){
            if( callback )callback( local[value] );
            return local[value];
        }else{
            if( callback )callback( false );
            return false;
        }
    }
    
    //  设置本地 JSON 缓存
    u.setLocal = function( key, obj, callback ){
        var local = JSON.parse( localStorage.getItem( key ) ) || {};
        for( var x in obj ){
            local[ obj[x].key ] = obj[x].value;
        }
        localStorage.setItem( key, JSON.stringify( local ) );
        if( callback )callback( local );
        return local;
    }
    
    //  设置本地 JSON 缓存
    u.removeLocal = function( key, value, callback ){
        var local = JSON.parse( localStorage.getItem( key ) ) || {};
        if( local[value] ){
            delete local[value];
            localStorage.setItem( key, JSON.stringify( local ) );
            if( callback )callback( true );
            return true;
        }else{
            if( callback )callback( false );
            return false;
        }
    }
    
    //  设置本地 JSON 缓存
    u.each = function( json, callback ){
        for( var x in json ){
            if( json[x] instanceof HTMLElement ){
                callback( json[x] );
            }
        }
    }
    
    //  调起弹窗
    u.popup = function( obj ){
        this.hasLoginIn(obj, function( ){
            api.openFrame({
                name: obj.el.getAttribute('data-name'),
                url: api.wgtRootDir+'/html/public/popup.html',
                bgColor: 'rgba(0,0,0,.4)',
                pageParam : {
                    share : allVar.share ? (function( ret ){
                       return  JSON.stringify( allVar.share );
                    })() : false
                }
            });
        });
    }
    
    u.uuid = function() {
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";
	 
	    var uuid = s.join("");
	    return uuid;
	}
	
	u.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	        return v.toString(16);
	    });
	}
    
/*end*/
    

    document.write('<script type="text/javascript" src="../../js/SHA1.js"></script>');

    window.$api = u;

})(window);


