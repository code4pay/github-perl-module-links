
function add_links (){
    var matches = document.querySelectorAll("td.blob-code span, table.js-file-line-container td, table.diff-table span, table.diff-table td, table.js-file-line-container td, table.js-file-line-container span  ");
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
                var concater = '-';
                var second_name = module[1];
                var module_map = { "Event" :"events", "Database" : "postgres", "Product": ''} 
                if (module_map[module[1]] !== undefined) { 
                    second_name = module_map[module[1]];
                    if (second_name == '' ) { concater = ''; }
                }

                var inner = module[0] + concater + second_name;
                inner = inner.toLowerCase();

                url = 'https://github.com/regentmarkets/'+inner+'/blob/master/lib/'+text[0].replace(/::/g, '/') +'.pm'

            }else { 
                url = 'https://metacpan.org/pod/'+text[0];
            } 
            e.innerHTML = e.textContent.replace(getModule,'<a href="'+url+'">'+ text[0] +'</a>' )} })
}

function list_subs () {
    var modal_div = document.createElement('div');
    modal_div.hidden = true;
    var modal_ul = document.createElement('ul')
    var parent = document.querySelector('.repository-content')
    parent.insertAdjacentElement('afterbegin',modal_div)
    modal_div.style.cssText = 'background:rgba(255, 255, 255, 0.8) ;border-size :1px; border: solid;  margin-top: 10px; font-size: 10px; padding-left: 10px; position: sticky; top: 0px; z-index: 999;' 
    var subs = document.querySelectorAll('.pl-k'); 

    var fragment = document.createDocumentFragment();
    subs.forEach(function(e) { if (e.innerText === 'sub') { 
        if (e.closest('td').querySelector('.pl-en'))  { 
            var li = document.createElement('li');
            var sub_element =e.closest('td').querySelector('.pl-en');
            var sub = sub_element.innerText;
            sub_element.id = sub; 
            li.innerHTML ='<a href="#'+sub+'">'+sub+'</a>';
            fragment.append(li);
        }

    }});
    modal_ul.appendChild(fragment)
    modal_div.appendChild(modal_ul);

    document.onkeydown = shortcut;

    function shortcut (e) {
        if (e.key == 'S') { 
            if (modal_div.hidden == true) {
                modal_div.hidden = false;
            } else {
                modal_div.hidden = true;
            }
        }

    }
}
setTimeout(add_links, 1000);
setTimeout(list_subs, 1000);

