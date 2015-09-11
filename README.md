# ssl-check
Provides a dashboard of a sites ssl state

## install npm modules
```
npm install
```

## create your own sites.json (or amend the existing one)
```
[{
	"site": "google.com"
},{
	"site": "bing.com"
}]
```

## run
When running the program you need to pass in the sites file as the first argument and then any flags.
```
node app.js sites.json
```

## flags
Flags you can add when running:
```
--allow-self-signed	allow self signed certs to pass
```

## output
You will get a rating for your site.
```
High    http AND https resolve securely
Medium  http OR  https resolves securely
Low     http AND https do not resolve securely
```
