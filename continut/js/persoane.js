window.addEventListener('load',LoadingPeople);

function LoadingPeople() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var xmlDoc = this.responseXML;

          var tabel = document.createElement("table");
          var headtable = tabel.createTHead();
          var rowhead = headtable.insertRow();

        //introducem numele coloanelor
          var RowTable1 = rowhead.insertCell(0);
          var RowTable2 = rowhead.insertCell(1);
          var RowTable3 = rowhead.insertCell(2);
          var RowTable4 = rowhead.insertCell(3);
          var RowTable5 = rowhead.insertCell(4);
          var RowTable6 = rowhead.insertCell(5);
          
          
          RowTable1.innerHTML = "<b>Nume</b>";
          RowTable2.innerHTML = "<b>Prenume</b>";
          RowTable3.innerHTML = "<b>Varsta</b>";
          RowTable4.innerHTML = "<b>Adresa</b>";
          RowTable5.innerHTML = "<b>Telefon</b>";
          RowTable6.innerHTML = "<b>Email</b>";
          

          //Se preiau informatiile din xml pentru a se completa tabelul 
          var corpTabel = tabel.createTBody();
          var persoane = xmlDoc.getElementsByTagName("persoana");
          for (var i = 0; i < persoane.length; i++) {
              var randTabel = corpTabel.insertRow();
              var Cell1 = randTabel.insertCell(0);
              var Cell2 = randTabel.insertCell(1);
              var Cell3 = randTabel.insertCell(2);
              var Cell4 = randTabel.insertCell(3);
              var Cell5 = randTabel.insertCell(4);
              var Cell6 = randTabel.insertCell(5);
              
              
              Cell1.innerHTML = persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
              Cell2.innerHTML = persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;
              Cell3.innerHTML = persoane[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
              Cell4.innerHTML = persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("strada")[0].childNodes[0].nodeValue + ", " + persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("numar")[0].childNodes[0].nodeValue + ", " + persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("localitate")[0].childNodes[0].nodeValue + ", " + persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("judet")[0].childNodes[0].nodeValue + ", " + persoane[i].getElementsByTagName("adresa")[0].getElementsByTagName("tara")[0].childNodes[0].nodeValue;
              Cell5.innerHTML = persoane[i].getElementsByTagName("numartelefon")[0].childNodes[0].nodeValue;
              Cell6.innerHTML = persoane[i].getElementsByTagName("email")[0].childNodes[0].nodeValue;
              
            
          }
          tabel.classList.add("tabel-stilizat");
          var tabelContainer = document.getElementById("tabel-container");
          tabelContainer.innerHTML = "";
          tabelContainer.appendChild(tabel);
      }
  };
  xhttp.open("GET", "persoane.xml", true);


  
  xhttp.send();
}