/************************************************
 * edu01.js
 * Created at 2021. 11. 18. 오전 10:44:50.
 *
 * @author student
 ************************************************/
function test(){
	
}


/*
 * "버튼
 * 
 * 입니다." 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	app.lookup("sms1").send(); // 해당 서브미션으로 전송
}


/*
 * "버튼
 * 
 * 입니다." 버튼에서 animationstart 이벤트 발생 시 호출.
 * 애니메이션 시작시 발생하는 이벤트.
 */
function onButtonAnimationstart(/* cpr.events.CAnimationEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
}


/*
 * "Button" 버튼에서 mouseleave 이벤트 발생 시 호출.
 * 사용자가 컨트롤 및 컨트롤의 자식 영역 바깥으로 마우스 포인터를 이동할 때 발생하는 이벤트.
 */
function onButtonMouseleave(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
}


/*
 * "Button" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	
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
	
}
