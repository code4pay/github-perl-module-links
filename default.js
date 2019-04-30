var subroutines = {};
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

function navigateToSub (el) {
    var text = el.innerText;
    var method_match = text.match(/(\{|\(|\s|->)(\w*)\(/);
    var sub = '';

    if (method_match && method_match.length >= 3) { 
        sub = method_match[2];
        if (sub  && subroutines[sub]) {
            location.hash = '#'+sub 
            return
        }
    }

    var getModule = /(\w+::)+(\w)+\(/;

    var module_text = el.textContent.match(getModule);
    if(module_text) {
        var bits = module_text[0].split('::');


        var methodbit = '->'+bits.pop();
        method_match = methodbit.match(/(\s|->)(\w*)\(/);

        if (method_match  && method_match.length >= 3) { 
            var method = method_match[2]; 
            var href = el.querySelector('a').href;
            window.location =href+'#'+method;
        }
    }
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
            subroutines[sub] = e;
            sub_element.id = sub; 
            li.innerHTML ='<a href="#'+sub+'">'+sub+'</a>';
            fragment.append(li);
        }

    }});
    modal_ul.appendChild(fragment)
    modal_div.appendChild(modal_ul);
    var subroutine;
    if (location.hash) {
        subroutine = location.hash.slice(1);
        console.log(subroutine);
        if (subroutines[subroutine]) {
        subroutine = location.hash;
        location.hash = '';
            location.hash = subroutine;
        }
    }
    

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


window.addEventListener("mousedown",function(event){
    navigateToSub(event.srcElement);

});

setTimeout(add_links, 1000);
setTimeout(list_subs, 1000);

