
function add_links (){
	var matches = document.querySelectorAll("td.blob-code span, table.js-file-line-container td");
	matches.forEach(function(e){ 
		var text = e.textContent.match(/(\w+::\w+)+\w/);  
		if ( text != null) {
			console.log(text[0]);
                        var module = text[0].split('::');
			var prefix = module[0];
			var url ='';
			if (prefix == 'Binary'){
				url = 'https://github.com/regentmarkets/binary-websocket-api/blob/master/lib/'+text[0].replace(/::/g, '/') +'.pm';
			} else if (prefix == 'BOM') {
				var inner = module[0] +'-'+module[1];
				inner = inner.toLowerCase();
				url = 'https://github.com/regentmarkets/'+inner+'/blob/master/lib/'+text[0].replace(/::/g, '/') +'.pm'

			}else { 
				url = 'https://metacpan.org/pod/'+text[0];
			} 
			e.innerHTML = '<a href="'+url+'">'+ text[0] +'</a>' } })
    }


setTimeout(add_links, 500);

