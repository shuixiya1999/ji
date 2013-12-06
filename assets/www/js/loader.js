if(localStorage['up']){
	try{
		eval('('+localStorage['script']+')');
	}catch(e){
		document.write('<script type="text/javascript" src="js/index.js"></script>');
	}
}else{
	document.write('<script type="text/javascript" src="js/index.js"></script>');
}