import {getMeInfo} from "@/api/appCommon.js"

export const tabbarDotController = () => {
	getMeInfo().then(res => {
		let num = res.EXCHANGE_MESSAGE_NUM;
		if(num && !isNaN(num)){
			// uni.setStorage({key: "exchangeMsgNum", data: num});
			uni.showTabBarRedDot({index: 3});
		}else{
			// uni.removeStorage({key: "exchangeMsgNum"});
			uni.hideTabBarRedDot({index: 3});
		}
	}).catch(err=>{});
}