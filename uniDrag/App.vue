<script>
	// import {decodeEncryptedData} from "@/api/appCommon.js"
	export default {
		onLaunch(){
			console.log("App Launch");
		},
		onShow(option){
			console.log("App Show");
		},
		onHide(){
			console.log("App Hide");
		}
	}
</script>

<style lang="scss">
	@import "./common/common.scss";
	page{
		font-size: 28upx;
		color: $textColor;
		background-color: $bgColor;
		height: 100%;
		box-sizing: border-box;
	}
	page::after{
		content: "";
		width: 100%;
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		border-bottom: 6upx solid $bgColor;
	}
	button, button[type=primary]{
		border: none;
		font-size: 32upx;
		border-radius: 0;
		padding: 0;
		background-color: $mainColor;
		color: #FFF;
		width: 100%;
		height: $buttonH;
		line-height: $buttonH;
		box-sizing: content-box;
	}
	button::after{
		border: none;
	}
	button.default, button[type=default]{
		background: none;
		color: $mainColor;
		border: 1upx solid $mainColor;
	}
	button.error, button[type=error]{
		background: none;
		color: $errorColor;
		border: 1upx solid $errorColor;
	}
	button.none, button[type=none]{
		background: none;
		color: $mainColor;
		border: none;
		font-size: $fontSize;
	}
	button.text, button[type=text]{
		width: auto;
		height: auto;
		line-height: 30upx;
		background: none;
		color: $textColor;
		border: none;
		font-size: $fontSize;
		padding: 0;
		margin: 0;
	}
	button[disabled]{
		opacity: 0.5;
	}
	.input-placeholder, .textarea-placeholder{
		color: #BBB;
		font-size: 26upx;
	}
	
	// 100%高度
	.hheight{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		bottom: 0;
		background: #ffffff;
		z-index: 0;
	}
	input, textarea{
		z-index: 0;
		position: relative;
	}
</style>
