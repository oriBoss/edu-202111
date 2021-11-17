/************************************************
 * SubmissionTest.js
 * Created at 2021. 11. 17. 오전 11:20:14.
 *
 * @author kimks
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
	var response = JSON.parse(smsGetFunction.xhr.responseText) //json 텍스트로 응답받은 데이터 - json으로 변환
	var dmFunction = app.lookup("dmFunction");
	var ipbFuncCode = app.lookup("ipbFuncCode");
	var ipbFuncDesc = app.lookup("ipbFuncDesc");
	
	console.log(response);
	
	dmFunction.build(response); //데이터맵으로 매핑
	
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
	var index = e.newSelection[0]; //선택된 행의 인덱스
	var dsFunctionsList = app.lookup("dsFunctionsList");
	var funcCode = dsFunctionsList.getValue(index, "funcCode");
	var smsGetFunction = app.lookup("smsGetFunction"); //서브미션가져옴
	
	//url 
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
	//키 값 감싸진 것 제거(가공), data-요청데이터
	/*
	 * data: {
				data: {
					dmFunction: {
						funcCode: "",
						funcDesc: ""
					}
				}
			}
	 */
	smsPostFunctions.setRequestEncoder(function(api, data) {
		return {
			content: data["data"]["dmFunction"],
			
		}
	});
	
	smsPostFunctions.send();
	
}
