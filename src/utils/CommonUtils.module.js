/************************************************
 * common.module.js
 * Created at 2021. 8. 13. 오전 8:13:18.
 *
 * @author Miracom
 ************************************************/

/**
 * CommonUtils class
 * @class
 */
var CommonUtils = {}

/**
 * alert창을 띄운다.
 * @param {cpr.core.AppInstance} 현재 앱인스턴스
 * @param {String} title 타이틀
 * @param {String} msg 메시지
 * @param {()=>void} okCallbackFn 확인버튼 클릭 시 콜백함수
 * @example
 * aaaaaa
 * 
 * 
 */
CommonUtils.alert = function(app, title, msg, okCallbackFn) {
	this.showMsg(app, "alert", title, msg, okCallbackFn);
};

/**
 * confirm창을 띄운다.
 * @param {cpr.core.AppInstance} 현재 앱인스턴스
 * @param {String} title 타이틀
 * @param {String} msg 메시지
 * @param {()=>void} okCallbackFn 확인버튼 클릭 시 콜백함수
 * @param {()=>void} cancleCallbackFn 취소버튼 클릭 시 콜백함수
 */
CommonUtils.confirm = function(app, title, msg, okCallbackFn, cancleCallbackFn) {
	this.showMsg(app, "confirm", title, msg, okCallbackFn, cancleCallbackFn);
};

/**
 * type에 해당하는 메시지를 띄웁니다.
 * @param {cpr.core.AppInstance} 현재 앱인스턴스
 * @param {String} type 메시지 타입(confirm, alert);
 * @param {String} title 타이틀
 * @param {String} msg 메시지
 * @param {()=>void} okCallbackFn 확인버튼 클릭 시 콜백함수
 * @param {()=>void} cancleCallbackFn 취소버튼 클릭 시 콜백함수
 */
CommonUtils.showMsg = function(app, type, title, msg, okCallbackFn, cancleCallbackFn) {
	var showConstraint = {
		"position": "absolute",
		"top": "0",
		"bottom": "0",
		"left": "0",
		"right": "0"
	};
	
	/** @type cpr.controls.UDCBase */
	var msgUdc = null;
	
	if (type === "alert") {
		msgUdc = new udc.MrcAlert.MrcAlert("___alert___");
		msgUdc.addEventListenerOnce("close", function() {
			msgUdc.dispose();
		});
		
		if (okCallbackFn) {
			msgUdc.addEventListenerOnce("close", okCallbackFn);
		}
	} else if (type === "confirm") {
		msgUdc = new udc.MrcConfirm.MrcConfirm("___confirm___");
		msgUdc.addEventListenerOnce("cancel", function() {
			msgUdc.dispose();
		});
		msgUdc.addEventListenerOnce("confirm", function() {
			msgUdc.dispose();
		});
		
		if (okCallbackFn) {
			msgUdc.addEventListenerOnce("confirm", okCallbackFn);
		}
		if (cancleCallbackFn) {
			msgUdc.addEventListenerOnce("cancel", cancleCallbackFn);
		}
	}
	
	// 메시지 내용을 복사 
	if (title) msgUdc.setMsgTitle(title);
	if (msg) msgUdc.setMsgText(msg);
	msgUdc.style.css(showConstraint);
	msgUdc.visible = true;
	
	app.getRootAppInstance().floatControl(msgUdc);
}

/**
 * 요청 값이 값이 없는지 결과를 반환. 
 * 요청 값이 문자열인 경우, null, undefined, "" (값없음 or 공백) 이면 true, 그 외는 false를 반환
 * 요청 값이 배열인 경우, length가 0이면 true, 그 외에는 false르 반환
 * 요청 값이 object인 경우, null, undefined인 경우 true, 그 외는 false를 반환
 * @param {any} target 
 */
CommonUtils.isNullOrEmpty = function(target) {
	var result = false;
	
	if (target == null) {
		result = true;
	} else if (typeof target === 'string' || target instanceof String) {
		if (target.trim() === "") {
			result = true;
		}
	} else if (typeof target === 'array') {
		if (target.length === 0) {
			result = true;
		}
	} else if (typeof target === 'object') {
		//Do Nothing
	} else {
		throw new Error('Types other than string, array, and object are not supported.');
	}
	
	return result;
}

exports.CommonUtils = CommonUtils;

var Intl = function() {
	var _isInitialized = false;
	
	return {
		init: function() {
			var MES_I18N_SAMPLE = cpr.core.Module.require("config/MES_I18N_SAMPLE").MES_I18N_SAMPLE;
            var i18n = new MES_I18N_SAMPLE();
            
			if (_isInitialized) {
				return;
			}
			
			i18n.loadI18nData(function() {
				_isInitialized = true;
			});
		},
		get: function(code, params) {
			var localeCode = null;
			
			if (CommonUtils.isNullOrEmpty(code)) {
				console.error("[code] is empty.");
				return null;
			} else if (typeof code !== "string") {
				console.error("[code] is not string.");
				return null;
			} else {
				if (cpr.I18N.INSTANCE.message(code.toUpperCase())) {
					localeCode = cpr.I18N.INSTANCE.message(code.toUpperCase(), params);
					
					/* TODO 현재 저장된 다국어의 변수 적용 형식이 맞지 않아서 아래의 로직으로 일단 대체 */
					if (params) {
						for (var key in params) {
							var regex = new RegExp("\\{" + key + "\\}", "g");
							localeCode = localeCode.replace(regex, params[key]);
						}
					}
				}
			}
			
			if (!localeCode) {
				localeCode = code;
				console.info("Does not exist multilingual information abount [" + code + "]");
			}
			return localeCode;
		}
	}
}();

globals.Intl = Intl;

cpr.expression.ExpressionEngine.INSTANCE.registerConstant("Intl", globals.Intl);

// 다국어 및 버튼 권한 처리
cpr.events.EventBus.INSTANCE.addFilter("init", function(e) {
	var control = e.control;
	var vcContainer;
	var vaChildren;
	var i;
	var idx;
	var each;
	var disableTranslate;
	var vcGrid;
	var vnColCount;
	var voColumn;
	var vnFCellCount;
	var vcFooter;
	var compiledExpr;
	var items;
	
	if (control instanceof cpr.core.AppInstance) {
		globals.Intl.init();
		vcContainer = control.getContainer();
		
		vaChildren = vcContainer.getAllRecursiveChildren().filter(function(each) {
			var check = false;
			
			if (each instanceof cpr.controls.Output ||
				each instanceof cpr.controls.Button ||
				each instanceof cpr.controls.Grid ||
				each instanceof cpr.controls.CheckBox ||
				each instanceof cpr.controls.CheckBoxGroup ||
				each instanceof cpr.controls.RadioButton ||
				each instanceof cpr.controls.TabFolder ||
				each instanceof cpr.controls.InputBox) {
				check = true;
			}
			
			return check;
		});
		
		for (idx = 0; idx < vaChildren.length; idx++) {
			each = vaChildren[idx];
			
			disableTranslate = each.userAttr("disableTranslate");
			if (disableTranslate == true) {
				console.log("disableTranslate");
				continue;
			}
			
			if (each instanceof cpr.controls.Grid) {				
				vcGrid = each;
				vnColCount = vcGrid.header.cellCount;
				for (i = 0; i < vnColCount; i++) {
					voColumn = vcGrid.header.getColumn(i);
					if (!CommonUtils.isNullOrEmpty(voColumn.getText())) {
						voColumn.setText(globals.Intl.get(voColumn.getText()));
					}
				}
				
				if (vcGrid.hasFooter()) {
					vnFCellCount = vcGrid.footer.cellCount;
					
					for (i = 0; i < vnFCellCount; i++) {
						
						vcFooter = vcGrid.footer.getColumn(i);
						compiledExpr = new cpr.expression.Expression(vcFooter.expr).evaluate();
						
						if (!CommonUtils.isNullOrEmpty(compiledExpr)) {
							vcFooter.expr = "'" + globals.Intl.get(compiledExpr) + "'";
						}
					}
				}
			} else if (each instanceof cpr.controls.CheckBox) {
				if (!CommonUtils.isNullOrEmpty(each.text)) {
					each.text = globals.Intl.get(each.text);
				}
			} else if (each instanceof cpr.controls.InputBox) {
				if (!CommonUtils.isNullOrEmpty(each.placeholder)) {
					each.placeholder = globals.Intl.get(each.placeholder);
				}
			} else if ("getItems" in each) {
				/** @type Array */
				items = each.getItems();
				items.forEach(function( /** cpr.controls.Item*/ item) {
					item.label = globals.Intl.get(item.label);
				});
			} else if ("getTabItems" in each) {
				/** @type Array */
				items = each.getTabItems();
				items.forEach(function( /** cpr.controls.TabItem*/ item) {
					item.text = globals.Intl.get(item.text);
				});
			} else {
				if (!CommonUtils.isNullOrEmpty(each.value)) {
					each.value = globals.Intl.get(each.value);
				}
				// TODO 권한처리는 아직
				//				if (each instanceof cpr.controls.Button && control.app && control.app.authInfo) {
				//					if (each.id in control.app.authInfo) {
				//						each.enabled = control.app.authInfo[each.id];
				//					}
				//				}
			}
			
			//});
		}
	}
});


/***************************************************************************
 * 
 * @function inherit
 * 
 * @param {any} Child	상속을 받는 자식 클래스
 * @param {any} Parent	상속을 받을 부모 클래스
 * 
 * @description
 * 객체들의 상속 관계의 정의를 위한 라이브러리 입니다.
 * proxy constructor pattern
 * 
 * @example
 * 
 * var Child = function(arg) {}	// class
 * Child.prototype.function = () {	// method
 *   console.log("parent function call" + this.name)
 * }
 *  
 * var Parent = function(arg) {
 *   this.name = arg;	// member variable
 * }
 * 
 * 
 * inherit(Child, Parent);
 * 
 * var c = new Child("abc");
 * c.function();	// parent function call abc 출력
 * 
 */
CommonUtils.inherit = function (Child, Parent) {
	var F = function() {};
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.uber = Parent.prototype;
	Child.prototype.constructor = Child;
}