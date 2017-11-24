// Create characters available radio buttons
function createCharAvailableRadio(num) {

  //create options based on length of the word and available characters
  var maxChars = 11;
  var selLength = maxChars - num;

  //get button group element and empty it
  document.getElementById('numChar').innerHTML = "";

  var buttons = "";

  for(i=0; i < selLength; i++){

    //generate and add option to select
    buttons += "<label class=\"btn btn-primary\"><input type=\"radio\" name=\"options2\" id=\"option" + num + "\" value=\"" + num + "\" autocomplete=\"off\"> " + num + "</label>";

    //increase num variable with 1
    num++;
  }

  //add button to group numChar
  document.getElementById('numChar').innerHTML = buttons;

  //show numCharDiv
  document.getElementById('numCharDiv').style.display = "block";
}


//Create input field on choice of number of characters
function createCharFields(num) {

  //get getElementById
  var inputDiv = document.getElementById('inputDiv');

  //empty inputDiv (input fields)
  inputDiv.innerHTML = "";

  //create input fields
  for(j=0; j < num; j++) {

    inputDiv.innerHTML += "<span><input class=\'form-control charInput\' pattern=\'[A-Za-z]{1}\' type=\'text\' maxlength=\'1\' id=\'" + j +"\'></span>";
  }

  //show charactersDiv
  document.getElementById('charactersDiv').style.display = "block";

  //focus on next on input, .form-control is watched {
  $(".form-control").keyup(function() {

    // get this input-group and find the closest input (where you have keyed up)
    var inputs = $(this).closest('.input-group').find(':input');
    // get your keyed up input field and focus to next.
    inputs.eq( inputs.index(this)+ 1 ).focus().select();
  });
}


//show progress bar
function updateProgress(curIter, fullLength){

  var percentDone = Math.round((curIter / fullLength)*100);

  //set progress bar
  progBar = document.getElementsByClassName('progress-bar')[0];

  //set style width
  progBar.style = "width:" + percentDone + "%";

  //set innerHTML
  progBar.innerHTML = "              " + percentDone + "%            ";
}


// get the input values
function getInputChars(){

  // get number of elements in the inputDiv fields
  var elementCount = document.getElementById('inputDiv').children.length;

  var inputStr = "";

  //get get values from field ID's
  for (k=0; k < elementCount; k++){

    var InputValue = document.getElementById(k).value;

    // check if all field are filled in
    if (!InputValue) { alert('please fill in all character fields'); return; }

    //push value to inputStr
    inputStr += InputValue.toLowerCase();
  }
  return inputStr;
}


// check characters with library
function checkWoord() {

  //hide noResult element when it is shown
  document.getElementById('noResult').style.display = 'none';
  document.getElementById('outputDiv').style.display = 'none';

  //URL variables
  var HREF = window.location.href;
  var lang = 'dutch';
  var charSearch = getInputChars();
  var wordLength = $('input[name=options]:checked').val();

  //create URL
  var URL = HREF + "checkWoord?lang=" + lang + "&charSearch=" + charSearch + "&wordLength=" + wordLength;

  //load dictionary file
  httpData(URL,'GET',"", function(res){

    var result = JSON.parse(res);

    console.log("checkWoord response: ", res);

    //empty output table
    document.getElementById('outputTable').innerHTML = "";
    var table = document.getElementById('outputTable').innerHTML;

    // check if libraryArray exists
    if (result.length < 1){
      console.log("no results returned.");
      document.getElementById('noResult').style.display = 'block';
    } else {

      console.log('results found');
      var tdCount = 0;
      // for each word found
      for (var j=0; j < result.length; j++) {

        var word = result[j];

        if (tdCount == 0) {
          table += "<tr>";
        }

        table += "<td>" + word + "</td>";

        if (tdCount == 4) {
          table += "</tr>";
          tdCount = 0;
        } else {
          tdCount++;
        }
      }
      document.getElementById('outputTable').innerHTML = table;
      document.getElementById('outputDiv').style.display = 'block';
      document.getElementById('progressDiv').style.display = 'none';
    }
  });
}





// Load when document is ready
$(document).ready(function() {

  //load on selection made at class wordLength
  $('#wordLength').change(function() {

    //get value of selected radio button
    createCharAvailableRadio($('input[name=options]:checked').val());
  });

  //Load on section made at id numChar
  $('#numChar').change(function() {

    //get value of selected options
    createCharFields($('input[name=options2]:checked').val());
  });

});
