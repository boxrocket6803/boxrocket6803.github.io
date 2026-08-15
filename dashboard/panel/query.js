var Status = document.getElementById("Loading");

function Throw(msg) {
	Status.textContent = "ERR: "+msg;
	Status.classList.add("Error");
	throw msg;
}

async function Query() {
	var params = location.href.split('?');
	if (params.length == 1)
		Throw("missing auth");
	params = params[1].split('&');
	var oac = null;
	for (var i in params) {
		var kv = params[i].split('=');
		if (kv.length == 1 || kv[0] !== "code")
			continue;
		oac = kv[1];
	}
	if (oac === null)
		Throw("missing auth");
	var cch = null;
	var cookies = document.cookie.split(';');
	for (var i in cookies) {
		var kv = cookies[i].split('=');
		if (kv.length == 1 || kv[0] !== "bxrkt_db_cch")
			continue;
		cch = kv[1].split(';')[0];
	}
	if (cch == null)
		Throw("missing pkce cookie");
	Status.textContent = "There are no admin panels available to your account.";
	Status.classList.add("Error");
}
Query();