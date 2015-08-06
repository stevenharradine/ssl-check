var sites_path       = process.argv[2]
    sites            = require("./" + sites_path),
    request          = require('request'),
    argFlags         = new Array ()

argFlags = processArgs (argFlags)

rankSites ()

function processArgs (argFlags) {
  argFlags["no-certificate-check"] = false

  for (i in process.argv) {
    if (i >= 2) {
      if (process.argv[i] == "no-certificate-check") {
        argFlags["no-certificate-check"] = true
      }
    }
  }

  return argFlags
}

function rankSites () {
  for (s in sites) {
    testSiteAllProtocols (sites[s].site, function (site, protocols) {
      var secureState    = "Undefined",
          protocolSecure = new Array ()

      protocolSecure["http"] = false
      protocolSecure["https"] = false

      for (p in protocols) {
        protocolSecure[protocols[p].protocol] = protocols[p].status
      }

      if (protocolSecure["http"] && protocolSecure["https"]) {
        secureState = "High"
      } else if (protocolSecure["http"] || protocolSecure["https"]) {
        secureState = "Medium"
      } else if (!protocolSecure["http"] && !protocolSecure["https"]) {
        secureState = "Low"
      } else {
        secureState = "Unknown"
      }

      console.log (secureState + "\t" + site)
    })
  }
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
        if (error == "Error: DEPTH_ZERO_SELF_SIGNED_CERT") {
          callback (argFlags["no-certificate-check"], site, index)
        } else {
          callback (false, site, index)
        }
    }
  })
}