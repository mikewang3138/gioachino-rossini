var apikey = "fa1cdffc-714b-4d5e-9dbf-a53c8df2db66";

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
        var IDlist = [];
        var namelist = [];
        GetListOfChallengers(IDlist, namelist);
        GetMasteries(champID, namelist, IDlist);
        //var sumname = NameFromID("138243");
        //console.log(sumname);
        //console.log(IDlist);
        //console.log(namelist);
     
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

function GetMasteries(champID, nameList, idlist){
    var sList = [];
    var mList = [];
    for(var i=0; i < idlist.length; i++){
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/"+ idlist[i] + "?championIds="+ champID + "&rankedQueues=RANKED_SOLO_5x5&seasons=PRESEASON2016&api_key" + apikey, false);
        xhr.send();
        
        var response = xhr.responseText;
        var matchIDs = GetMatchIDs(response);
        if(matchIDs.length >0){
            sList.push(nameList[i]);
            mList.push(matchIDs);
        }
        
    }  
    console.log(sList);
    console.log(mList);
    
    
}


function GetMatchIDs(response){
   
    var key = "matchID";
    var list = [];
    var currmatchidx = 0;
    var currcommaidx = 0;
        while(response.indexOf(key, currmatchidx) >= 0){
            currmatchidx = response.indexOf(key, currmatchidx) + key.length + 3;
            currcommaidx = response.indexOf(",", currmatchidx) - 1;
            list.push(response.substring(currmatchidx, currcommaidx));
            currmatchidx = currcommaidx;    
    
        }
    return list;
}
    
function NameFromID(ID){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "https://na.api.pvp.net/api/lol/na/v1.4/summoner/" + ID + "api_key" + apikey, false);
    xhr.send();
    
    var response = xhr.responseText;
    var nameidx = response.indexOf("name");
    var theid = response.substring(nameidx+2, response.indexOf(",", nameidx)-1);
    return theid;
}
    
    




