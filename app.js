var sites   = require("./sites.json"),
    request = require('request')

for (s in sites) {
  testSiteAllProtocols (sites[s].site, function (site, protocols) {
    for (p in protocols) {
      console.log (protocols[p].status + "\t" + protocols[p].protocol + "://" + site)
    }
  })
}

function testSiteAllProtocols (site, callback) {
  var protocols = [{
    "protocol": "http",
    "status": "",
  },{
    "protocol": "https",
    "status": "",
  }]

  for (i in protocols) {
    var host = protocols[i].protocol + "://" + site

    isSiteSslEnabled (host, i, function (isSecure, site, index) {
      var site_split = site.split("://"),
          site_protocol = site_split[0],
          site_hostname = site_split[1]

      for (p in protocols) {
        if (protocols[p].protocol == site_protocol) {
          protocols[p].status = isSecure
        }
      }

      if (index == protocols.length - 1) {
        callback (site_hostname, protocols)
      }
    })
  }
}

function isSiteSslEnabled (site, index, callback) {
  options = {
    "url": site,
    "followRedirect": false
  }

  request(options, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 200 && response.request.uri.protocol == "https:") {
        callback (true, site, index)
      } else if ((response.statusCode == 301 || response.statusCode == 302) && response.headers.location.indexOf ("https") == 0) {
        callback (true, site, index)
      } else {
        callback (false, site, index)
      }
    } else {
      console.log ("Error: " + error)
    }
  })
}