/************************************************
 * edu05.js
 * Created at 2021. 11. 19. 오전 10:27:59.
 *
 * @author student
 ************************************************/



/*
 * 사용자 정의 컨트롤에서 save 이벤트 발생 시 호출.
 */
function onUdcCudBtnSave(/* cpr.events.CAppEvent */ e){
	/** 
	 * @type udc.UdcCudBtn
	 */
	var udcCudBtn = e.control;
	alert("저장하시겠습니까?");
}


/*
 * "Button" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	alertTest1();
}


/*
 * "2" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	var moduleVar = cpr.core.Module.require("common");
	moduleVar.alertTest2();
}
