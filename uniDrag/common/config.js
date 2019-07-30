// import cf from "../static/pages.json"

let pageTemp = {};

// cf.pages.forEach(item => {
// 	if(item.name) pageTemp[item.name] = "/" + item.path;
// });
// 
// console.log("page", pageTemp);

const url = {};
// const basePageUrl = "/pages/";
const page = pageTemp;
const pageSize = 20;

module.exports = {
	...url, page, pageSize
}