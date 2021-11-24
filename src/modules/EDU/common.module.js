/************************************************
 * common.module.js
 * Created at 2021. 11. 19. 오전 11:27:06.
 *
 * @author student
 ************************************************/

// 공통적인 메소드 정의하는 공간


// 글로벌 출판 방식 - 그냥 컨탠트 어시스트가 바로 됨
globals.alertTest1 = function() {
	alert("test1");
}
// 모듈 출판 방식  - 맴버 변수 형태로 사용하게 출판됨. 해당 파일을 모듈로 불러가서 사용해야 한다.
exports.alertTest2 = function(){
	alert("test2");
}