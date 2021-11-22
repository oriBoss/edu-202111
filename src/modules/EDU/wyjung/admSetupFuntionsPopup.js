/************************************************
 * admSetupFuntionsPopup.js
 * Created at 2021. 11. 22. 오전 11:21:26.
 *
 * @author jwddoli
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
 * 루트 컨테이너에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	var code = app.getHost().initValue;
	var dm = app.lookup("dm1");
	var sms1 = app.lookup("sms1");
	var ipb = app.lookup("ipb1");
	
	console.log(app.getHost().initValue);
	
	dm.setValue("funcCode", code);
	sms1.send();
	
	ipb.redraw();
	
	var data = code;
	cpr.expression.ExpressionEngine.INSTANCE.registerConstant("", value);
	
}















