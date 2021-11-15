/************************************************
 * control.module.js
 * Created at 2021. 8. 13. 오전 9:25:09.
 *
 * @author Miracom
 ************************************************/

module.depends("utils/CommonUtils");
var CommonUtils = cpr.core.Module.require("utils/CommonUtils").CommonUtils;

var ControlUtils = {};

/**
 * 지정한 컨트롤의 Visible 속성을 설정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {Boolean} pbVisible 컨트롤 숨김 여부
 * @param {#uicontrol | Array} paCtlId 컨트롤 ID 또는 ID 배열
 * @return void
 */
ControlUtils.setVisible = function(app, pbVisible, paCtlId) {
	var i;
	var len;
	
	if (!(paCtlId instanceof Array)) {
		paCtlId = [paCtlId];
	}
	
	if (typeof(pbVisible) != "boolean") {
		pbVisible = Boolean(pbVisible);
	}
	
	for (i = 0, len = paCtlId.length; i < len; i++) {
		app.lookup(paCtlId[i]).visible = pbVisible;
	}
};

/**
 * 지정한 컨트롤의 Enable 속성을 설정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {Boolean} pbEnable 컨트롤 활성화 여부
 * @param {#uicontrol | Array} paCtlId 컨트롤 ID 또는 ID 배열
 * @return void
 */
ControlUtils.setEnable = function(app, pbEnable, paCtlId) {
	var ctrl;
	var i;
	var len;
	
	if (!(paCtlId instanceof Array)) {
		paCtlId = [paCtlId];
	}
	if (typeof(pbEnable) != "boolean") {
		pbEnable = Boolean(pbEnable);
	}
	
	for (i = 0, len = paCtlId.length; i < len; i++) {
		ctrl = app.lookup(paCtlId[i]);
		if (ctrl) ctrl.enabled = pbEnable;
	}
};

/**
 * 지정한 컨트롤의 ReadOnly 속성을 설정한다.<br>
 * 만약, 해당 컨트롤에 readonly이 없을경우 enable 속성으로 제어된다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {Boolean} 		pbReadOnly  컨트롤 readOnly 여부
 * @param {#uicontrol | Array} paCtlId 컨트롤 ID 또는 ID 배열
 * @return void
 */
ControlUtils.setReadOnly = function(app, pbReadOnly, paCtlId) {
	var i;
	var len;
	var voCtrl;
	
	if (!(paCtlId instanceof Array)) {
		paCtlId = [paCtlId];
	}
	
	for (i = 0, len = paCtlId.length; i < len; i++) {
		voCtrl = app.lookup(paCtlId[i]);
		if (voCtrl == null || "undefined" == voCtrl) continue;
		
		if (voCtrl.readOnly !== undefined) {
			voCtrl.readOnly = pbReadOnly;
		} else {
			this.setEnable(app, !pbReadOnly, paCtlId[i]);
		}
	}
};

/**
 * 컨트롤의 지정된 사용자 정의 속성(userattr) 반환한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 	  컨트롤 ID
 * @param {String} psAttrName  속성
 * @return {String} 속성값
 */
ControlUtils.getUserAttr = function(app, psCtlId, psAttrName) {
	return app.lookup(psCtlId).userAttr(psAttrName);
};

/**
 * 컨트롤의 지정된 사용자 정의 속성(userattr)의 값을 설정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 	   컨트롤 ID
 * @param {String} psAttrName  속성
 * @param {String} psAttrValue 속성값
 * @return void
 */
ControlUtils.setUserAttr = function(app, psCtlId, psAttrName, psAttrValue) {
	var ctrl = app.lookup(psCtlId);
	var userAttr = ctrl.userAttr();
	
	userAttr[psAttrName] = psAttrValue;
};

/**
 * 컨트롤를 포커스(focus) 한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 	   컨트롤 ID
 */
ControlUtils.setFocus = function(app, psCtlId) {
	var ctrl = app.lookup(psCtlId);
	var focused = false;
	var embApp;
	
	if (ctrl instanceof cpr.controls.UDCBase) {
		embApp = ctrl.getEmbeddedAppInstance();
		embApp.getContainer().getChildren().some(function(embCtrl) {
			if (embCtrl.getBindInfo("value") && embCtrl.getBindInfo("value").property == "value") {
				embCtrl.focus();
				focused = true;
				return true;
			}
		});
		
		if (focused !== true) {
			app.focus(ctrl);
		}
	} else {
		app.focus(ctrl);
	}
}

/**
 * 특정 컨트롤의 자료를 갱신하고 다시 그린다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol | Array} paCtlId 일반 컨트롤 및 그리드 컨트롤 ID
 * @return void
 */
ControlUtils.redraw = function(app, paCtlId) {
	var i;
	var len;
	var vcCtrl;
	
	if (!(paCtlId instanceof Array)) {
		paCtlId = [paCtlId];
	}
	for (i = 0, len = paCtlId.length; i < len; i++) {
		vcCtrl = app.lookup(paCtlId[i]);
		if (vcCtrl) vcCtrl.redraw();
	}
};

/**
 * 컨트롤의 지정된 style 속성 값을 가져옵니다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤 ID
 * @param {String} psAttrName style 속성명
 * @return {String} style 속성값
 */
ControlUtils.getStyleAttr = function(app, psCtlId, psAttrName) {
	/**@type cpr.controls.UIControl*/
	var vcCtrl = app.lookup(psCtlId);
	
	return vcCtrl.style.css(psAttrName);
};

/**
 * 컨트롤의 지정된 style 속성값을 설정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤 ID
 * @param {String} psAttrName 속성
 * @param {String} psAttrValue 속성값
 * @return void
 */
ControlUtils.setStyleAttr = function(app, psCtlId, psAttrName, psAttrValue) {
	/**@type cpr.controls.UIControl*/
	var vcCtrl = app.lookup(psCtlId);
	
	return vcCtrl.style.css(psAttrName, psAttrValue);
};

/**
 * 컨트롤이 실제 그려진 사이즈를 리턴합니다.<br>
 * 컨트롤이 화면에 그려지지 않은 상태인 경우는 모든 값이 0인 객체가 리턴됩니다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId  컨트롤 ID
 * @param {String} psPosition 구하고자하는 위치 및 크기 정보<br>(width, height, left, top, bottom, right)
 * @return {Interface{width: Number, height: Number, left: Number, top: Number, bottom: Number, right: Number}} HTML DOM에서의 컨트롤의 위치 및 크기 정보
 */
ControlUtils.getActualRectPosition = function(app, psCtlId, psPosition) {
	/** @type cpr.controls.UIControl */
	var vcCtrl = app.lookup(psCtlId);
	var voActRec = vcCtrl.getActualRect();
	
	return voActRec[psPosition];
};

/**
 * 해당 컨트롤의 제약 조건을 반환합니다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 반환하고자 하는 컨트롤 ID
 * @param {String} psParentGrp? 상위 컨트롤 그룹내 컨트롤의 제약 조건을 구할시 사용
 * @return {cpr.controls.layouts.Constraint} 해당하는 제약조건
 */
ControlUtils.getConstraint = function(app, psCtlId, psParentGrp) {
	var ctrl = app.lookup(psCtlId);
	var container;
	
	if (!CommonUtils.isNullOrEmpty(psParentGrp)) {
		container = app.lookup(psParentGrp);
	} else {
		container = app.getContainer();
	}
	
	return container.getConstraint(ctrl);
};

/**
 * 컨트롤의 지정된 제약 조건(constraint)을 변경합니다.<br>
 * 타겟 컨트롤에서 부모 컨트롤과의 연계된 위치를 변경합니다.<br>
 * parameter의 constraints가 포함한 항목만 변경합니다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤의 ID
 * @param {#container} psParentGrpId 상위 컨트롤의 ID (app의 container일 경우 null)
 * @param {Object} poConstraint 제약조건<br>
 * 					상위 컨트롤의 레이아웃이 formlayout일 경우 rowIndex, colIndex 를 반드시 포함한 조건을 설정하여야합니다.
 * @return {Boolean} 성공여부
 */
ControlUtils.updateConstraint = function(app, psCtlId, psParentGrpId, poConstraint) {
	/** @type cpr.controls.UIControl */
	var vcChild = app.lookup(psCtlId);
	/** @type cpr.controls.Container */
	var voContainer = null;
	var voConstraint = null;
	var voLayout;
	var voSrcConstraint;
	
	if (vcChild == null) return false;
	
	if (!CommonUtils.isNullOrEmpty(psParentGrpId)) {
		voContainer = app.lookup(psParentGrpId);
	} else {
		voContainer = app.getContainer();
	}
	
	voLayout = voContainer.getLayout();
	if (voLayout instanceof cpr.controls.layouts.ResponsiveXYLayout) {
		voSrcConstraint = voContainer.getConstraint(vcChild)["positions"][0];
		voConstraint = {
			positions: [Object.assign(voSrcConstraint, poConstraint)]
		}
	} else {
		voConstraint = poConstraint;
	}
	
	return voContainer.updateConstraint(vcChild, voConstraint);
};

/**
 * 해당 컨트롤의 이벤트를 발생시킨다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤의 ID
 * @param {String} psEventType 이벤트명(ex-click)
 */
ControlUtils.dispatchEvent = function(app, psCtlId, psEventType) {
	var vcCtrl = app.lookup(psCtlId);
	
	if (vcCtrl) {
		vcCtrl.dispatchEvent(new cpr.events.CEvent(psEventType));
	}
};

/**
 * 지정한 컨트롤의 value를 지정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤 ID
 * @param {String} psValue 값
 * @param {Boolean} pbEmitEvent? 값 변경후의 before-value-change, value-change 이벤트 발생시킬지 여부<br/>
 *                  만약 값만 바꾸고, 이벤트 발생은 일어나지 않도록 하는 경우에만 false로 지정
 * @return void
 */
ControlUtils.setValue = function(app, psCtlId, psValue, pbEmitEvent) {
	var ctrl = app.lookup(psCtlId);
	
	if (pbEmitEvent === false && ctrl.putValue != undefined) {
		ctrl.putValue(psValue);
	} else {
		ctrl.value = psValue;
	}
};

/**
 * @desc 지정한 컨트롤의 value를 취득한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤 ID
 * @return void
 */
ControlUtils.getValue = function(app, psCtlId) {
	return app.lookup(psCtlId).value;
};

/**
 * @desc 지정한 컨트롤의 value를 취득한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId 컨트롤 ID
 * @param {String} psProperty 컨트롤 속성명
 * @return void
 */
ControlUtils.getProperty = function(app, psCtlId, psProperty) {
	var control = app.lookup(psCtlId);
	var value = null;
	
	if (!control) {
		throw "[" + psCtlId + "]" + " component does not exist.";
	}
	
	if (psProperty in control) {
		value = app.lookup(psCtlId)[psProperty];
	} else if (psProperty in control.userAttr()) {
		value = control.userAttr(psProperty);
	} else {
		throw "[" + psCtlId + "]" + " does not have [" + psProperty + "] property.";
	}
	
	return value;
};

/**
 * @desc 지정한 컨트롤의 프로퍼티 값을 설정한다.
 * @param {cpr.core.AppInstance} app 앱인스턴스
 * @param {#uicontrol} psCtlId
 * @param {String} psProperty
 * @param {Object} poValue
 */
ControlUtils.setProperty = function(app, psCtlId, psProperty, poValue) {
	var control = app.lookup(psCtlId);
	
	if (!control) {
		throw "[" + psCtlId + "]" + " component does not exist.";
	}
	
	if (psProperty in control) {
		app.lookup(psCtlId)[psProperty] = poValue;
	} else if (psProperty in control.userAttr()) {
		control.userAttr(psProperty, String(poValue));
	} else {
		throw "[" + psCtlId + "]" + " does not have [" + psProperty + "] property.";
	}
}

/**
 * UDC 컨트롤에 대해 value 앱 속성에 바인딩된 컨트롤 객체를 반환한다.
 * @param {cpr.controls.UDCBase} poCtrl
 * @return {object} 컨트롤 객체
 */
ControlUtils.getValueControl = function(poCtrl) {
	var vcBindCtrl = poCtrl;
	var embApp = poCtrl.getEmbeddedAppInstance();
	
	embApp.getContainer().getChildren().some(function(embCtrl) {
		if (embCtrl.type == "container") {
			embCtrl.getChildren().some(function(subembCtrl) {
				if (subembCtrl.getBindInfo("value") && subembCtrl.getBindInfo("value").property == "value") {
					vcBindCtrl = subembCtrl;
					return true;
				}
			});
		} else {
			if (embCtrl.getBindInfo("value") && embCtrl.getBindInfo("value").property == "value") {
				vcBindCtrl = embCtrl;
				return true;
			}
		}
	});
	
	return vcBindCtrl;
}

/**
 * 그룹 컨트롤내의 자식 컨트롤 목록을 반환한다.
 * @param {cpr.controls.Container} pcGroup 그룹컨트롤
 * @private
 */
ControlUtils.getChildren = function(pcGroup) {
	var children = pcGroup.getAllRecursiveChildren();
	
	function getNextControls(each, children) {
		var order = [each];
		var next = each;
		while (next != null) {
			next = next.getNextControl();
			if (next != null && children.indexOf(next) > -1 && order.indexOf(next) == -1) order.push(next);
			else next = null;
		}
		return order;
	}
	
	var orderCtrls = [];
	children.forEach(function(each) {
		if (children.indexOf(each.getPrevControl()) == -1 && each.getNextControl() != null) {
			orderCtrls = getNextControls(each, children);
		}
	});
	
	var etcCtrls = [];
	children.forEach(function(each) {
		if (orderCtrls.indexOf(each) == -1) {
			etcCtrls.push(each);
		}
	});
	
	return orderCtrls.concat(etcCtrls);
};

exports.ControlUtils = ControlUtils;

/**
 * Keyboard 이벤트.
 * 키보드 이벤트를 생성합니다.
 * @param {String} type 이벤트 유형.
 * @param {cpr.events.CKeyboardEvent} e Base Event
 */
function MrcKeyboardEvent(type, e) {
	var _this = this;
	cpr.events.CUIEvent.call(this, [type]);
	this._supportKeys.forEach(function(each){
		_this[each] = e[each];
	});
//	for (var key in e) {
//		debugger;
//		if (this._supportKeys.indexOf(key) > -1) {
//			this[key] = e[key];
//		}
//	}
};

MrcKeyboardEvent.prototype = Object.create(cpr.events.CUIEvent.prototype);

MrcKeyboardEvent.prototype._supportKeys = [
	"altKey",
	"char",
	"charCode",
	"ctrlKey",
	"key",
	"keyCode",
	"locale",
	"location",
	"shiftKey",
	"code"
]
/**
 * 이벤트가 발생했을 때 왼쪽 또는 오른쪽 Alt 키가 눌려 졌는지 여부를 나타내는 부울 값을 검색합니다.
 * @type {Boolean}
 */
MrcKeyboardEvent.prototype.altKey = new Boolean();

/**
 * 사용자가 누른 키의 문자를 반환합니다.
 * @type {String}
 */
MrcKeyboardEvent.prototype.char = new String();

/**
 * keypress 이벤트 발생 시 눌려진 문자 키의 유니코드 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.charCode = new Number();

/**
 * 컨트롤 키가 눌려 졌는지 (true) 또는 표시되어 있지 않은지 (false) 나타내는 부울을 반환합니다.
 * @type {Boolean}
 */
MrcKeyboardEvent.prototype.ctrlKey = new Boolean();

/**
 * 사용자가 누른 키 또는 키의 값을 반환합니다.
 * @type {String}
 */
MrcKeyboardEvent.prototype.key = new String();

/**
 * 사용자가 누른 키의 유니코드 문자 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.keyCode = new Number();

/**
 * 이벤트의 언어코드 값을 반환합니다.
 * @type {String}
 */
MrcKeyboardEvent.prototype.locale = new String();

/**
 * 키의 위치 값을 반환합니다.<br>
 * standard=0, left=1, right=2, numpad=3, mobile=4, joystick=5
 * @type {Number}
 */
MrcKeyboardEvent.prototype.location = new Number();

/**
 * 이벤트가 발생했을 때 메타 키가 눌려 졌는지 (true) 또는 표시되어 있지 않은지 (false)를 나타내는 Boolean을 반환
 * @type {Boolean}
 */
MrcKeyboardEvent.prototype.metaKey = new Boolean();

/**
 * 키가 자동으로 반복되도록 길게 눌러져 있으면 true 아니면 false를 반환합니다.
 * @type {Boolean}
 */
MrcKeyboardEvent.prototype.repeat = new Boolean();

/**
 * 이벤트가 발생할 때 shift 키가 눌 렸는지 (true) 또는 (false)를 나타냅니다.
 * @type {Boolean}
 */
MrcKeyboardEvent.prototype.shiftKey = new Boolean();

/**
 * 누른 키의 숫자 키 코드 또는 영숫자 키의 문자 코드를 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.which = new Number();

/**
 * 키보드의 실제 키 코드를 반환합니다.
 * @type {String}
 */
MrcKeyboardEvent.prototype.code = new String();

/**
 * 키보드의 왼쪽에 있는 키의 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.DOM_KEY_LOCATION_LEFT = new Number();

/**
 * 숫자 키패드 키의 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.DOM_KEY_LOCATION_NUMPAD = new Number();

/**
 * 키보드의 오른쪽에 있는 키의 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.DOM_KEY_LOCATION_RIGHT = new Number();

/**
 * 키보드에서 방향을 구별하지 않는 키의 값을 반환합니다.
 * @type {Number}
 */
MrcKeyboardEvent.prototype.DOM_KEY_LOCATION_STANDARD = new Number();

/**
 * 지정된 객체의 현재 상태를 반환합니다.
 * @param {String} keyArg 지정된 객체 명.
 * @return {Boolean} 지정된 객체의 현재 상태.
 */
MrcKeyboardEvent.prototype.getModifierState = function(keyArg) {};

globals.MrcKeyboardEvent = MrcKeyboardEvent;