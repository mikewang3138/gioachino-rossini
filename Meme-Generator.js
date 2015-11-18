var noun = ["asshole", "dick", "retard", "nigger", "Nick", "Gavin", "Ryze", "meme", "Cody", "Zac", "Steve", "level 5 Nunu", "fed Amumu", "fam", "Kyle"];
var adjective = ["savage", "retarded", "shitty", "GG", "fed", "OP"];
var list = [];
var list_num = 0;
var n_nouns = 0;
var n_adjectives = 0;
var noun_list = [];
var adj_list = [];

function randomize(){
    fillList();
    var string = "";
    for(var i=0; i < list.length; i++){
        if(list[i] == "noun"){
            n_nouns++;
            string += (noun[Math.floor(Math.random()*noun.length)] + " ");
        }
        if(list[i] == "adjective"){
            n_adjectives++;
            string +=(adjective[Math.floor(Math.random()*adjective.length)] + " ");
        }
        
    }    
    document.getElementById("textbox").innerHTML = string;
}

function add(){
    var select = document.createElement("SELECT");
    select.id = "list" + list_num;
    list_num++;
    var n_option = document.createElement("option");
    n_option.value = "noun";
    n_option.text = "noun";
    select.appendChild(n_option);
    var a_option = document.createElement("option");
    a_option.value = "adjective";
    a_option.text = "adjective";
    select.appendChild(a_option);
    document.getElementById("List").appendChild(select);
}

function fillList(){
    list = [];
    for(var i = 0; i < list_num; i++){
        var sel = document.getElementById("list" + i);
        list.push(sel.value);
    }
}
    