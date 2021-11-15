function MES_MENU_SAMPLE() {}

MES_MENU_SAMPLE.info = {
	list: [
		{
			id: 1,
			name: "",
			displayName: "시스템 관리",
			icon: "../src/modules/COMMON/assets/images/ic-1depth-g-09.png",
			activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-09.png",
			order: 1,
			pageName: null,
			list: [
				{
					id:2,
					displayName: "메뉴 관리",
					order: 1,
					pageName: null,
					list: [
						{
							id: 7,
							displayName: "기능 설정",
							name: "AdmSetupFunctionMain",
							packageName: "modules.ADM.pages",
							order: 1
						},
						{
							id: 8,
							displayName: "기능 사용 이력 조회",
							name: "AccessHistoryMain",
							packageName: "modules.ADM.pages",
							order: 1
						},
						{
							id: 9,
							displayName: "코드 설정",
							name: "AdmSetupCodeData",
							packageName: "modules.ADM.pages",
							order: 1
						},
					]
				},
			]
		},
		{
			id: 2,
			name: "",
			displayName: "생산 관리",
			icon: "../src/modules/COMMON/assets/images/ic-1depth-g-03.png",
			activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-03.png",
			order: 2,
			pageName: null
		},
		{
			id: 3,
			name: "",
			displayName: "설비 관리",
			icon: "../src/modules/COMMON/assets/images/ic-1depth-g-04.png",
			activeIcon: "../src/modules/COMMON/assets/images/ic-1depth-b-04.png",
			order: 3,
			pageName: null
		},
		{
			id: 5,
			name: "",
			displayName: "샘플",
			order: 1,
			pageName: null,
			list: [
				{
					id: 6,
					displayName: "샘플 1",
					order: 2,
					pageName: null,
					list: [
						{
							id: 7,
							displayName: "샘플 11",
							packageName: "modules.SAMPLE.CONTENTS.pages",
							name: "",
							order: 1
						}
					]
				}
			]
		},
		{
			id: 7,
			displayName: "WIP MATERIAL",
			name: "WipSetupMaterialMain",
			packageName: "modules.SAMPLE.CONTENTS.pages",
			order: 1
		},
		
	]
};

MES_MENU_SAMPLE.MENU_PAGE_MAP = {
};

exports.MES_MENU_SAMPLE = MES_MENU_SAMPLE;