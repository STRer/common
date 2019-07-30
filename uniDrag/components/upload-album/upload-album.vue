<template>
	<view class="upload-album">
		<text class="grey" v-if="album.loading">正在获取相册信息，请稍候...</text>
		<block v-else>
			<view class="album" v-if="sort" :style="{height: albumTempHeight + 'px;'}">
				<block v-if="showSubstitute">
					<block v-for="(item, index) in albumTemp" :key="index">
						<view class="item" :style="'top:' + posArr[index][1] + 'px;left:' + posArr[index][0] + 'px;'">
							<view class="item-wrap"><image :src="item.URL" mode="aspectFill"></image></view>
						</view>
					</block>
				</block>
				<block v-else>
					<block v-for="(item, index) in albumTemp" :key="index">
						<view 
							class="item" 
							:class="{'item-static': isMove && index !== moveItem.index, 'item-move': index === moveItem.index}"
							:style="
								(index === moveItem.index)
								 ? 
								(isMove ? ('top:' + moveItem.top + 'px;left:' + moveItem.left + 'px;') : ('top:' + posArr[moveItem.inIndex][1] + 'px;left:' + posArr[moveItem.inIndex][0] + 'px;')) 
								 : 
								(
									'top:' + posArr[(index < moveItem.inIndex)
											? 
											((index < moveItem.index) ? index : index - 1)
											: 
											(
												(index > moveItem.inIndex)
													 ? 
													 (index > moveItem.index ? index : index + 1)
													 : 
													 (moveItem.index < moveItem.inIndex) ? (index - 1) : (index + 1)
											)][1] + 'px;' + 
									'left:' + posArr[(index < moveItem.inIndex)
											? 
											((index < moveItem.index) ? index : index - 1)
											: 
											(
												(index > moveItem.inIndex)
													 ? 
													 (index > moveItem.index ? index : index + 1)
													 : 
													 (moveItem.index < moveItem.inIndex) ? (index - 1) : (index + 1)
											)][0] + 'px;'
								)
							"
							@longpress="longpressFn($event, index)" 
							@touchmove.stop="moveFn($event, index)" 
							@touchend="touchendFn($event, index)"
						>
							<view class="item-wrap"><text style="position: absolute;color: red;"></text>
								<image :src="item.URL" mode="aspectFill"></image></view>
						</view>
					</block>
				</block>
			</view>
			<view v-else class="album" :style="{height: albumHeight + 'px;'}">
				<view class="item" v-for="(item, index) in album.list" :key="index" :style="'top:' + posArr[index][1] + 'px;left:' + posArr[index][0] + 'px;'">
					<image :src="item.URL || item.tempUrl" mode="aspectFill"></image>
					<view v-if="item.URL || item.status === 3" class="del" @click="delAlbum(item)">
						<v-icon type="ios-close-circle" color="rgba(0,0,0,0.5)" size="34"></v-icon>
					</view>
					<view v-if="(item.status !== undefined) && (item.status !== 2)" class="loading">
						<text v-if="item.status === 0">等待上传</text>
						<text v-else-if="item.status === 1">上传中...</text>
						<text v-else-if="item.status === 4">正在删除</text>
						<text v-else>上传失败</text>
					</view>
				</view>
				<view class="item item-add" :style="'top:' + posArr[album.list.length][1] + 'px;left:' + posArr[album.list.length][0] + 'px;'" v-if="album.list.length < maxCount" @click="uploadAlbum">+</view>
			</view>
			<text v-if="sort" class="grey desc">长按拖动图片可调整顺序</text>
			<view class="btns">
				<button v-if="sort" class="btn-cancel" @click="sortTrigger(true)" form-type="submit">取消编辑</button>
				<button class="btn-sort" @click="sortTrigger" form-type="submit">{{sort ? "保存图片顺序" : "点击调整图片顺序"}}</button>
			</view>
		</block>
	</view>
</template>

<script>
	import {getAlbum} from "@/api/card.js"
	import {uploadAlbum, delAlbum, savePicPosition} from "@/api/member.js"
	import sn from "@/common/utils.js"
	let memberInfo = uni.getStorageSync("memberInfo");
	// config
	let px = sn.getPx();
	let imgS = 150*px;  //图片尺寸
	let basicP = 25*px;  //间隔大小
	let rowCount = 4;  //每行最大图片个数
	let terribleCount = 99;  //最坏情况下，设置的最大值一定不能超过99，否则图片数量大于此值渲染时无坐标且会报错
	
	let arr = [];
	for(let i = 0; i < terribleCount + 1; i++){
		let row = Math.floor(i/rowCount);
		let col = i % rowCount;
		arr[i] = [col * imgS + ((col + 1) * basicP), row * imgS + ((row + 1) * basicP)];
	}
	
	export default{
		name: "uploadAlbum",
		data(){
			let count = 9;//  最大可上传的图片数
			if(memberInfo && memberInfo.MAX_PICTURE_NUM_PER_CARD){
				count = memberInfo.MAX_PICTURE_NUM_PER_CARD;
			}
			return {
				album: {
					list: [],   //list里面每一项是一个对象，对象的属性status的取值为：0 等待上传，1 上传中，2 上传成功，3 上传失败，4 删除中。
					loading: false,
					uploadLoading: false
				},
				albumTemp: [],  //调整顺序时操作的album.list的临时数组
				sort: false,
				moveItem: {
					index: -1,
					top: 0,
					left: 0,
					inIndex: -1
				},
				albumTop: 0,
				albumLeft: 0,
				isMove: false,
				posArr: arr,
				maxCount: count,  //最大图片数
				showSubstitute: false  //显示替身
			}
		},
		props: {
			cardId: {
				type: String,
				default: "8db42e125ea34134a5fbabe7155e6786"
			}
		},
		computed: {
			cardIdTemp(){
				return this.cardId;
			},
			imgCount(){
				return this.album.list.length;
			},
			albumHeight(){
				let len = this.album.list.length + 1;
				let row = Math.ceil(len/4);
				return (imgS*row + basicP*(row + 1));
			},
			albumTempHeight(){
				let len = this.albumTemp.length;
				let row = Math.ceil(len/4);
				return (imgS*row + basicP*(row + 2));
			}
		},
		watch: {
			cardIdTemp(){
				this.init();
			},
			sort(val){
				this.$emit("sort", val);
			}
		},
		methods: {
			init(){
				this.getAlbum();
			},
			getAlbum(){
				console.log("cardId", this.cardId);
				if(this.cardId){
					this.album.loading = true;
					getAlbum(this.cardId).then(res => {
						this.album.list = res.rows;
						this.album.loading = false;
						this.album.uploadLoading = false;
					}).catch(err => {
						this.album.loading = false;
						console.log("err", err);
					});
				}
			},
			uploadAlbum(){
				let _this = this;
				console.log("chooseImgFn");
				let index = _this.imgCount;
				uni.chooseImage({
					count: _this.maxCount - index,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes);
						tempFilePaths.forEach(item => {
							_this.album.list.push({
								CARD_ID: _this.cardId,
								PICTURE_ID: "",
								URL: "",
								tempUrl: item,
								status: 0
							});
						});
						
						function queue(list, index){
							let promise = Promise.resolve();
							console.log("begin");
							for(let i = index; i < list.length; i++){
								let item = list[i];
								promise = promise.then(()=>{
									return new Promise((resolve, reject)=>{
										item.status = 1;
										if(i == 0){
											_this.$emit("album-change");
										}
										_this.album.uploadLoading = true;
										uploadAlbum(item.tempUrl, item.CARD_ID).then(res => {
											console.log(i, "uploadAlbum res", res);
											let p = res.picture;
											item.CARD_ID = p.CARD_ID;
											item.PICTURE_ID = p.PICTURE_ID;
											item.URL = p.URL;
											item.status = 2;
											_this.album.uploadLoading = false;
											resolve();
										}).catch(err => {
											console.log("err", err);
											item.status = 3;
											_this.album.uploadLoading = false;
											reject(err);
										});
									});
								}).catch(err => {
									_this.album.uploadLoading = false;
									console.log("err2", err);
								});
							}
							console.log("end");
						}
						queue(_this.album.list, index);
					},
					fail: (err) => {
						console.log("err", err);
					}
				});
			},
			delAlbum(item){
				if(item.status === 4){
					return;
				}
				if(item.PICTURE_ID){
					let statusTemp = item.status || 0;
					item.status = 4;
					delAlbum(item.PICTURE_ID).then(res => {
						item.status = statusTemp;
						let list = [...this.album.list];
						list.splice(this.album.list.indexOf(item), 1);
						this.$set(this.album, "list", list);
						this.$emit("album-change");
					}).catch(err => {
						item.status = statusTemp;
						console.log("err", err);
					});
				}else{
					let list = [...this.album.list];
					list.splice(this.album.list.indexOf(item), 1);
					this.$set(this.album, "list", list);
				}
			},
			longpressFn(e, index){
				this.getPosition().then(() => {
					this.moveItem.inIndex = index;
					let halfImg = imgS/2;
					let albumTop = this.albumTop;
					let albumLeft = this.albumLeft;
					this.moveTemp = index;
					// this.indexTemp = index;
					this.moveItem.index = index;
					this.moveItem.left = e.clientX - halfImg - albumLeft;
					this.moveItem.top = e.clientY - halfImg - albumTop;
					// console.log(this.moveItem)
					this.isMove = true;
				});
			},
			moveFn(e, index){
				if(this.moveItem.index != index) return;
				let albumTop = this.albumTop;
				let albumLeft = this.albumLeft;
				let x = e.clientX - albumLeft;
				let y = e.clientY - albumTop;
				// this.moveItem.index = index;
				this.moveItem.left = x - imgS/2;
				this.moveItem.top = y - imgS/2;
				let col = -1;
				let row = -1;
				if(x > 0 && x < basicP*5 + imgS*4){
					if(x < basicP*1.5 + imgS){  //第一列
						col = 0;
					}else if(x < basicP*2.5 + imgS*2){
						col = 1;
					}else if(x < basicP*3.5 + imgS*3){
						col = 2;
					}else{
						col = 3;
					}
				}
				if(y > 0){
					row = Math.floor(y / (basicP*1.5 + imgS));
				}
				let inIndex = -1;
				if(row >= 0 && col >= 0){
					inIndex = row * rowCount + col;
					if(inIndex <= this.albumTemp.length) this.moveItem.inIndex = inIndex;
				}
				// console.log(x, y, col, row, inIndex);
			},
			touchendFn(e, index){
				// console.log(index, this.moveItem.inIndex, [...this.albumTemp]);
				this.isMove = false;
				let inIndex = this.moveItem.inIndex;
				if(index === inIndex || inIndex === -1){
					this.moveItem.index = -1;
					this.moveItem.inIndex = -1;
					return;
				};
				inIndex = index < inIndex ? inIndex + 1 : inIndex;
				let list = [...this.albumTemp];
				let item = {...list[index]};
				list[index] = 0;
				list.splice(inIndex, 0, item);
				let idx = list.indexOf(0);
				list.splice(idx, 1);
				this.showSubstitute = true;
				this.albumTemp = list;
				this.moveItem = {
					top: 0,
					left: 0,
					index: -1,
					inIndex: -1
				};
				setTimeout(() => {
					this.showSubstitute = false;
				}, 100);
			},
			sortTrigger(cancel){
				let sort = this.sort;
				if(sort){
					console.log("cancel", cancel)
					if(cancel !== true){
						this.album.list = [...this.albumTemp];
						this.savePicPosition(cancel);
					}else{
						this.sort = !sort;
					}
				}else{
					let list = [...this.album.list];
					if(this.album.uploadLoading){
						sn.showToast("当前有图片正在上传，请稍候重试");
						return;
					}
					list.filter(item => {
						if(item.URL){
							return true;
						}else{
							return false;
						}
					});
					if(!list.length){
						sn.showToast("请先添加图片");
						return;
					}
					this.albumTemp = [...list];
					this.sort = !sort;
				}
			},
			getPosition(){
				let _this = this;
				return new Promise((resolve, reject) => {
					let album = uni.createSelectorQuery().select(".album");
					album.boundingClientRect(res => {
						console.log(res);
						_this.albumTop = res.top;
						_this.albumLeft = res.left;
						resolve();
					}).exec();
				});
			},
			savePicPosition(callback){
				let positions = [];
				this.album.list.forEach((item, index) => {
					positions.push({
						PICTURE_ID: item.PICTURE_ID,
						ORDER_NUM: index + 1
					});
				});
				sn.showLoading();
				savePicPosition(positions).then(res => {
					console.log("savePicPosition", res);
					this.sort = false;
					this.$emit("album-change");
					sn.showToast("图片顺序保存成功");
					if(typeof callback === "function") callback();
				}).catch(err => {});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/common.scss";
	$itemS: 150;
	$imgS: $itemS + upx;
	$basicP: 25;
	.upload-album{
		.album{
			overflow: hidden;
			width: 730upx;
			height: ($itemS*3 + $basicP*4) + upx;
			position: relative;
			.item-wrap{
				position: relative;
				.before, .after{
					height: $imgS;
					border-left: 4upx solid #AAA;
					position: absolute;
					top: 0;
				}
				.before{
					left: -12upx;
				}
				.after{
					right: -12upx;
				}
			}
			.item{
				width: $imgS;
				height: $imgS;
				// float: left;
				margin: 12upx;
				position: absolute;
				image{
					width: $imgS;
					height: $imgS;
				}
				.loading{
					position: absolute;
					width: $imgS;
					height: $imgS;
					top: 0;
					left: 0;
					z-index: 2;
					background-color: rgba(0,0,0,0.5);
					display:flex;
					justify-content:center;
					align-items:center;
					color: #FFF;
				}
				.del{
					position: absolute;
					top: 6upx;
					right: 6upx;
					z-index: 3;
				}
				&.item-static{
					transition: all 0.3s;
				}
				&.item-move{
					opacity: 0.8;
					z-index: 9;
					transform: scale(1.1);
					transition: transform 0.3s, opacity 0.3s;
				}
				&.item-add{
					background-color: #E0E0E0;
					color: #BBB;
					font-size: 90upx;
					line-height: 140upx;
					text-align: center;
					font-weight: 900;
				}
			}
		}
		.desc{
			font-size: 22upx;
			margin: -20upx 0 0 210upx;
			position: absolute;
		}
		.btns{
			display: flex;
			.btn-cancel{
				background: none;
				color: #AAA;
				margin-right: 30upx;
			}
			.btn-sort{
				min-width: 180upx;
				background: none;
				color: $mainColor;
				border: 1upx solid $mainColor;
			}
		}
	}
</style>