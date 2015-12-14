function erredify(){
var thestring = document.getElementById("textfield").value;
var list = stringtolist(thestring);   
randomize(list);
thestring = listtostring(list);
console.log(thestring);
document.getElementById("textbox").innerHTML = thestring;
}


function stringtolist(thestring){
    var list = [];
    var wordstart = 0;
    var wordend;
    var eof = false;
    while(!eof){
            wordend = thestring.indexOf(" ", wordstart+1);
            if(wordend == -1){
                eof = true;
                wordend = thestring.length;
            }
            list.push(thestring.substring(wordstart, wordend));
            wordstart = wordend + 1;
            
    }
    return list;  
    
}

function randomize(thelist){
    for(var i=0; i<thelist.length; i++){
            var rand = Math.random();
            if(rand > 0.85)
                thelist[i] = "<ins><b>" + thelist[i] + "</b></ins>";
            if(thelist[i].indexOf("here") >= 0)
                thelist[i] = "{" + thelist[i] + "}";
    }
}

function listtostring(thelist){
    var string = "";
    for(var i=0; i<thelist.length; i++){
            if(i == thelist.length-1)
                string += thelist[i];
            else  
                string += thelist[i] + " ";
    }
    return string;
}