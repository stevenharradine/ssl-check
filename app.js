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
    testSite (protocals[i].protocal + "://" + site)
  }
}

function testSite (site) {
  console.log ("Testing " + site)

  options = {
  	"url": site,
  	"followRedirect": false
  }

  request(options, function (error, response, body) {
  	if (!error) {
  	  console.log (response.request.uri.protocol + response.statusCode)
  	} else {
  	  console.log ("Error: " + error)
  	}
  })
}