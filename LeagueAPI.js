var apikey = "fa1cdffc-714b-4d5e-9dbf-a53c8df2db66";
var sList = new Array();
var mList = new Array();
var Champion;
var masteryIDList = new Array();
var masteryNameList = new Array();
var masteryString = "";


function startup(){
    //IDfromSummonerName("Lil Guy");
    var input = document.getElementById("champname").value;
    console.log(input);
    var isvalid = true;
    if(input == ""){
        alert("Cannot be blank!");
        isvalid = false;
    }
    
    if(isvalid){
        var champID = "" + GetChampID(input);
        if(champID <= 0){
            alert("invalid champion name!");
            isvalid = false;
        }
    }
    if(isvalid){
        sList = [];
        sList = [];
        Champion = champID;
        var IDlist = [];
        var namelist = [];
        fetchMasteryIDs();
        GetListOfChallengers(IDlist, namelist);
        GetListOfGames(champID, namelist, IDlist);
    }

}

function IDfromSummonerName(Name){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+ Name+ "?    api_key=" + apikey, false);
    xhr.send();  
    
    var response = xhr.responseText;
    console.log(response);
    var IDidx = response.indexOf("id");
    var commaidx = response.indexOf(",", IDidx);
    var ID = response.substring(IDidx+4, commaidx);
    console.log(ID);    

    }

function GetListOfChallengers(IDlist, namelist){
    var xhr = new XMLHttpRequest();   
    xhr.open("GET", "https://na.api.pvp.net/api/lol/na/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=" + apikey, false);
    xhr.send();

    var response = xhr.responseText;
    var key = "playerOrTeamId";
    var currplayeridx = 0;
    var currcommaidx = 0;
        while(response.indexOf(key, currplayeridx) >= 0){
            currplayeridx = response.indexOf(key, currplayeridx) + key.length + 3;
            currcommaidx = response.indexOf(",", currplayeridx) - 1;
            IDlist.push(response.substring(currplayeridx, currcommaidx));
            currplayeridx = currcommaidx;    
    
        }
    var key2 = "playerOrTeamName";
    currplayeridx = 0;
    currcommaidx = 0;
        while(response.indexOf(key2, currplayeridx) >= 0){
            currplayeridx = response.indexOf(key2, currplayeridx) + key.length + 5;
            currcommaidx = response.indexOf(",", currplayeridx) - 1;
            namelist.push(response.substring(currplayeridx, currcommaidx));
            currplayeridx = currcommaidx;    
    
        }
    
    }   

function GetChampID(champname){
    var xhr = new XMLHttpRequest();     
    xhr.open("GET", "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key=" + apikey, false);
    xhr.send();
    
    var response = xhr.responseText;
    var champNameIdx = response.indexOf(champname);
    if(champNameIdx < 0)
        return -1;
    var champIDidx = response.indexOf("id", champNameIdx) + 4;
    var commaidx = response.indexOf(",", champIDidx)
    var champID = parseInt(response.substring(champIDidx, commaidx));
    console.log(champID);
    return champID;
    
    
}

function GetListOfGames(champID, nameList, idlist){
    var max = parseInt(document.getElementById("nChallangers").value);
    matchListRequest(champID, nameList, idlist, 0, max);
    
}

function matchListRequest(champID, nameList, idlist, i, max){
    console.log(i);
    URL = "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/"+idlist[i]+"?championIds="+champID+"&rankedQueues=RANKED_SOLO_5x5&seasons=PRESEASON2016&api_key=" + apikey;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        document.getElementById("textbox").innerHTML = "loading " + (i+1) + "/"+max;
        if(xhr.status == 200 && xhr.readyState == 4){
            console.log(i + " Summoner Checked: " + nameList[i]);
            var response = xhr.responseText;
            var matchIDs = GetMatchIDs(response);
            if(matchIDs.length >0){
                console.log("found games");
                sList.push(nameList[i]);
                mList.push(matchIDs);
            }
            if(i<max-1){
                sleep(1000);
                matchListRequest(champID, nameList, idlist, i+1, max);
            }
            else
                createSelect();
        }
        if(xhr.status == 429 && xhr.readyState == 4){
            console.log("Fetch rate limit exceeded checking: " + nameList[i]);
            console.log("Attempting to refetch");
            sleep(5000);
            matchListRequest(champID, nameList, idlist, i, max);
        }
    };
    xhr.open("GET", URL, true);
    xhr.send();
}


function GetMatchIDs(response){
    
    //console.log(response);
    var key = "matchId";
    var list = [];
    var currmatchidx = 0;
    var currcommaidx = 0;
        while(response.indexOf(key, currmatchidx) >= 0){
            currmatchidx = response.indexOf(key, currmatchidx) + key.length + 2;
            currcommaidx = response.indexOf(",", currmatchidx);
            list.push(response.substring(currmatchidx, currcommaidx));
            currmatchidx = currcommaidx;    
    
        }
    return list;
}
    
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function createSelect(){
    
    var select = document.createElement("SELECT");
    select.id = "summoner";
    document.body.appendChild(select);
    for(var i=0; i < sList.length; i++){
        var option = document.createElement("option");
        option.text = sList[i] + " - Games: " + mList[i].length;
        option.value = i;
        select.add(option);
    }
    var button = document.createElement("BUTTON");
    button.textContent = "Get Masteries";
    button.onclick = function() { 
        clearMasteryString();
        var summ = document.getElementById("summoner").value;
        console.log(summ);
        GetGameData();
        writeTextbox(masteryString);
    }
    document.body.appendChild(button);
}
    
    
function GetGameData(){
    var summ = document.getElementById("summoner").value;
    var matchids = mList[summ];
    console.log(matchids);
    for(var i=0; i <matchids.length; i++){
        sleep(1000);
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", "https://na.api.pvp.net/api/lol/na/v2.2/match/"+ matchids[i]+"?api_key=" + apikey, false);
        xhr.send();
            
        var response = xhr.responseText;
        masteryString += "<br><b>Game " + i + "</b><br>";
        findMasteries(response);
       
    }
}


function findMasteries(response){
    var champidx = response.indexOf('"championId":' + Champion);
    var masteriesidx = response.indexOf("masteries", champidx);
    var nextbraket = response.indexOf("]", champidx);
    var gamemasteries = response.substring(masteriesidx, nextbraket);
    console.log(gamemasteries);
    appendmasteryString(gamemasteries);
    
}

function fetchMasteryIDs(){
    var xhr = new XMLHttpRequest(); 
        xhr.open("GET", "https://global.api.pvp.net/api/lol/static-data/na/v1.2/mastery?api_key=" + apikey, false);
        xhr.send();
        
        var response = xhr.responseText;
        var key = '"id"';
        var currididx = 0;
        var currnameidx = 0;
        var currcommaidx = 0;
        while(response.indexOf(key, currididx) >= 0){
            currididx = response.indexOf(key, currididx) + key.length + 1;
            currnameidx = response.indexOf('"name"', currididx + 1) + 8;
            masteryIDList.push(response.substr(currididx, 4));
            currcommaidx = response.indexOf(",", currnameidx) -1;
            masteryNameList.push(response.substring(currnameidx, currcommaidx));
            currididx = currcommaidx;    
    
        }
    
    
}

function appendmasteryString(gamemasteries){
        var key = '"masteryId"';
        var currididx = 0;
        var currrankidx = 0;
        var currbracketidx = 0;
        while(gamemasteries.indexOf(key, currididx) >= 0){
            currididx = gamemasteries.indexOf(key, currididx) + key.length + 1;
            currrankidx = gamemasteries.indexOf('"rank"', currididx + 1) + 7;
            var nextmastery = masteryNameFromID(gamemasteries.substr(currididx, 4));
            masteryString += nextmastery + " : ";
            currbracketidx = gamemasteries.indexOf("}", currrankidx);
            masteryString += gamemasteries.substring(currrankidx, currbracketidx) +"<br>";
            currididx = currbracketidx;    
    
        }
    
    
}

function masteryNameFromID(id){
    for(var i=0; i<masteryIDList.length; i++){
        if(masteryIDList[i] == id)
            return masteryNameList[i];
    }
    return "";
    
    
}

function clearMasteryString(){
    masteryString = "";   
}
function writeTextbox(string){
document.getElementById("textbox").innerHTML = string;        
    
}
    
    




