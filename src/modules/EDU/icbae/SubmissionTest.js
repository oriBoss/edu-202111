/************************************************
 * SubmissionTest.js
 * Created at 2021. 11. 17. 오전 11:19:12.
 *
 * @author student
 ************************************************/

var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/*
 * "Button" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSmsGetFunctionSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var smsGetFunction = e.control;
	var response = JSON.parse(smsGetFunction.xhr.responseText);
	var dmFunction = app.lookup("dmFunction");
	var ipbFuncCode = app.lookup("ipbFuncCode");
	var ipbFuncDesc = app.lookup("ipbFuncDesc");
	
	console.log(response);
	
	dmFunction.build(response);

	ipbFuncCode.redraw();
	ipbFuncDesc.redraw();
}


/*
 * 그리드에서 selection-change 이벤트 발생 시 호출.
 * detail의 cell 클릭하여 설정된 selectionunit에 해당되는 단위가 선택될 때 발생하는 이벤트.
 */
function onGrd1SelectionChange(/* cpr.events.CSelectionEvent */ e){
	/** 
	 * @type cpr.controls.Grid
	 */
	var grd1 = e.control;
	var index = e.newSelection[0];
	var dsFunctionList = app.lookup("dsFunctionList");
	var funcCode = dsFunctionList.getValue(index, "funcCode");
	var smsGetFunction = app.lookup("smsGetFunction");
	
	smsGetFunction.action = ServiceUrls.ADM_SERVICE_URL + "functions/" + funcCode;
	smsGetFunction.send();
	
	
}


/*
 * "저장" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	var smsPostFunctions = app.lookup("smsPostFunctions");
	var dmFunction = app.lookup("dmFunction");
	var funcCode = dmFunction.getValue("funcCode");
	
	//smsPostFunctions.action = ServiceUrls.ADM_SERVICE_URL + "functions/" + funcCode;
	
	smsPostFunctions.setRequestEncoder(function(api, data) {
		return {
			content: data["data"]["dmFunction"]
		}
	});
	
	smsPostFunctions.send();
}
