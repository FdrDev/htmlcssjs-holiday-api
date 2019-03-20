

/*
prima di stampare con printTitle mi serve ricavare il nome del mese in corso
##RESTITUISCE IL MESE CORRENTE##
*/
function getMonthName(month){
  /*inizializzo l'oggetto moment() così da sfruttarne le opzioni*/
  var mom = moment();
  /*stabilisco in che mese siamo*/
  mom.month(month);
  /*decido il formato da utilizzare. MMMM stampa il nome del mese per esteso*/
  var monthName = mom.format("MMMM");

  return monthName;
}

/*
##RESTITUISCE LA DURATA DEL MESE VISUALIZZATO##
*/
function getMonthDayCount(year,month){
  var mom = moment(); //vedi funzione getMonthName per spiegazione
  mom.month(month);
  mom.year(year);

  /*mom.daysInMonth() mi dice automaticamente quanti giorni ci sono un quel mese*/
  var dayCount = mom.daysInMonth();
  return dayCount;
}


/*
##RESTITUISCE LA DATA COMPLETA##
*/
function getHumanDate(year,month,day) {
  /*nell'oggetto "date" (quello del template)
  più in basso, devo stampare la data
  mi serve quindi avere un oggetto moment()*/
  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format("DD MMMM YY")
  return date;
}

/*
##NON SO ANCORA COME SPIEGARLA MA MI SERVE PER IL TAG MACHINEDATE DI HANDLEBARS##
*/
function getMachineDate(year,month,day) {
  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format("YYYY-MM-DD");
  return date;
}



/*
##STAMPA L'ANNO E IL MESE##
*/
function printTitle(year,month){
 var h1MontName = $("#month-name");
 var monthName = getMonthName(month);
 var dayCount = getMonthDayCount(year,month);

 h1MontName.text(monthName + " | 1 - " + dayCount);
}

/*
##STAMPA I GIORNI DEL MESE##
*/
function printDays(year,month) {
  /*Serve il numero dei giorni del mese corrente*/
  var dayCount = getMonthDayCount(year,month);
  /*Selettore che decide dove stampare i giorni*/
  var ulDayList = $("#day-list")

  /*appendo i contenuti al template di handlebars*/
  var template = $("#day-template").html();
  var compiled = Handlebars.compile(template);

  /*Questo ciclo appende tutti i giorni del mese
  ad ogni ciclo aggiorna il nome del giorno e il numero*/
  for (var day = 1; day <= dayCount; day++) {

      var templateDate = {
        machineData: getMachineDate(year,month,day),
        date: getHumanDate(year,month,day)
    }
    /*appendo ora i giorni*/
    var liDay = compiled(templateDate);
    ulDayList.append(liDay);
  }


}

/*
##SEGNA I GIORNI DI VACANZA##
*/
function printHolidays(year,month){
  var outData= {
    year:year,
    month:month
  }

  $.ajax({
    url:"https://flynn.boolean.careers/exercises/api/holidays",
    data:outData,
    method:"GET",
    success:function(inData, state) {
      if(inData.success){
        var holidays = inData.response;
        addHolidayHighlight(holidays);
      } else{
        console.log("COMMUNICATION ERROR");
      }
    },
    error:function(request, state, error ) {
      console.log("request", request);
      console.log("state", state);
      console.log("error", error);
    }
  });
}

/*
##FUNZIONE CHE PORTA FUORI IL RISULTATO DELLA CHIAMATA AJAX DI SOPRA##
##E RICONOSCE QUALI GIORNI SONO DI VACANZA##
*/
function addHolidayHighlight(holidays){
  /**Controllo ogni elemento della lista per trovare i giorni di vacanza*/
  for (var i = 0; i < holidays.length; i++) {
    var holiday = holidays[i];

    /*Questi sono i valori ricavati dall'ajax, date e name*/
    var holidayMachineDate = holiday.date;
    var holidayName = holiday.name;

    /*selector è un particolare selettore che prende l'attributo "data-" contenuto nel TAG
    in questo caso <li>*/
    var selector = "li[data-date='" + holidayMachineDate + "']";
    var liHoliday = $(selector);
    console.log(selector);

    /*Aggiungo il nome della festività*/
    liHoliday.text(liHoliday.text() + " " + holidayName);
    /*Add classe holiday*/
    liHoliday.addClass("holiday");
  }

}



function init() {
  /*Creo le variabili del mese e dell'anno così da richiamarle all'occorrenza*/
  var year = 2018;
  var month= 0; // 0 -> gennaio | 11 -> dicembre

  printTitle(year,month);
  printDays(year,month);
  printHolidays(year,month);
}

$(document).ready(init);
