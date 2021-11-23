/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 23. 오전 11:12:07.
 *
 * @author 쭈주니
 ************************************************/

/**
 * 모듈 선언 영역
 */
var ServiceUrls = cpr.core.Module.require("utils/ServiceUrls").ServiceUrls;

/**
 * 함수 선언 영역 
 */

/**
 * 이벤트 처리 영역
 */
var clickRowID;

/*
 * "Reset" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	var resetBtn1 = app.lookup("sms1");
	
	app.lookup("dm1").reset();
	
}

/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control;
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	var ds1 = app.lookup("ds1");
	
	if (jsonData.list) {
		console.log(jsonData.list);
		ds1.clearData();
		ds1.build(jsonData.list);
	} else {
		console.log(jsonData);
		ds1.clearData();
		ds1.pushRowData(jsonData);
	}
	
	console.log(ds1.getRowDataRanged());
	
}

/*
 * "Search" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	app.lookup("sms1").send();
}

/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad( /* cpr.events.CEvent */ e) {
	//initvalue변환
	var idData = app.getHost().initValue;
	
	//1번
	var dm1 = app.lookup("dm1");
	dm1.setValue("id", idData);
	app.lookup("ipb1").redraw();
	
	//2번
	var sms1 = app.lookup("sms1");
	sms1.send();
	

}


/*
 * "삭제" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn3 = e.control;
	var grd1 = app.lookup("grd1");
	
	var checkRowIndices = grd1.getCheckRowIndices();
	
	checkRowIndices.forEach(function(each) {
		grd1.deleteRow(each);
	});
}

/*
 * "신규" 버튼(btn5)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn5Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn5 = e.control;
	
}

/*
 * "Button" 버튼(btn6)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn6Click( /* cpr.events.CMouseEvent */ e) {
	/** 
	 * @type cpr.controls.Button
	 */
	var btn6 = e.control;
    app.openDialog("",{width : 900, height : 600}, function(dialog){
    	dialog.ready(function(dialogApp){
    		if(clickRowID){
    			dialogApp.initValue = clickRowID;
    		}
    	});
    	}).then(function(returnValue){
    		;
    	});
    	
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
	
	clickRowID = e.row.getRowData().id;
}
