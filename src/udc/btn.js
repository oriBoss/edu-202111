/************************************************
 * btn.js
 * Created at 2021. 11. 19. 오전 11:57:17.
 *
 * @author student
 ************************************************/

/**
 * UDC 컨트롤이 그리드의 뷰 모드에서 표시할 텍스트를 반환합니다.
 */
exports.getText = function(){
	// TODO: 그리드의 뷰 모드에서 표시할 텍스트를 반환하는 하는 코드를 작성해야 합니다.
	return "";
};



/*
 * "추가" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn1 = e.control;
	//타입을 강제적으로 지정해주면, grid로 인식시켜서 grid의 (컨탠드 어시스트 도움을 받을 수 있다.)API를 참고해서 쓸 수 있다.
	// 타입 지정 ctrl + shift + / 타입 지정을 바로 밑에만 해주는 것이다.
	/** @type cpr.controls.Grid */
	var vcGrd = app.getAppProperty("grid");//출판된 속성(grid)을 가져오는 법
	
	//app.getAppProperty(propertyName)
//	/** @type cpr.controls.Button */
//	var button = app.getAppProperty("btn1");//출판된 속성(grid)을 가져오는 법

	vcGrd.insertRow(0,false);
}


/*
 * "저장" 버튼(btn3)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn3Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn3 = e.control;
	// save 이벤트를 생성
	var event = new cpr.events.CAppEvent("save");
	
	// save 이벤트를 전파
	app.dispatchEvent(event);
}
