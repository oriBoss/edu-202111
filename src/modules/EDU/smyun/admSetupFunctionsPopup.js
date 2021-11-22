/************************************************
 * admSetupFunctionsPopup.js
 * Created at 2021. 11. 22. 오후 12:03:05.
 *
 * @author ysm13
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
	
	var funcCode = app.getHost().initValue;
	var dm = app.lookup("dm1");
	var sms = app.lookup("sms1");
	var ipb = app.lookup("ipb14");
	console.log(app.getHost().initValue);
	console.log(dm.getDatas());
	dm.setValue("funcCode", funcCode);
	
	// app.lookup("sms1").send();

	sms.send();
	
	ipb.redraw();
	
	data = funcCode;
	
	
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control
	var responseText = sms1.xhr.responseText;
    var jsonData = JSON.parse(responseText);
    
    app.lookup("dm1").build(jsonData);
   
    console.log(jsonData);
    
    app.lookup("grp1").redraw();
}
