/************************************************
 * gridMoveColumn.js
 * Created at 2021. 11. 25. 오전 11:03:19.
 *
 * @author kjyan
 ************************************************/



/*
 * "맨 위" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var grd = app.lookup("grd1");
	var vaRowIndex = grd.getCheckRowIndices();
	for(var i=0; i<vaRowIndex.length; i++) {
		grd.dataSet.moveRowIndex(vaRowIndex[i], i, false);
	}
	grd.redraw();
}


/*
 * "한 칸 위" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick2(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var grd = app.lookup("grd1");
	var vaRowIndex = grd.getCheckRowIndices();
	for(var i=0; i<vaRowIndex.length; i++) {
		grd.dataSet.moveRowIndex(vaRowIndex[i], vaRowIndex[i]-1, false);
	}
	grd.redraw();
}


/*
 * "한 칸 아래" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var grd = app.lookup("grd1");
	var vaRowIndex = grd.getCheckRowIndices();
	for(var i=vaRowIndex.length-1; i>=0; i--) {
		console.log(vaRowIndex[i])
		grd.dataSet.moveRowIndex(vaRowIndex[i], vaRowIndex[i]+1, true);
	}
	grd.redraw();
}


/*
 * "맨 아래" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick4(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var grd = app.lookup("grd1");
	var vaRowIndex = grd.getCheckRowIndices();
	var vnRowCount = grd.rowCount;
	for(var i=0; i<vaRowIndex.length; i++) {
		grd.dataSet.moveRowIndex(vaRowIndex[i]-i, vnRowCount-1, true);
	}
	grd.redraw();
}
