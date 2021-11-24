/************************************************
 * admSetupFunctionsMain.js
 * Created at 2021. 11. 24. 오전 10:57:08.
 *
 * @author 쭈주니
 ************************************************/
 
/**
 * 모듈 선언 영역
 */	
var serviceModule = cpr.core.Module.require("module/service");


/**
 * 함수 선언 영역 
 */
var clickRowID;


/**
 * 이벤트 처리 영역
 */
function subSearchSend(){   
    var subSearch = app.lookup("smsSetup");
        
    subSearch.send();   
}


/*
 * "Reset" 버튼(btn1)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn1Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn1 = e.control;
    var dm1 = app.lookup("dm1");
    var grd1 = app.lookup("grd1");
    var dsSearch = app.lookup("dsSearch");
    
    // 데이터 맵 초기화
    dm1.reset();
     
    // 초기화된 값이 갱신되도록 컨트롤을 포함한 그룹을 redraw()
    grd1.redraw();
    
    // 데이터 행 초기화
    dsSearch.clearData();
    
}


/*
 * "Search" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
    /** 
     * @type cpr.controls.Button
     */
    var btn2 = e.control;
    
    subSearchSend();
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb1Keyup(/* cpr.events.CKeyboardEvent */ e){
    /** 
     * @type cpr.controls.InputBox
     */
    var ipb1 = e.control;
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == "Enter"){
        subSearchSend();
    }
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb2Keyup(/* cpr.events.CKeyboardEvent */ e){
    /** 
     * @type cpr.controls.InputBox
     */
    var ipb2 = e.control;
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == "Enter"){
        subSearchSend();
    }
}


/*
 * 인풋 박스에서 keyup 이벤트 발생 시 호출.
 * 사용자가 키에서 손을 뗄 때 발생하는 이벤트.
 */
function onIpb3Keyup(/* cpr.events.CKeyboardEvent */ e){
    /** 
     * @type cpr.controls.InputBox
     */
    var ipb3 = e.control;
    
    //e.key 가 True일 때 이벤트 발생
    if(e.key == "Enter"){
        subSearchSend();
    }
}
