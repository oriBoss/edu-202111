/************************************************
 * main.js
 * Created at 2021. 11. 23. 오전 1:33:21.
 *
 * @author LHS_0212
 ************************************************/

var serviceModule = cpr.core.Module.require("utils/ServiceUrls");

/*
 * "조회" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var sms1 = app.lookup("sms1");
	
	sms1.send();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control;
	
	var responseText = sms1.xhr.responseText;
	var jsonData = JSON.parse(responseText);
	
	var ds1 = app.lookup("ds1");
	
	if (jsonData.list){
		console.log(jsonData.list);
		ds1.clearData();
		ds1.build(jsonData.list);
	}
	else {
		console.log(jsonData);
		ds1.clearData();
		ds1.pushRowData(jsonData);
	}
	
	console.log(ds1.getRowDataRanged());
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
	
	if (e.cellIndex == 2){
		app.openDialog("modules/EDU/smyun/dialogPopup", {width : 900, height : 600}, function(dialog){
			dialog.ready(function(dialogApp){
				var clickRowData = e.row.getRowData();
				dialogApp.initValue = clickRowData.id;
				// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			});
		}).then(function(returnValue){
			;
		});
	}
}


/*
 * "삭제" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
	var grd1 = app.lookup("grd1");
	
	var checkRowIndices = grd1.getCheckRowIndices();
	
	checkRowIndices.forEach(function(each){
		grd1.deleteRow(each);
	});
}


/*
 * "신규" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
}
