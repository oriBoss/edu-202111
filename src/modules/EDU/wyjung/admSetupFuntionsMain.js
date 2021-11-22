/************************************************
 * admSetupFuntionsMain.js
 * Created at 2021. 11. 22. 오전 11:20:49.
 *
 * @author jwddoli
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;


/**
 * 함수 선언 영역 
 */
function search() {
	var subList = app.lookup("subList");
	
	subList.send();
}


/**
 * 이벤트 처리 영역
 */


/*
 * "조회" 버튼(btnSearch)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnSearchClick(/* cpr.events.CMouseEvent */ e){
	search();
}


/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	search();
}


/*
 * "초기화" 버튼(btnReset)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtnResetClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btnReset = e.control;
	app.lookup("dmSearch").reset();
	
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
	var responseText = smsGetFunction.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	app.lookup("dmSearch").build(jsonData);

}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSubListSubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var subList = e.control;
	var grid = app.lookup("grd1");
	
	grid.redraw();
	
}


/*
 * 그리드에서 cell-click 이벤트 발생 시 호출.
 * Grid의 Cell 클릭시 발생하는 이벤트.
 */
function onGrd1CellClick(/* cpr.events.CGridMouseEvent */ e){
	/** 
	 * @type cpr.controls.Grid
	 */
	var grd1 = e.control;
	
	if (e.cellIndex === 2) {
		app.openDialog("modules/EDU/wyjung/admSetupFuntionsPopup", {width : 900, height : 700}, function(dialog){
			dialog.ready(function(dialogApp){
				// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
				dialogApp.initValue = e.row.getRowData().funcCode;
				
			});
		}).then(function(returnValue){
			;
		});
	}
}

