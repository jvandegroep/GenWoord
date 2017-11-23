// Generate characters available
function charAvailableSelect(num) {

  if (num == ""){
    num = 4;
  }

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
function wordChars(num) {

  //get getElementById
  var inputDiv = document.getElementById('inputDiv');

  //empty inputDiv
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
    inputs.eq( inputs.index(this)+ 1 ).focus();
  });
}


// get the input values and create unique combinations array
function getUniqueInputArrays(){

  // get number of elements in the inputDiv fields
  var elementCount = document.getElementById('inputDiv').children.length;

  // get number of word length of user
  var charCount = $('input[name=options]:checked').val();

  //create array with values
  var inputArray = [];

  //get get values from field ID's
  for (k=0; k < elementCount; k++){

    var InputValue = document.getElementById(k).value;

    // check if all field are filled in
    if (!InputValue) { alert('please fill in all character fields'); return; }

    //push to array
    inputArray.push(InputValue.toUpperCase());
  }

  var returnArray = [];
  returnArray = uniqueArray(charCombinations(inputArray, charCount));

  console.log("inputArray: ", inputArray);
  console.log("unique input combination array: ", returnArray);

  return returnArray;
}

//create combinations
function charCombinations(elements, size) {
    var result = [];

    if (size === 0) {

        result.push([]);
    } else {

        charCombinations(elements, size - 1).forEach(function (previousComb) {
            elements.forEach(function (element) {
                result.push([element].concat(previousComb));
            });
        });
    }
    return result;
}

// create an array with unique characters only
function uniqueArray(fullArray) {

  var uniqArray = [];

  for (i=0; i < fullArray.length; i++){

    fa = fullArray[i];

    if (!(hasDuplicates(fa))) {

      uniqArray.push(fa.join(""));
    }
  }
  return uniqArray;
}

// check if array has duplicate characters
function hasDuplicates(array) {

    var unique = array.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

    return unique.length !== array.length;
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


//check combination against dictionary file
function libraryCheck() {

  //show progress bar
  document.getElementById('progressDiv').style.display = 'block';

  //create URL
  var URL = window.location.href + "loadDic?lang=dutch";

  //load dictionary file
  httpData(URL,'GET',"", function(libStr){

    //convert lib string to array
    libArray = JSON.parse(libStr);

    // get word combinations array
    var inputUniqueArray = getUniqueInputArrays();

    //empty output table
    document.getElementById('outputTable').innerHTML = "";
    var table = document.getElementById('outputTable').innerHTML;

    // check if libraryArray exists
    if (libArray.length > 0){

      console.log('Comparing..');
      // for each unique word
      for (i=0, tdCount = 0; i < inputUniqueArray.length; i++) {

        //load progress bar
        updateProgress(i,inputUniqueArray.length);

        var ia = inputUniqueArray[i];

        // for each library word
        for (var j=0; j < libArray.length; j++) {

          var libEntry = libArray[j][0];

          // check if input word is equal to library entry
          if (ia == libEntry) {

            if(libEntry) {

              console.log("match found!",libEntry);
              if (tdCount == 0) {
                table += "<tr>";
              }

              table += "<td>" + libEntry + "</td>";

              if (tdCount == 4) {
                table += "</tr>";
                tdCount = 0;
                break;
              }

              tdCount++;
              break;
            }
          }
        }
      }
      document.getElementById('outputTable').innerHTML = table;
      document.getElementById('outputDiv').style.display = 'block';
      console.log("Finished comparing.");
      document.getElementById('progressDiv').style.display = 'none';

    } else {
      alert("No library file was uploaded, or the file is empty!");
    }
  });
}


// Load when document is ready
$(document).ready(function() {

  //load on selection made at class wordLength
  $('#wordLength').change(function() {

    //get value of selected options
    charAvailableSelect($('input[name=options]:checked').val());
  });

  //Load on section made at id numChar
  $('#numChar').change(function() {

    //get value of selected options
    wordChars($('input[name=options2]:checked').val());
  });



});
