
function data()
{
    var d=new Date();
    var doc = document.getElementById("demo");
    if (doc)
       doc.innerHTML=d.toUTCString();
}

function url()
{
  var url  = window.location.href; 
  var doc = document.getElementById("demo2");
  if(doc)
    doc.innerHTML=url;
}

 
function Versiune()
{
    let versiune = navigator.userAgent;
    var doc = document.getElementById("versiune");
    if(doc)
        doc.innerHTML = versiune;
}

function getLocation()
 {
    if(document.getElementById("locatie")){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            document.getElementById("locatie").innerHTML = "Geolocation is not supported by this browser.";
        }
    }
}
function locationDa()
{
    if(document.getElementById("geo")){
    navigator.geolocation.getCurrentPosition(
        (pos)=>{
            document.getElementById("geo").innerHTML="<h3> Lat: "+ pos.coords.latitude + " Long: "+ pos.coords.longitude + "</h3>";
        }
        )
    }
}

function showPosition(position) 
{
    x.innerHTML = "Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude;
}

function browser()
{
    var txt = "";
            txt += "<p>Versiune browser: " + navigator.userAgent + "</p>";
            txt += "<p>Cookies activate: " + navigator.cookieEnabled + "</p>";
            txt += "<p>Limbaj browser: " + navigator.language + "</p>";
            txt += "<p>Conexiune la internet: " + navigator.onLine + "</p>";
            txt += "<p>Header user-agent: " + navigator.userAgent + "</p>";

            document.getElementById("demo3").innerHTML = txt;
}

//sectiunea 2

function drawCanvas(event) {
  let canvas = document.getElementById("canva1");
  let rect = canvas.getBoundingClientRect(); // obține coordonatele mouse-ului relativ
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  //punctele dreptunghiului
  let first = [x, y];
  let second = [x + 20, y + 20];
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = document.getElementById("fontcontur").value;
  ctx.strokeStyle = document.getElementById("contur").value;
  //umple dreptunghiul  în care se specifică coordonatele și dimensiunile dreptunghiului, 
  ctx.fillRect(
    Math.min(first[0], second[0]),
    Math.min(first[1], second[1]),
    Math.abs(first[0] - second[0]),
    Math.abs(first[1] - second[1])
  );
  //în care se specifică coordonatele și dimensiunile dreptunghiului și conturul său.
  ctx.strokeRect(
    Math.min(first[0], second[0]) - 1,
    Math.min(first[1], second[1]) - 1,
    Math.abs(first[0] - second[0]) + 2,
    Math.abs(first[1] - second[1]) + 2
  );
}

function schimbaContinut(resursa,jsFisier,jsFunctie)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("continut").innerHTML = this.responseText;
     if (jsFisier) {
        var elementScript = document.createElement('script');
        elementScript.onload = function () {
        console.log("hello");
        if (jsFunctie) {
        window[jsFunctie]();
        }
        };
        elementScript.src = jsFisier;
        document.head.appendChild(elementScript);
        } else {
        if (jsFunctie) {
        window[jsFunctie]();
        }
        }
  };
}
xhttp.open("GET", resursa + ".html", true); // Deschiderea conexiunii și specificarea resursei cerute
xhttp.send(); // Trimiterea cererii
}

function insertRow() {
    var rowPosition = document.getElementById("rowPosition").value;
    var color = document.getElementById("colorpicker").value;
    var table = document.getElementById("myTable");

    var rowIndex;
    if (!isNaN(rowPosition)) {
        rowIndex = parseInt(rowPosition);
        if (rowIndex < 0 || rowIndex > table.rows.length) {
            alert("Poziție linie invalidă");
            return;
        }
    } else {
        alert("Poziția rândului trebuie să fie un număr");
        return;
    }

    var newRow = table.insertRow(rowIndex);
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        var cell = newRow.insertCell(i);
        cell.style.backgroundColor = color;
    }
}

function insertColumn() {
    var columnPosition = document.getElementById("columnPosition").value;
    var color = document.getElementById("colorpicker").value;
    var table = document.getElementById("myTable");

    var columnIndex;
    if (!isNaN(columnPosition)) {
        columnIndex = parseInt(columnPosition);
        if (columnIndex < 0 || columnIndex > table.rows[0].cells.length) {
            alert("Poziție coloană invalidă");
            return;
        }
    } else {
        alert("Poziția coloanei trebuie să fie un număr");
        return;
    }

    for (var i = 0; i < table.rows.length; i++) {
        var cell = table.rows[i].insertCell(columnIndex);
        cell.style.backgroundColor = color;
    }
}

function verificaUtilizator(){
    var xhttp = new XMLHttpRequest();
    var utilizator = document.getElementById("utilizator-verifica").value;
    var parola = document.getElementById("parola-verifica").value;
    
    xhttp.onreadystatechange = function() {
        //console.log("callback!");
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            text = JSON.parse(this.responseText);
            console.log(text);

            var ok = false;

            for(var index=0; index < text.length; index ++)
            {
                if(text[index].utilizator == utilizator && text[index].parola == parola){
                    ok = true;
                }
            }

            if(ok == true){
                document.getElementById("result-verifica").innerText = "Utilizatorul exista!";
            }
            else
            {
                document.getElementById("result-verifica").innerText = "Nu exista acest utilizator!";
            }
        }
    };
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();

}
