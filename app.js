var sites   = require("./sites.json"),
    request = require('request')

for (i in sites) {
  testSiteAllProtocols (sites[i].site)
}

function testSiteAllProtocols (site) {
  var protocals = [{
    "protocal": "http",
    "status": "",
  },{
    "protocal": "https",
    "status": "",
  }]

  for (i in protocals) {
  	var host = protocals[i].protocal + "://" + site

    isSiteSslEnabled (host, function (isSecure, host) {
    	console.log (isSecure + "\t" + host)
    })
  }
}

function isSiteSslEnabled (site, callback) {
  options = {
  	"url": site,
  	"followRedirect": false
  }

  request(options, function (error, response, body) {
  	if (!error) {
  	  if (response.statusCode == 200 && response.request.uri.protocol == "https:") {
  	    callback (true, site)
  	  } else if ((response.statusCode == 301 || response.statusCode == 302) && response.headers.location.indexOf ("https") == 0) {
  	  	callback (true, site)
  	  } else {
  	  	callback (false, site)
  	  }
  	} else {
  	  console.log ("Error: " + error)
  	}
  })
}