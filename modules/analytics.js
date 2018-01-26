global.app.use(function(req, res, next) {

	var send = res.send;
	
	res.send = function(body) {
		send.call(this, 
			body.replace(/<head>/, 
				"<head><script async src='https://www.googletagmanager.com/gtag/js?id="+global.google_analytics+"'></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','"+global.google_analytics+"');</script>"	
			)
		);
	}

	next();

});
