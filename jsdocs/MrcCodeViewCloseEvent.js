/**
 * MrcCalendar 컴포넌트의 cellClick Event
 * @param {String} type 이벤트 유형
 * @param {cpr.events.CUIEventOptions} options? 이벤트 옵션
 */
var MrcCodeViewCloseEvent = function(type, options){};
MrcCodeViewCloseEvent.prototype = new cpr.events.CEvent();

/**
 * <b>read-only</b>
 * 클릭한 날짜 컴포넌트 객체를 반환합니다.
 * @type {cpr.controls.UDCBase}
 */
MrcCodeViewCloseEvent.prototype.cellControl = new cpr.controls.UDCBase();

/**
 * <b>read-only</b>
 * 선택한 코드 값을 반환합니다.
 * @type {String}
 */
MrcCodeViewCloseEvent.prototype.value = "";

/**
 * <b>read-only</b>
 * 선택한 코드의 설명 값을 반환합니다.
 * @type {String}
 */
MrcCodeViewCloseEvent.prototype.desc = "";