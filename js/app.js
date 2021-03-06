/* ------- we sort randomly the card array,
from James Padolsey's https://j11y.io/javascript/shuffling-the-dom ------- /*/
function shuffle(elems) {
    allElems = (function(){
	var ret = [], l = elems.length;
	while (l--) { ret[ret.length] = elems[l]; }
	return ret;
    })();

    var shuffled = (function(){
        var l = allElems.length, ret = [];
        while (l--) {
            var random = Math.floor(Math.random() * allElems.length),
                randEl = allElems[random].cloneNode(true);
            allElems.splice(random, 1);
            ret[ret.length] = randEl;
        }
        return ret;
    })(), l = elems.length;

    while (l--) {
        elems[l].parentNode.insertBefore(shuffled[l], elems[l].nextSibling);
        elems[l].parentNode.removeChild(elems[l]);
    }
}
shuffle( document.getElementsByTagName('li') );
// ------- end code from James Padolsey's https://j11y.io/javascript/shuffling-the-dom/ -------



// ------- Create reload button -------
let reloadButton = document.querySelectorAll(".fa-undo");
reloadButton.forEach(function(element){
  element.addEventListener("click", reload);
})


function reload(){
  window.location.reload();
}




// -------  set timer, incrementing by seconds -------
// from https://stackoverflow.com/questions/10586890/increment-integer-by-1-every-1-second
var seconds = 0;
var interval = setInterval( increment, 1000);

function increment(){
  seconds = seconds % 360 + 1;
  document.querySelector("p.seconds").innerHTML =seconds + " seconds";
}
increment();



// ------- Create a clickable group of cards -------
const list = document.querySelector(".card-deck");
list.addEventListener("click", clickedCard);



// ------- Here we will compare 2 cards that have been turned -------
let cardsTurned = [];
let cardsId = [];


// ------- Start counting player's moves -------
let moves = 0;
function addMoves(){
    moves ++;

  //We add up the click to our moves counter
  document.querySelector("span.moves").innerHTML = moves;

  // Substract star from score
   function substractStar(x) {
     let star = document.querySelector("#star-" + x);
     star.className = "far fa-star";
   }

   //When to substract the star
   if (moves === 22){
     substractStar(1);
   }else if (moves == 44) {
     substractStar(2);
   }
}



// ------- We click the cards to turn them -------
function clickedCard(event){
  if(event.target && event.target.nodeName == "LI") {
    event.target.addEventListener("click", clickedCard);
    // Turning the cards is just changing the background color to reveal the hidden text
    event.target.style.backgroundColor= "#00d37e";
    const cardClass = event.target.className;
    const cardId = event.target.id;

    /* If no other card in cardId has the same id as the event.target,
    we add event.target's id to the array.
     Also, if a card has a match, we take from it the possibility of being played again. */
    if (cardsId.includes(cardId) || event.target.classList.length === 3){
      true;
    } else {
      // Add the click to the moves counter
      addMoves();
      // Check for potential matches
      cardsTurned.push(cardClass);
      cardsId.push(cardId);
      checkingTurned();
    }
  }
}



function checkingTurned(){
  if (cardsTurned.length === 2){
    // Comparing if a pair matches
    if (cardsTurned[0] !== cardsTurned[1]){
      // We won't be able to turn cards while we wait for the pair to turn back around (1 sec)
      list.removeEventListener("click", clickedCard);
      setTimeout(turnAround, 1000);
    } else {
      const cardOne = document.getElementById(cardsId[0]);
      const cardTwo = document.getElementById(cardsId[1]);
      cardOne.classList.add("match");
      cardTwo.classList.add("match");
      // If they match, empty comparison arrays
      cardsTurned = [];
      cardsId = [];

      //We want to know if we won
      gameOver();
    }
  }
}



// ------- Turn back around cards that are not similar -------
function turnAround(){
  // We want to make cards clickable again
  list.addEventListener("click", clickedCard);
  document.getElementById(cardsId[0]).style.backgroundColor = "#ffffff";
  document.getElementById(cardsId[1]).style.backgroundColor = "#ffffff";

  //Empty comparison arrays
  cardsTurned = [];
  cardsId = [];
}



// -------  Check if all cards have been turned -------
function gameOver(){
  let cardToCheck = document.getElementsByTagName("LI");
  let turnedCards = [];
  for (i of cardToCheck){
    if (i.hasAttribute("style") && i.attributes.style.value === "background-color: rgb(0, 211, 126);") {
        turnedCards.push(i);
    } if (turnedCards.length === 16) {
      // Stop cards from being clickable
        list.removeEventListener("click", clickedCard);
      //update modal content, open modal
        changeText();
        openModal();
        // We want to be tidy
        clearInterval(interval);
    }
  }
}

// ------- Modal from w3cschools.org -------
// Get the modal
var modal = document.getElementById('modal');


// Get the <span> element that closes the modal
var span = document.querySelector("span.fa-window-close");

// When the game ends, open the modal
function openModal() {
  modal.style.display = "block";
}

//Modal content written by me

function changeText() {
  const modalText = document.querySelector(".modal-content p");
  const starRating = document.querySelector(".modal-content .final-stars");
  modalText.innerHTML = "You won in: " + "\n" + document.querySelector("p.seconds").innerHTML;
  starRating.innerHTML = document.querySelector(".stars").innerHTML;
  //document.querySelector(".modal-content .moves").textContent = "";

}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
