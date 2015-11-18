var noun = ["asshole", "dick", "retard", "nigger", "Nick", "Gavin", "Ryze", "meme", "Cody", "Zac", "Steve", "level 5 Nunu", "fed Amumu", "fam", "Kyle"];
var adjective = ["savage", "retarded", "shitty", "GG", "fed"];

function randomize(){
    var random_noun = Math.floor(Math.random()*noun.length);
    var random_adjective = Math.floor(Math.random()*adjective.length);
    var string = adjective[random_adjective] + " " + noun[random_noun];
    document.getElementById("textbox").innerHTML = string;
}