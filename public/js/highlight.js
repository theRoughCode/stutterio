// function splitText(text, callback) {
//   var arr = text.trim().split(' ');
//   var counter = 0;
//   for (var i = arr.length - 1; i >= 0; i--) {
//     if ((arr[i].includes('<') || arr[i].includes('='))) {
//       if (i < arr.length - 1) arr[i + 1] = arr[i].concat(arr[i+1]);
//       else arr[i - 1] = arr[i - 1].concat(arr[i]);
//       arr.splice(i, 1);
//     } else if (arr[i].includes('>')) {
//       if (i > 0) arr[i - 1] = arr[i - 1].concat(arr[i]);
//       else arr[i + 1] = arr[i].concat(arr[i + 1]);
//       arr.splice(i, 1);
//     }
//     counter++;
//     if (counter >= arr.length) return callback(arr);
//   }
// }

function highlightWords(speech, text, callback) {
  var arr = text.trim().split(' ');
  const OPEN_SPAN = '<span>';
  const CLOSE_SPAN = '</span>';
  var index = arr.indexOf(CLOSE_SPAN);
  if (index === -1) {
    arr.unshift(OPEN_SPAN, CLOSE_SPAN);
    index = 1;
  }
  var readArr = arr.splice(0, index + 1);
  var nextFew = arr.slice(0, 5).map(word => word.toLowerCase().replace('<a>', '').replace('</a>', '').replace(/\W/g, ''));
  var lastSpokenWord = speech.split(' ').splice(-1)[0].replace(/\W/g, '');
  var foundIndex = nextFew.indexOf(lastSpokenWord.toLowerCase());
  if (foundIndex > -1) {
    var newlyRead = arr.splice(0, foundIndex + 1);
    readArr.splice(-1, 0, ...newlyRead);
    readArr = readArr.concat(arr);
    callback(readArr.join(" "), readArr.indexOf(CLOSE_SPAN), readArr.length);
  } else callback(null, null, null);
}

function updateStutList(spanPos) {
  const stutDom = document.querySelector('.stutter');
  if(!stutDom) return;
  const stutList = JSON.parse(stutDom.innerHTML);
  stutDom.innerHTML = JSON.stringify(stutList.filter(obj => obj.index > spanPos));
}

// function parseStutterWord(word, callback) {
//   var startIndex = word.indexOf('>') + 1;
//   var endIndex = word.indexOf('<', startIndex);
//   callback(word.slice(startIndex, endIndex));
// }

// function populateWord(word, synonyms) {
//   return `<a class="stutter" data-length="${synonyms.length}" data-synonyms="${synonyms}">${word}</a>`;
// }

/**
 * Takes in user's text and list of potential stutters, and highlights and provides synonyms
 */
function optimizeScript(text, stutList, callback) {
  if (!stutList) return callback(text);
  else stutList = JSON.parse(stutList);

  stutList.sort((a, b) => a.index - b.index);
  var textArr = text.split(" ");

  var count = 0;
  stutList.forEach(entry => {
    count++;
    textArr[entry.index] = `<a>${textArr[entry.index]}</a>`;
    if (count === stutList.length) {
      return callback(textArr.join(" "));
    }
  })
}

function updateCarousel() {
  const html = document.querySelector('.stutter').innerHTML;
  if (!html.length) {
    document.querySelector('.threshold').classList.add('hidden');
    return;
  }
   const wordsArr = JSON.parse(html);
   const words = wordsArr.sort((a, b) => a.index - b.index)[0].synonyms;
   var len = words.length;
   if (!len) {
     document.querySelector('.threshold').classList.add('hidden');
     return;
   } else {
     var index = 0;
       $(document).ready(function(){
         for(var i=0 ; i< len ; i++) {
           $('<div class="item"><div class="carousel-caption" id="carousel'+i+'"></div>   </div>').appendTo('.carousel-inner');
           $('<li data-target="#myCarousel" data-slide-to="'+i+'"></li>').appendTo('.carousel-indicators')
        }
        $('.item').first().addClass('active');
        $('.carousel-indicators > li').first().addClass('active');
        $(".carousel-caption").each(function(i) {
            $(this).text(words[index]);
             ++index;
         });
         index = 0;

         $('#myCarousel').carousel();
       } );
   }
 }
