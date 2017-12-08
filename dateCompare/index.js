function dateCompare(c) {
	if ("NaN" === (new Date(c)).getDate().toString()) return "Invalid Date";
	c = new Date(c);
	var b = parseInt((new Date - c) / 1E3, 10);
	if (0 >= b) return "just now";
	var a = b / 60;
	if (1 > a) return "less than a minute ago";
	if (2 > a) return "about a minute ago";
	b = a / 60;
	if (1 > b) return parseInt(a, 10) + " minutes ago";
	if (1.5 > b) return "about an hour ago";
	a = b / 24;
	if (1 > a) return Math.round(b) + " hours ago";
	if (7 > a) return parseInt(a, 10) + " days ago";
	b = c.getMonth() + 1;
	10 > b && (b = "0" + b);
	a = c.getDate();
	10 > a && (a = "0" + a);
	return [c.getFullYear(), b, a].join("-")
};
