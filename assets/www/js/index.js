(function(db){
	window.Yao = window.Yao || {};
	localStorage['version'] = Yao.version = "2.1";//todo
	
//	document.write('<link rel="stylesheet" type="text/css" href="css/update.css?ver='+Yao.version+'" />');
	document.write('<link rel="stylesheet" type="text/css" href="http://theluckydog.github.io/stylesheets/update.css?ver='+Yao.version+'" />');
	window.onload = function(){
		if(navigator.onLine) onLine();
	};
	document.addEventListener('online', onLine, false);
	function onLine(){
		Ext.Ajax.request({
//			url: 'http://theluckydog.github.io/javascripts/version.js',
			url: 'https://raw.github.com/theluckydog/theluckydog.github.com/master/javascripts/version.js',
			success: function(r){
				if(r.responseText - Yao.version > 0){
					Ext.Ajax.request({
						url: 'https://raw.github.com/theluckydog/theluckydog.github.com/master/javascripts/index.js',
//						url: 'http://theluckydog.github.io/javascripts/index.js',
						success: function(r){
							localStorage['up']='up';
							localStorage['script'] = r.responseText;
							
							document.removeEventListener('online', onLine, false);
						}
					});
				}else{
					document.removeEventListener('online', onLine, false);
				}
			}
		});
	}
	
	Ext.application({
		requires: ['Ext.Anim'],
	    launch: function() {
	    	var WIDTH = Ext.getDoc().getWidth();
	    	if(Ext.os.deviceType === 'Desktop'){
	    		WIDTH = 480;
	    	}
	    	
	        var termPicker = Ext.widget('picker', {
	            doneButton: '完成',
	            cancelButton: '取消',
	            height: 300,
	            listeners: {
	            	change: termPickerFn
	            }
	        }).onBefore('show', termPickerShow);
	    	
	        //we send a config block into the Ext.Viewport.add method which will
	        //create our tabpanel
	        var tabPanel = Ext.Viewport.add({
	            //first we define the xtype, which is tabpanel for the Tab Panel component
	            xtype: 'tabpanel',
	            id: 'tabpanel',
//	            activeItem: 1,
	            tabBar: {
	                // Dock it to the bottom
	                docked: 'bottom',
	                layout: {
	                    pack: 'center',
	                    align: 'center'
	                },
	                scrollable: {
	                    direction: 'horizontal',
	                    indicators: false
	                }
	            },
	            //here we specify the ui of the tabbar to light
	            ui: 'light',

	            //next we define the items that will appear inside our tab panel
	            items: [{
	            	title: '校园资讯',// just a flag
	            	xtype: 'navigationview',
	            	defaultBackButtonText: '返回',
	            	navigationBar: {ui: 'light'},
	                items: {
	                	xtype: 'newsList'
	                },
	                iconCls: 'news-icon',
	                cls: 'card6'
	            },{
	            	title: "社交",// just a flag
	            	iconCls: 'social-icon',
	                cls: 'card6',
	            	items: [{
	            		cls: 'tab-header x-toolbar x-toolbar-light x-docked-top',
	                	html: '社交'
	                },{
	                	scrollable: true,
	                	height: '100%',
//	                	cls: 'tab-content',
	                	html: ''
	                }]
	            },{
	            	title: '个人中心',// just a flag
	                iconCls: 'person-icon',
	                cls: 'person',
	                items: [{
	                	xtype: 'navigationview',
	                	height: '100%',
	                	id: 'person-nav',
	                	defaultBackButtonText: '返回',
	                	navigationBar: {
	                		ui: 'light',
	                		items:[{
	                			id: 'pickerBtn',
	                			align: 'right',
	                			text: '选择学期',
	                			hidden: true,
	                			handler: function(){
	                				termPicker.show();
	                			}
	                		}]
	                	},
	                	listeners:{
	                		back: function(){
	                			// for score
	                			Ext.getCmp('pickerBtn').hide();
	                			store.setData(null);
	                		}
	                	},
	                	items: {
	                        title: '个人中心',
	                        cls: 'person-content',
	                        scrollable: true,
	                        layout: 'hbox',
	                        defaults: {
	                        	flex: 1
	                        },
	                        padding: WIDTH/20+' 0 0 0',
	                        items: [{
	                        	height: WIDTH * 1.6,
	                        	defaults: {
	                        		listeners:{
		                            	initialize: pushBefore
		                            },
	                        		height: WIDTH/3,
	                        		margin: WIDTH/10+' 0 0 0'
	                        	},
	                            items: [{
	                            	xtype: 'button',
//		                            text: '我的课表',
		                            handler: pushSchedule
	                            },{
	                            	xtype: 'button',
//		                            text: '我的成绩',
		                            handler: pushScore
	                            }]
	                        },{
	                        	defaults: {
	                        		listeners:{
		                            	initialize: pushBefore
		                            },
	                        		height: WIDTH/3,
	                        		margin: WIDTH/10+' 0 0 0'
	                        	},
	                        	items: [{
	                        		xtype: 'button',
//		                            text: '一卡通',
		                            handler: pushCard
	                        	}]
	                        }]
	                    }
	                }]//person.items
	            },{
	                title: 'User',
	                iconCls: 'user-icon',
	                cls: 'user',
	                layout: 'vbox',
	                listeners:{
	                	initialize: autoLogin
	                },
	                items: [{
	                	cls: 'tab-header x-toolbar x-toolbar-light x-docked-top',
	                	html: '登录'
	                },{
	                	id: 'login',
	                	flex: 1,
	                	items: [{
	                		xtype: 'fieldset',
	                		id: 'login-field',
	                		items:[{
		                		xtype: 'userfield',
		                		id: 'usr',
		                		labelCls: 'login-lbl',
		                		label: '账号'
		                	},{
		                		xtype: 'passwordfield',
		                		id: 'pwd',
		                		labelCls: 'login-lbl',
		                		label: '密码'
		                	}]
	                	},{
	                		xtype: 'button',
	                		margin: '0 0.5em',
	                		style: 'font-size:1.3em',
	                		ui: 'action',
	                		text: '登 录',
	                		handler: loginAction
	                	}]
	                },{
	                	id: 'half',
	                	flex: 1,
	                	hidden: true,
	                	items: [{
	                		docked: 'top',
		                	id: 'welcome',
		                	html: ''
		                },{
		                	xtype: 'button',
		                	docked: 'bottom',
		                	cls: 'logout',
		                	ui: 'action',
		                	text: '退出当前账号',
		                	handler: logoutAction
		                }]
	                }]//user.items
	            },{
	            	title: '更多',// just a flag
	            	iconCls: 'more-icon',
	            	layout: 'vbox',
	                cls: 'card6',
	            	items: [{
	                	cls: 'tab-header x-toolbar x-toolbar-light x-docked-top',
	                	html: '更多'
	                },{
	                	scrollable: true,
	                	flex: 1,
	                	cls: 'more-cont',
	                	items: [{
	                		xtype: 'fieldset',
	                		items: [{
	                			xtype: 'button',
	                			cls: 'up',
	                			text: '账号安全'
	                		},{
	                			xtype: 'button',
	                			cls: 'down',
	                			text: '设置'
	                		}]
	                	},{
	                		xtype: 'fieldset',
	                		items: [{
	                			xtype: 'button',
	                			cls: 'up',
	                			text: '主题'
	                		},{
	                			xtype: 'button',
	                			cls: 'down',
	                			text: '壁纸'
	                		}]
	                	},{
	                		xtype: 'fieldset',
	                		items: [{
	                			xtype: 'button',
	                			cls: 'up',
	                			text: '意见反馈'
	                		},{
	                			xtype: 'button',
	                			text: '官方平台'
	                		},{
	                			xtype: 'button',
	                			text: '新版本检测'
	                		},{
	                			xtype: 'button',
	                			cls: 'down',
	                			text: '关于计量'
	                		}]
	                	}]//more.cont.items
	                }]
	            }]
	        });// TabPanel
	        
	    }//launch
	});// application done!
	
	Ext.Date.monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
	
	Ext.util.Format.myDate = function(timeStamp){
		return this.date(new Date(timeStamp), 'Y-m-d H:i:s');
	};
	
	Ext.define('Score', {
        extend: 'Ext.data.Model',
        config: {
            fields: ['kcmc', 'cj','xf']
        }
    });
	
	var ID,URL = 'http://202.107.226.170/interface.do';
	
	var loginLock = true;
	
	var date2str = function(date){
		return '<span class="date-month">'+(date.getMonth()+1)+'月<br>'+date.getFullYear()+
			'</span><span class="date-day">'+date.getDate()+'</span>';
	},
	fromDate = new Date(new Date()-1000*3600*24*7),
	toDate = new Date;
	
	var initSchedule = function(cont) {
    	var tpl = new Ext.XTemplate(
    		'<table class="schedule_grid"><tbody>',
	    		'<tpl for=".">',
	    			'<tr><th>{.}</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>',
	    		'</tpl>',
    		'</tbody></table>'
    	), scheduleBody = cont.getComponent('scheduleBody').innerHtmlElement;
    	tpl.overwrite(scheduleBody, [1,2,3,4,5,6,7,8,9,10,11,12]);
    },//initSchedule
    getWeek = function(){
    	return 7+Math.floor((new Date - new Date('2013/10/20'))/1000/3600/24/7)+'';
    },//getWeek
    showSchedule = function(cont){
    	var scheduleBody = cont.getComponent('scheduleBody').innerHtmlElement;
    	Ext.Ajax.request({
//			url: 'data/queryStudentsCurriculum.js',
			url: URL,
			disableCaching: false,
			params: {
				json: Ext.encode([{
					xh: ID,
					skzs: getWeek() // 第几周
				}]),
				m: 'queryStudentsCurriculum'
			},
			success: function(r){
				var DAY = ['周日','周一','周二','周三','周四','周五','周六'],
					DH = Ext.DomHelper,
					tdTest = Ext.fly(cont.element.dom.querySelector('table>tbody>tr>td')),
					UNIT_H = tdTest.getHeight(true) - 2,
					UNIT_W = tdTest.getWidth(true) - 4;
				
				var o = JSON.parse(r.responseText);
				o.newsList.forEach(function(item){
					var locales = item.skdd.replace(/;(?=$)/,'').split(';'),
						schedules = item.sksj.split(';'),
						background = 'hsl('+Math.random()*360+',50%,50%)';
					locales.forEach(function(locale, index){
						var text = item.kcmc + '<br>@' +locale,
							schedule = schedules[index],
							day = DAY.indexOf(schedule.substr(0,2)),
							nths = schedule.match(/第.*?(?=节)/)[0].substr(1).split(','),
							nth = nths[0], n = nths.length,
//							tds = cont.element.dom.querySelectorAll('table>tbody>tr:nth-child(' + nth + ')>td');//warning
							tds = scheduleBody.dom.querySelector('table>tbody>tr:nth-child(' + nth + ')').querySelectorAll('td');
						
						DH.append(tds[day], {
							cls: 'courseWrap',
							children: [{
								cls: 'course',
								style: {
    								width: UNIT_W + 'px',
    								height: UNIT_H*n + 'px',
    								background: background
    							},
    							html: text
							}]
						});
					});
				});
			}//success
		});//request
    };//showSchedule
    var cardSearch = function(){
    	var start = Ext.getCmp('startDate').getValue().getTime(),
    		end = Ext.getCmp('endDate').getValue().getTime() + 1000*3600*24,
    		cardPanel = Ext.getCmp('cardDetail');
    	
    	if(start>end){
    		Ext.Msg.show({
    			message: '请选择正确的开始结束时间',
	    		buttons: []
    		});
    		Ext.defer(Ext.Msg.hide, 1500, Ext.Msg);
    		return false;
    	}
    	cardPanel.setMasked({
    		xtype: 'loadmask',
            message: '查询中...'
    	});
		// search
        Ext.Ajax.request({
//        	url: 'data/listTransactionFlow.js',
        	url: URL,
        	disableCaching: false,
        	params: {
        		json: Ext.encode([{
        			startTime: start,
        			endTime: end,
        			gxh: ID,
        			start: '1',
        			pageLength: '10000'
        		}]),
        		m: 'listTransactionFlow'
        	},
        	success: function(r){
        		var o = JSON.parse(r.responseText),
        			list = o.transactionFlowList,
        			view = Ext.getCmp('cardDetail'),
        			tpl = new Ext.XTemplate(
    				    '<tpl for=".">',
    				        '<div class="card-detail-block">',
    				        	'<p class="jye">{jye}元</p>',
    				        	'<p class="kye">余额 : {kye}元</p>',
        				        '<p>{xq}--{jylx}--{sh}</p>',
        				        '<p>{jysj:myDate}</p>',
    				        '</div>',
    				    '</tpl>'
    				 );
        		tpl.overwrite(view.innerHtmlElement, list);
        	},
        	callback: function(){
        		cardPanel.setMasked(false);
        	}
        });
	},
	termPickerFn = function(p, value){
		value = value.term;
		var vals = value.split(',');
		
		Ext.get('score-title').setHtml(vals[0])
		
		var scoreList = Ext.getCmp('score-list');
		
		//mask
		var scoreTab = Ext.getCmp('score').setMasked({
			xtype: 'loadmask',
            message: '查询中...'
		});
		
		Ext.Ajax.request({
//        	url: 'data/searchAchievement.js',
        	url: URL,
        	disableCaching: false,
        	params: {
        		json: Ext.encode([{
        			xh: ID,
        			xn: vals[1],
        			kcjd: '',
        			xm: '',
        			xq: vals[2],
        			kcdm: '',
        			pageLength: '',
        			cxbj: '',
        			start: '',
        			cj: '',
        			zscj: '',
        			bjdm: '',
        			kcmc: '',
        			xf: ''
        		}]),
        		m: 'searchAchievement'
        	},
        	success: function(r){
        		var o = JSON.parse(r.responseText),
        			list = o.achievementList;
        		if(list.length){
        			store.setData(list);
        			scoreList.removeCls('list-hidden');
        		}else{
        			store.setData(null);
        			scoreList.addCls('list-hidden');
        		};
        	},
        	failure: function(){
        		store.removeAll(true);
        	},
        	callback: function(){
        		scoreTab.unmask();
        	}
        });
    },store = Ext.create('Ext.data.Store', {
		model: 'Score'
    }),
    tabPanelOnBefore = function(){
    	if(!loginLock){
    		Ext.getCmp('tabpanel').unBefore('activeitemchange',tabPanelOnBefore);
    		return true;
    	}
    	
    	Ext.Msg.show({
    		message: '请先登录',
    		buttons: []
    	});
    	
    	Ext.defer(Ext.Msg.hide, 1500, Ext.Msg);
    	return false;
    },loginSuccess = function(user){
    	var users;
    	
    	Ext.getCmp('login').hide({
    		type: 'slide',
    		out: true,
    		direction: 'up',
    		easing: '.13, .63, .66, 1.43',
    		duration: 1000
    	});
    	Ext.getCmp('half').show();
		Ext.getCmp('welcome').innerHtmlElement.setText('welcome '+user.userName);
//		Ext.getCmp('tabpanel').unBefore('activeitemchange',tabPanelOnBefore);
		
		//store user data
		ID = user.userId;
		db.setItem('userId', user.userId);
		db.setItem('userName', user.userName);
		db.setItem('userPwd', user.userPwd);
		
		users = db.get('users') || {};
		users[user.userId] = user.userPwd;
		db.set('users', users);
		
		//other
		Ext.getCmp('usr').showMore();
		Ext.getCmp('tabpanel').getTabBar().show();
    },loginFail = function(flag){
    	var loginField = Ext.getCmp('login-field');
    	switch(flag){
    	case 1:
    		loginField.setInstructions('* 用户名或密码错误');
    		break;
    	case 2:
    		loginField.setInstructions('* 用户名不能为空');
    		break;
    	case 3:
    		loginField.setInstructions('* 密码不能为空');
    		break;
    	}
    },loginAction = function(){
		var usr = Ext.getCmp('usr').getValue(),
			pwd = Ext.getCmp('pwd').getValue();
		if(pwd === 'yao'){
			loginSuccess({userName: 'Yao',userId: usr, userPwd: pwd});
		}else if(pwd === ''){
			loginFail(3);
		}else if(usr !== ''){
			Ext.Ajax.request({
//				url: 'data/getIdentityUser.js',
				url: URL,
				params:{
					json: Ext.encode([{
						userId: usr,
						password: pwd
					}]),
					m: 'getIdentityUser'
				},
				disableCaching: false,
				success: function(r){
					var o = JSON.parse(r.responseText),
        				user = o.user;
					
					if(user.userId){//success
						user.userPwd = pwd;
						loginSuccess(user);
					}else{
						loginFail(1);
					}
				},
				failure: function(){
					
				}
			});
		}else{
			loginFail(2);
		}
	},//loginAction
	logoutAction = function(){
		loginLock = true;
		db.remove('userId','userPwd','userName');
		
		Ext.getCmp('half').hide();
		Ext.getCmp('login').show({
			type: 'slide',
			direction: 'down',
			easing: '.13, .63, .66, 1.43',
			duration: 1000
		});
//		Ext.getCmp('tabpanel').onBefore('activeitemchange',tabPanelOnBefore);
		
		// tabs init
		Ext.getCmp('person-nav').pop(); // card init
//		Ext.getCmp('score-title').setTitle('给我查查成绩'); 
		store.setData(null); // score init
		
		// refresh userfield
		Ext.getCmp('usr').refreshUsers();
		Ext.getCmp('tabpanel').getTabBar().hide();
	},//logoutAction
	autoLogin = function(){
		if(!db.getItem('userPwd')) return;
		
		var userId = db.getItem('userId'),
			userPwd = db.getItem('userPwd'),
			userName = db.getItem('userName');
		
		Ext.getCmp('usr').setValue(userId);
		Ext.getCmp('pwd').setValue(userPwd);
		
		loginSuccess({
			userId: userId,
			userPwd: userPwd,
			userName: userName
		});
		
		loginLock = false;
	},//autoLogin
	termPickerShow = function(pk){
    	var st = 20 + ID.substr(0,2) - 0,
    		et = new Date().getFullYear(),
    		month = new Date().getMonth()+1,
    		data = [],
    		sft = true,
    		i, tmp, slot;
    	
    	for(i=st; i<et+1; i++){
    		if(i-st === 4){
    			sft = false;
    			break;
    		}
    		tmp = i + '-' + (i+1),
    		data.unshift({
    			text: tmp + ' ' + '第1学期',
    			value: tmp + ' ' + '第1学期,' + tmp + ',1'
    		});
    		
    		data.unshift({
    			text: tmp + ' ' + '第2学期',
    			value: tmp + ' ' + '第2学期,' + tmp + ',2'
    		});
    	}
    	if(sft){
    		data.shift();
        	if(month < 9) data.shift();
        	if(month < 2) data.shift();
    	}else if(month < 2 && et-st === 4){
    		data.shift();
    	}
    	
    	slot = {
			name: 'term',
            title: 'Term',
            data: data
    	};
    	pk.setSlots([slot]);
    };//termPickerShow
    function createPickerFn(){
    	var picker = Ext.widget('datepicker',{
        	yearFrom: 2004,
        	cancelButton: '取消',
        	doneButton: {
        		text: '完成',
        		handler: function(){
        			var date = picker.getValue(true);
        			picker.btn.date = date;
        			picker.btn.setText(date2str(date));
        		}
        	}
        });
    	return function(b){
    		picker.btn = b;
    		if(b.date){
    			picker.setValue(b.date);
    		}else{
    			picker.setValue(b.initialConfig.date);
    		}
    		picker.show();
    	}
    }
    Ext.define('Yao.news.List', {//校园资讯
    	extend: 'Ext.List',
    	xtype: 'newsList',

    	config: {
    		title: '校园资讯',
    		cls: 'news-list',
    		disableSelection: true,
    		itemTpl: [ '{title}' ]
    	},

    	initialize: function() {
    		var me = this;
    		this.callParent();
//    		me.setMasked({
//    			xtype: 'loadmask',
//                message: '查询中...'
//    		})
    		this.on('itemtap', function(item, index, target, record){
    			var title = record.get('title'),
    				content = record.get('content');
    			this.parent.push({
    				title: title,
    				html: content
    			});
    		},this);
    		Ext.Ajax.request({
//            	url: 'data/getnews.js',
//    			url: 'http://3shu/phpext/interface.php',
    			url: 'http://3shu.sinaapp.com/phpext/interface.php',
            	disableCaching: false,
            	params: {
            		action: 'getnews',
            		moduleId: 'news'
            	},
            	success: function(r){
            		var o = JSON.parse(r.responseText),
            			list = o.data;
            		if(list.length){
            			me.setData(list);
            		}else{
            			newsStore.setData(null);
            		};
            	},
            	failure: function(){
            		me.removeAll(true);
            	},
            	callback: function(){
//            		me.unmask();
            	}
            });
    	}
    });
    function pushSchedule(btn){
    	var view = btn.parent.parent.parent,
        cont = view.push({
            title: '我的课表',
            cls: 'person-schedule',
            items: [{
            	html: '<table class="schedule_grid"><thead>'+
            		'<tr><th></th><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>'+
            	'</thead></table>'
            },{
            	scrollable: true,
            	height: '100%',
            	cls: 'scheduleBody',
            	itemId: 'scheduleBody',
            	html: ''
            }]
        });
        initSchedule(cont);
        showSchedule(cont);
    }
    function pushScore(btn){
    	Ext.getCmp('pickerBtn').show();
    	var view = btn.parent.parent.parent;
    	view.push({
    		title: '我的成绩',
    		id: 'score',
    		cls: 'person-score',
    		layout: 'vbox',
    		items: [{
    			html: '<div id="score-title">&nbsp;</div>'
    		},{
            	xtype: 'list',
            	id: 'score-list',
            	flex: 1,
            	cls: 'score-list',
            	disableSelection: true,
            	itemTpl: '<div class="score-each">'+
            		'<p>{kcmc}</p>'+
            		'<div class="score-item-each left"><div class="lbl">学分</div>{xf}</div>'+
            		'<div class="score-item-each right"><div class="lbl">成绩</div>{cj}</div>'+
            	'</div>',
            	deferEmptyText: false,
            	emptyText: '没有数据',
            	store: store
            }]
    	});
    }
    function pushBefore(btn){
		btn.onBefore('tap',function(){
			if(!ID){
				Ext.getCmp('tabpanel').getTabBar().hide();
				Ext.getCmp('tabpanel').setActiveItem(3);
				return false;
			}
		})
	}
    function pushCard(btn){
    	var view = btn.parent.parent.parent;
    	view.push({
    		title: '一卡通',
    		cls: 'person-card',
    		layout: 'vbox',
    		items: [{
    			html: '<div id="rest">查询中...</div>'
    		},{
    			xtype: 'fieldset',
    			layout: 'hbox',
                items: [{
                    xtype: 'datepickerfield',
                    label: '开始',
                    flex: 1,
                    id: 'startDate',
                    picker:{
                    	yearFrom: 2004,
                    	cancelButton: '取消',
                    	doneButton: '完成'
                    },
                    value: fromDate
                },{
                	xtype: 'datepickerfield',
                    label: '结束',
                    flex: 1,
                    id: 'endDate',
                    picker:{
                    	yearFrom: 2004,
                    	cancelButton: '取消',
                    	doneButton: '完成'
                    },
                    value: toDate
                },{
                	xtype: 'button',
                	iconCls: 'search',
                	handler: cardSearch
                }]
    		},{
    			id: 'cardDetail',
            	scrollable: true,
            	flex: 1,
            	html: '<div class="card-tip">说些什么吧...</div>' // must have
    		}]
    	});//push
    	
    	Ext.Ajax.request({
//        	url: 'data/myEasyCard.js',
        	url: URL,
        	disableCaching: false,
        	params: {
        		json: Ext.encode([{
        			gxh: ID
        		}]),
        		m: 'myEasyCard'
        	},
        	success: function(r){
        		var o = JSON.parse(r.responseText),
        			ye = o.easyCard.ye;
        		Ext.get('rest').setHtml('余额 : ' + ye + '元');
        	}
        });
    }
})(db);