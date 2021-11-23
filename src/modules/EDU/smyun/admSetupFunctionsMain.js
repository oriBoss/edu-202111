/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 22. 오전 11:36:41.
 *
 * @author ysm13
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls=cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */



/**
 * 이벤트 처리 영역
 */


/*
 * "조회" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
	
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb1Keyup(/* cpr.events.CKeyboardEvent */ e){
	
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		var smsGetFunctions = app.lookup("smsGetFunctions");
		smsGetFunctions.send();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb2Keyup(/* cpr.events.CKeyboardEvent */ e){
		
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		var smsGetFunctions = app.lookup("smsGetFunctions");
		smsGetFunctions.send();
	}
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb3Keyup(/* cpr.events.CKeyboardEvent */ e){
	
	if (e.keyCode === cpr.events.KeyCode.ENTER) {
		var smsGetFunctions = app.lookup("smsGetFunctions");
		smsGetFunctions.send();
	}
}


/*
 * "초기화" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	
	var control = app.lookup("smsGetFunctions");
	
}

var clickRowID;
/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick(/* cpr.events.CGridMouseEvent */ e){
	/** 
	 * @type cpr.controls.Grid
	 */
	var grd1 = e.control;
	
	clickRowID = e.row.getRowData().id;

}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
//function onSmsGetFunctionsSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
//	/** 
//	 * @type cpr.protocols.Submission
//	 */
//	var sms1 = e.control;
//	
//	var responseText = sms1.xhr.responseText;
//	var jsonData = JSON.parse(responseText);
//	
//	var ds1 = app.lookup("dsFunctionList");
//	
//	if (jsonData.list){
//		console.log(jsonData.list);
//		ds1.clearData();
//		ds1.build(jsonData.list);
//	}
//	else {
//		console.log(jsonData);
//		ds1.clearData();
//		ds1.pushRowData(jsonData);
//	}
//	
//	console.log(ds1.getRowDataRanged());
//}


var clickRowID
/*
 * 버튼(btn6)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn6Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn6 = e.control;
	
		app.openDialog("modules/EDU/smyun/admSetupFunctionsPopup", {width : 940, height : 800}, function(dialog){
      dialog.ready(function(dialogApp){
         if (clickRowID){
            dialogApp.initValue = clickRowID;
         }
         // 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
      });
   }).then(function(returnValue){
      ;
   });
   }