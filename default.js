var subroutines = {};

function navigateToSub (el, hover) {
    var text = el.innerText;
    if (!text) {return;}
    var method_match = text.match(/(\{|\(|\s|->)(\w+)\(/);
    var sub = '';

    if (method_match && method_match.length >= 3) { 
        sub = method_match[2];
        if (sub  && subroutines[sub]) {
            if(hover) {
                el.style.cursor = 'pointer';
            } else {
                location.hash = '';
                location.hash = '#'+sub 
            }
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
            if (subroutines[method]) {
                
            if(hover) {
                el.style.cursor = 'pointer';
            } else {
                location.hash = '';
                location.hash = '#'+method 
            }
            return
            }
            var href = module_url(el.textContent);
            if(hover) {
                el.style.cursor = 'pointer';
            } else {
            window.location =href+'#'+method;
            }
        }
    }else {

        // just a module no function 
        var url = module_url(el.textContent);
        if (url) {
            if(hover) {
                el.style.cursor = 'pointer';
            } else {
                window.location = url;     
            }
        }
    }

}


function module_url(text) {

   var getModule = /(\w+::)+[A-Z]\w+/;
   
    var module_text = text.match(getModule);
    if(module_text) {
            var module = module_text[0].split('::');
            var prefix = module[0];
            var url ='';
            if (prefix == 'Binary'){
                url = 'https://github.com/regentmarkets/binary-websocket-api/blob/master/lib/'+module_text[0].replace(/::/g, '/') +'.pm';
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

                url = 'https://github.com/regentmarkets/'+inner+'/blob/master/lib/'+module_text[0].replace(/::/g, '/') +'.pm'

            }else { 
                url = 'https://metacpan.org/pod/'+module_text[0];
            } 
           return  url; 
    }
    return null;

}

function list_subs () {
    var modal_div = document.createElement('div');
    modal_div.hidden = true;
    var modal_ul = document.createElement('ul')
    var parent = document.querySelector('.repository-content, div.diff-view')
    if (!parent) {return;}
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


function linkDirectToCircleCI () {
     if (window.location.href != 'https://github.com/pulls'){
       return ;
     }
     var failures = document.querySelectorAll("div.js-issue-row");
     failures.forEach(function(el) {
            var error_link =el.querySelector("a.text-red");
            if (!error_link) {return;}
            var prByElement = el.querySelector("span.opened-by");
            var prId = prByElement.innerText.match(/^#(\d+)\s/)[1];
            error_link.href = 'https://circleci.com/gh/regentmarkets/binary-websocket-api/tree/pull%2F'+prId
     });

}

var codeWindow  = document.querySelector("div.Box-body.type-perl, div.diff-view");
if (codeWindow){
    codeWindow.addEventListener("mousedown",function(event){
        if (event.which == 1 ){
            navigateToSub(event.srcElement);
        }
    });

    codeWindow.addEventListener("mouseover",function(event){
        navigateToSub(event.srcElement, true);
    });
}



setTimeout(linkDirectToCircleCI, 500);
setTimeout(list_subs, 1000);

