const mobileReg = "^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\\d{8}$";
const phoneReg = /^0\d{2,3}-?\d{7,8}$/;
const emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
const urlReg = new RegExp("^((https|http|ftp|rtsp|mms)?://)"
			  + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
			  + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184 
			  + "|" // 允许IP和DOMAIN（域名）
			  + "([0-9a-z_!~*'()-]+\.)*" // 域名- www. 
			  + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名 
			  + "[a-z]{2,6})" // first level domain- .com or .museum 
			  + "(:[0-9]{1,4})?" // 端口- :80 
			  + "((/?)|" // a slash isn't required if there is no file name 
			  + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$");

const sn = {
	showLoading: () => {
		uni.showLoading({
			mask: true,
			title: ""
		});
	},
	showToast: (title) => {
		uni.showToast({
			icon: "none",
			title
		});
	},
	getByteLength: (val) => {
		let len = 0;
		for(let i = 0; i < val.length; i++){
			 let a = val.charAt(i);
			 if(a.match(/[^\x00-\xff]/ig) != null) {
				len += 2;
			}else{
				len += 1;
			}
		}
		return len;
	},
	getGUID: () => {
		return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			let r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	checkMobile: (str) => {
		return !!str.match(mobileReg);
	},
	checkPhone: (str) => {
		return !!phoneReg.test(str);
	},
	checkEmail: (str) => {
		return !!emailReg.test(str);
	},
	checkUrl: (str) => {
		return !!urlReg.test(str)
	},
	getPx: () => {  //upx的值乘以该方法的返回值，即可得出实际的px的值。 例如10upx转换为px为 10*getPx();
		try{
			let res = uni.getSystemInfoSync();
			return res.windowWidth / 750;
		}catch(e){
			return 0.5;
		}
	},
	getWindowHeight: () => {
		try{
			let res = uni.getSystemInfoSync();
			return res.windowHeight;
		}catch(e){
			return 555;  //默认是iPhone 6s的高度
		}
	}
}

export default sn;