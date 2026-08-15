var Time = 0;
var DBGlow = 0;
var DBCount = 0;

function DBInc() {
	DBGlow = 0.6;
	if (++DBCount < 3)
		return;
	Submit();
}

function DBDec(d) {
	d -= Time;
	Time += d;
	d /= 1000;
	DBGlow = Math.max(0, DBGlow - d);
	if (DBGlow == 0)
		DBCount = 0;
	requestAnimationFrame(DBDec);
}
requestAnimationFrame(DBDec);

async function Submit() {
	return;
	var rq = "https://github.com/login/oauth/authorize";
	rq += "?client_id=Iv23lixC6zB7rRFIydwG";
	rq += "&code_challenge_method=S256";
	var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var cch = ""; var url = "";
	for (var i = 0; i < 22; i++)
		cch += charset.charAt(Math.floor(Math.random() * charset.length));
	var sha = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(cch));
	sha = new Uint8Array(sha);
	for (var i = 0; i < sha.length; i++)
		url += String.fromCharCode(sha[i]);
	url = btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	document.cookie = "bxrkt_db_cch="+cch;
	rq += "&code_challenge="+url;
	location.href = rq;
}