
function add_links (){
	var matches = document.querySelectorAll("td.blob-code span, table.js-file-line-container td, table.diff-table span");
	matches.forEach(function(e){ 
		var getModule = /(\w+::)+[A-Z]\w+/;
		var text = e.textContent.match(getModule);  
		if ( text != null) {
			console.log(text[0]);
                        var module = text[0].split('::');
			var prefix = module[0];
			var url ='';
			if (prefix == 'Binary'){
				url = 'https://github.com/regentmarkets/binary-websocket-api/blob/master/lib/'+text[0].replace(/::/g, '/') +'.pm';
			} else if (prefix == 'BOM') {
				var second_name = module[1];
				if (module[1] == 'Event') { 
					second_name = 'events';
                                }
				var inner = module[0] +'-'+second_name;
				inner = inner.toLowerCase();
				
				url = 'https://github.com/regentmarkets/'+inner+'/blob/master/lib/'+text[0].replace(/::/g, '/') +'.pm'

			}else { 
				url = 'https://metacpan.org/pod/'+text[0];
			} 
			e.innerHTML = e.textContent.replace(getModule,'<a href="'+url+'">'+ text[0] +'</a>' )} })
    }


setTimeout(add_links, 500);

