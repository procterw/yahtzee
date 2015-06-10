var exports = module.exports = {};

// Instantiate a new game with n players
// When everyone is ready 
module.exports= function(players) {

  this.players = players;
  this.turnCount = 1;
  this.currentPlayer = 1;

  // Intern
  this.newTurn = function() {
    this.currentPlayer = this.currentPlayer === players.length ? 0: this.currentPlayer + 1;
    this.turnCount++;
  }

  // this.scorecards = [];
  // for (var i=0; i<players.length; i++) {
  // 	this.scorecards.push(new scorecard(players[i], i));
  // }

  return this;

};

// // Create a new scorecard
// var scorecard = function (name, id) {

//   var card = {};

//   card.name = name;
//   card.id = id;

//   // Add points to yahtzee if there is already a scored yahtzee
//   // and another is rolled and used elsewhere
//   card.yahtzeeBonus = function(score) {
//     if (card.lowerScores[5].score > 0 && scoreYahtzee() > 0) {
//       card.lowerScores[5].score += 100;
//     }
//   }


//   // The upper scores
//   card.upperScores = [{
//       name: "Ones",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(1)
//   }, {
//       name: "Twos",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(2)
//   }, {
//       name: "Threes",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(3)
//   }, {
//       name: "Fours",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(4)
//   }, {
//       name: "Fives",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(5)
//   }, {
//       name: "Sixes",
//       score: null,
//       isScored: false,
//       tally: scoreUpper(6)
//   }];

//   function scoreUpperSubtotal() {
//       return arrSum(collectScores(card.upperScores));
//   };

//   function scoreBonus()  {
//       if (scoreUpperSubtotal(card.upperScores) >= 63) {
//           return 30;
//       } else {
//           return 0;
//       }
//   };

//   function scoreUpperTotal() {
//       return scoreUpperSubtotal(card.upperScores) + scoreBonus(card.upperScores)
//   };

//   card.upperTotal = [{
//       name: "Subtotal",
//       score: scoreUpperSubtotal
//   }, {
//       name: "Bonus [63]",
//       score: scoreBonus
//   }, {
//       name: "Upper total",
//       score: scoreUpperTotal
//   }];

//   card.lowerScores = [{
//       name: "Three of a kind",
//       score: null,
//       isScored: false,
//       tally: scoreThreeOAK
//   }, {
//       name: "Four of a kind",
//       score: null,
//       isScored: false,
//       tally: scoreFourOAK
//   }, {
//       name: "Full house",
//       score: null,
//       isScored: false,
//       tally: scoreFullHouse
//   }, {
//       name: "Small straight",
//       score: null,
//       isScored: false,
//       tally: scoreStraight(4)
//   }, {
//       name: "Large straight",
//       score: null,
//       isScored: false,
//       tally: scoreStraight(5)
//   }, {
//       name: "Yahtzee",
//       score: null,
//       isScored: false,
//       tally: scoreYahtzee
//   }, {
//       name: "Chance",
//       score: null,
//       isScored: false,
//       tally: scoreChance
//   }];

//   function scoreLowerTotal() {
//       return arrSum(collectScores(card.lowerScores));
//   };

//   function scoreTotal() {
//       return scoreUpperTotal(card.upperScores) + scoreLowerTotal(card.lowerScores);
//   };

//   card.lowerTotal = [{
//       name: "Lower total",
//       score: scoreLowerTotal
//   }, {
//       name: "Total",
//       score: scoreTotal
//   }];

//   // card.submitScore = function (score) {
//   //     score.score = score.tally();
//   //     score.isScored = true;
//   //     // dice.newTurn();
//   // };

//   // card.resetScores = function () {
//   //   function reset (score) {
//   //     for (var i=0; i<score.length; i++) {
//   //       score[i].score = 0;
//   //       score[i].isScored = false;
//   //     }
//   //   }
//   //   reset(card.upperScores);
//   //   reset(card.lowerScores);
//   // }

//   return card;



//   // Returns the sum of an array
//   function arrSum(arr) {
//       var sum = 0;
//       for (var i = 0; i < arr.length; i++) {
//           sum += arr[i];
//       }
//       return sum;
//   };

//   // Returns an array of values of an array of objects
//   function arrVals(arr, property) {
//       var vals = [];
//       for (var i = 0; i < arr.length; i++) {
//           vals.push(arr[i][property]);
//       }
//       return vals;
//   };

//   // Returns an array of scores for a given score sheet
//   function collectScores(scoreSheet) {
//       var arr = [];
//       for (var i = 0; i < scoreSheet.length; i++) {
//           arr.push(scoreSheet[i].score);
//       }
//       return arr;
//   };

//   // How many instances of dice value are there?
//   function getRepeats(arr) {
//       var counts = [];
//       for (var i = 1; i <= 6; i++) {
//           var count = 0;
//           for (var j = 0; j < arr.length; j++) {
//               if (arr[j] == i) {
//                   count++;
//               }
//           }
//           counts.push(count);
//       }
//       return counts;
//   };

//   // Does the array contain a straight of size x?
//   function straightOfSize(arr, cutoff) {
//       var streak = 0;
//       for (var i = 0; i < arr.length; i++) {
//           if (arr[i] > 0) {
//               streak += 1;
//               if (streak >= cutoff) {
//                   return true;
//               }
//           } else {
//               streak = 0;
//           }
//       }
//       return false;
//   };

//   function scoreUpper(val, dice) {
//       return function () {
//           var total = 0;
//           for (var i = 0; i < dice.length; i++) {
//               if (dice[i].value == val) {
//                   total = total + val;
//               }
//           }
//           return total;
//       };
//   };

//   function scoreThreeOAK(dice) {
//     console.log("scoring threeOak, " + dice)
//       var counts = getRepeats(arrVals(dice, "value"));
//       if (counts.indexOf(3) >= 0 || counts.indexOf(4) >= 0 || counts.indexOf(5) >= 0) {
//           return arrSum(arrVals(dice, "value"));
//       } else {
//           return 0;
//       }
//   };

//   function scoreFourOAK(dice) {
//       var counts = getRepeats(arrVals(dice, "value"));
//       if (counts.indexOf(4) >= 0 || counts.indexOf(5) >= 0) {
//           return arrSum(arrVals(dice, "value"));
//       } else {
//           return 0;
//       }
//   };

//   function scoreFullHouse(dice) {
//       var counts = getRepeats(arrVals(dice, "value"));
//       if (counts.indexOf(3) >= 0 & counts.indexOf(2) >= 0 || counts.indexOf(5) >= 0) {
//           return 25;
//       } else {
//           return 0;
//       }
//   };

//   function scoreStraight(size) {
//       return function () {
//           var counts = getRepeats(arrVals(dice, "value"));
//           var isStraight = straightOfSize(counts, size);
//           var score = size == 4 ? 30 : 40;
//           return isStraight || counts.indexOf(5) >= 0 ? score : 0;
//       };
//   };

//   function scoreYahtzee(dice) {
//       var counts = getRepeats(arrVals(dice, "value"));
//       return counts.indexOf(5) >= 0 ? 50 : 0;
//   };

//   function scoreChance(dice) {
//       return arrSum(arrVals(dice, "value"));
//   };

// };
