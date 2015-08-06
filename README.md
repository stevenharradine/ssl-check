# ssl-check
Provides a dashboard of a sites ssl state

## install npm modules
```
npm install
```

## create your own sites.json (or amend the existing one)
```
[{
	"site": "telus.com"
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
no-certificate-check	dont let a self signed certs ruin your day
```

## output
You will get a rating for your site.
```
High	https enabled and redirecting http traffic to it
Medium	https is enabled but not redirecting traffic
Low		https is not enabled
```