/************************************************
 * SubmissionTest.js
 * Created at 2021. 11. 17. 오전 11:20:14.
 *
 * @author kimks
 ************************************************/



/*
 * "Button" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	var smsGetFunctions = app.lookup("smsGetFunctions");
	smsGetFunctions.send();
}
