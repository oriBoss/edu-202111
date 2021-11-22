/************************************************
 * admSetupFuntionsPopup.js
 * Created at 2021. 11. 22. 오전 11:30:16.
 *
 * @author 82107
 ************************************************/

/**
 * 모듈 선언 영역
 */	
	
/**
 * 함수 선언 영역 
 */

/**
 * 이벤트 처리 영역
 */

/*
 * 아웃풋에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onOutputClick(/* cpr.events.CMouseEvent */ e){
	app.close();
}



var data;
cpr.expression.ExpressionEngine.INSTANCE.registerConstant("data", data);
/*
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	var code = app.getHost().initValue;
	console.log(app.getHost().initValue);
	var dm = app.lookup("dm1");
	dm.setValue("funcCode", code);
	
	var sms = app.lookup("sms1");
	sms.send();
	console.log(dm.getDatas());
	
	var ipb = app.lookup("ipb1");
	ipb.redraw();
	
	data = code;
}



/*
 * 인풋 박스에서 value-change 이벤트 발생 시 호출.
 * 변경된 value가 저장된 후에 발생하는 이벤트.
 */
function onIpb1ValueChange(/* cpr.events.CValueChangeEvent */ e){
	/** 
	 * @type cpr.controls.InputBox
	 */
	var ipb1 = e.control;
	
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
	app.lookup("dm1").build(jsonData);
	
	console.log(jsonData);
	
	app.lookup("grp1").redraw();
}
