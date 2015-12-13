var Yahtzee = angular.module("Yahtzee", ['ui.router']);

Yahtzee.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('menu', {
			url: '/',
			templateUrl: '/views/mainMenu.html',
			controller: 'mainMenuCtrl'
		})
		.state('roomSearch', {
			url: '/',
			templateUrl: '/views/roomSearch.html',
			controller: 'roomSearchCtrl'
		})
		.state('waitingRoom', {
			url: '/',
			templateUrl: '/views/waitingRoom.html',
			controller: 'waitingRoomCtrl'
		})
		.state('singleplayerGame', {
			url: '/',
			templateUrl: '/views/game.html'
		})
		.state('multiplayerGame', {
			url: '/',
			templateUrl: '/views/game.html',
			controller: 'multiplayerGame'
		})
		.state('scoreboard', {
			url: '/',
			templateUrl: '/views/scoreboard.html'
		})
		
	$urlRouterProvider.otherwise("/");

});

Yahtzee.controller('mainMenuCtrl', 
function($scope, $state) {

	$scope.singleplayerGame = function() {
		// $state.go('')
		console.log("this isn't a thing yet dude");
	};
	$scope.multiplayerGame = function() {
		$state.go('roomSearch');
	};

});



Yahtzee.controller('multiplayerGame',
function($scope, $state, gameFactory) {

	gameFactory.startGame();

	$scope.room = gameFactory.room;
	$scope.dice = gameFactory.dice;
	$scope.roll = gameFactory.roll;
	$scope.submitScore = gameFactory.submitScore;
	$scope.game = gameFactory.game;
	$scope.toggleHold = gameFactory.toggleHold;
	$scope.tally = gameFactory.tally;



});



// bleh, global for now
var _socket = io();





/////////////
/////////////
/////////////
/////////////
/////////////
// CHAT
/////////////
/////////////
/////////////
/////////////
/////////////

Yahtzee.controller("chatboxCtrl",
function($scope, chatFactory) {

	$scope.chats = chatFactory.chats;
	$scope.sendChat = chatFactory.sendChat;

});


Yahtzee.factory("chatFactory",
function($rootScope) {

	var vm = {};

	vm.chats = [];
	vm.sendChat = sendChat;

	_socket.on("chatSent", function(player, message) {
		vm.chats.push({player:player, message:message});
		$rootScope.$apply();
	});

	return vm;

	function sendChat(message) {
		_socket.emit("sendChat", message);
	};

});

/////////////
/////////////
/////////////
/////////////
/////////////
// WAITINGROOMS
/////////////
/////////////
/////////////
/////////////
/////////////


Yahtzee.controller('roomSearchCtrl', 
function($scope, roomFactory) {

	$scope.name = "Player";
	$scope.room = roomFactory.room;

	$scope.createRoom = roomFactory.createRoom;
	$scope.joinRoom = roomFactory.joinRoom;

});

Yahtzee.controller('waitingRoomCtrl',
function($scope, roomFactory) {

	$scope.room = roomFactory.room;
	$scope.isReady = roomFactory.isReady;
	$scope.leaveRoom = roomFactory.leaveRoom;

});

Yahtzee.factory("roomFactory", 
function($state, $rootScope) {

	var vm = {};

	vm.room = {
		name: "",
		players: [],
		scores: [],
		playersReady: 0		
	}

	vm.createRoom = createRoom;
	vm.joinRoom = joinRoom;
	vm.isReady = isReady;
	vm.leaveRoom = leaveRoom;

	_socket.on("gameEnded", function(scores, playersReady) {
		vm.room.scores = scores;
		vm.room.playersReady = playersReady
		$state.go("waitingRoom");
	});

	return vm;

	function rjoin(name) {

		vm.name = name;

		// when you join a room
		_socket.on("youJoined", function(room, roomData) {
			vm.room.name = room;
			vm.room.players = roomData.players;
		})

		// when somebody else joins a room
		_socket.on("playerJoined", function(room, roomData) {
			vm.room.players = roomData.players;
			$rootScope.$apply()
		});

		_socket.on("roomFailed", function() {
			alert("ERROR not a room idiot")
		});

		// Also watch for other players joining
		_socket.on("playerJoined", function(room, roomData) {
			vm.room.name = room;
			vm.room.players = roomData.players;
		});

		// Also watch for other players leaving
		_socket.on("playerLeft", function(player, id, players) {
			vm.room.players = players;
			$rootScope.$apply()
		});

		_socket.on("playerReady", function(playersReady) {
			vm.room.playersReady = playersReady;
			_socket.on("allReady", function() {
				$state.go("multiplayerGame");
			});
			$rootScope.$apply()
		});


	}

	function createRoom(name) {
		_socket.emit("createRoom", name);
		$state.go("waitingRoom")
		rjoin(name)
	}

	function joinRoom(room, name) {
		_socket.emit("joinRoom", room, name);
		$state.go("waitingRoom")
		rjoin(name);
	}

	function isReady() {
		_socket.emit("isReady");

	}

	function leaveRoom() {
		_socket.emit("leaveRoom");
		$state.go("roomSearch");
	}

});



/////////////
/////////////
/////////////
/////////////
/////////////
// GAMEROOM
/////////////
/////////////
/////////////
/////////////
/////////////

Yahtzee.factory("gameFactory",
function($rootScope, $state, scorecardFactory) {



	var vm = {};

	vm.startGame = startGame;
	vm.tally = tally;
	vm.roll = roll;
	vm.toggleHold = toggleHold;
	vm.submitScore = submitScore;

	// Initial game state
	vm.game = {
		players: [],
		scorecards: [],
		id: 0,
		currentPlayer: 1,
		rolls: 0,
		turn: 0,
		isCurrentPlayer: function() {
			return this.id === this.currentPlayer;
		}
	};

	vm.dice = [
    {val:1, hold:false}, 
    {val:1, hold:false}, 
    {val:1, hold:false}, 
    {val:1, hold:false}, 
    {val:1, hold:false}
  ];

  _socket.on("newTurn", function(id) {
		vm.game.currentPlayer = id;
		resetDie();
	  vm.game.rolls = 0;
	  vm.game.turn++;
		$rootScope.$apply();
	});

	_socket.on("holdToggled", function(i) {
  	vm.dice[i].hold = !vm.dice[i].hold;
  	$rootScope.$apply();
  });

  _socket.on("diceRolled", function(dice) {
  	for (var i=0; i<dice.length; i++) {
  		vm.dice[i].val = dice[i].val;
  		vm.dice[i].hold = dice[i].hold;
  	}
  	vm.game.rolls++;
  	$rootScope.$apply();
  });

  // Triggers when the game has started
  _socket.on("gameStarted", function(game, id) {
  	console.log(game, id);
  	vm.game.scorecards = [];
  	vm.game.rolls = 0;
  	vm.game.turn = 0;
  	vm.game.id = id;
  	vm.game.currentPlayer = 1;
		for (var i=0; i < game.players.length; i++) {
  		vm.game.players = game.players;
			vm.game.scorecards.push(new scorecardFactory.scorecard(game.players[i],i+1));
		}
		$rootScope.$apply();
	});


  return vm;

  function tally(tally, id) {
		if (id != vm.game.currentPlayer) return "x";
		return tally(vm.dice);
	}

	
  function roll() {
  	if (!vm.game.isCurrentPlayer()) return;
  	for (var i=0; i<vm.dice.length; i++) {
  		if (!vm.dice[i].hold) vm.dice[i].val = Math.floor(Math.random() * 6) + 1;
  	}
  	vm.game.rolls++;
  	_socket.emit("rollDice", vm.dice);
  }

 
  function toggleHold(i) {
  	if (!vm.game.isCurrentPlayer()) return;
  	vm.dice[i].hold = !vm.dice[i].hold;
  	_socket.emit("toggleHold", i);
  }


  function startGame(game) {
  	_socket.emit("startGame");
  }

  
  function submitScore(score, id) {
  	if (!vm.game.isCurrentPlayer()) return;
  	if (vm.game.id !== id) return;
  	if (score.isScored) return;
  	score.score = score.tally(vm.dice);
    score.isScored = true;
    vm.game.turn >= (13 * vm.game.players.length)-1 ? endGame() : nextTurn();
  }

  function nextTurn() {
  	_socket.emit("nextTurn", vm.game.currentPlayer);
  	vm.game.currentPlayer = null;
  }

  function resetDie() {
  	for (i=0;i<vm.dice.length;i++) {
  		vm.dice[i].value = 0;
  		vm.dice[i].hold = false;
  	}
  }

  function endGame() {
  	scores = [];
  	for (var i=0; i<vm.game.scorecards.length; i++) {
  		scores[i] = vm.game.scorecards[i].lowerTotal[1].score();
  	}
  	_socket.emit("endGame", scores);
  }

});






// Provides functions for 
Yahtzee.factory("scorecardFactory", function() {

	function scorecard(name, id) {

	  var card = {};

	  card.name = name;
	  card.id = id;

	  // Add points to yahtzee if there is already a scored yahtzee
	  // and another is rolled and used elsewhere
	  card.yahtzeeBonus = function(score) {
	    if (card.lowerScores[5].score > 0 && scoreYahtzee() > 0) {
	      card.lowerScores[5].score += 100;
	    }
	  }


	  // The upper scores
	  card.upperScores = [{
	      name: "Ones",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(1)
	  }, {
	      name: "Twos",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(2)
	  }, {
	      name: "Threes",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(3)
	  }, {
	      name: "Fours",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(4)
	  }, {
	      name: "Fives",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(5)
	  }, {
	      name: "Sixes",
	      score: null,
	      isScored: false,
	      tally: scoreUpper(6)
	  }];

	  function scoreUpperSubtotal() {
	      return arrSum(collectScores(card.upperScores));
	  };

	  function scoreBonus()  {
	      if (scoreUpperSubtotal(card.upperScores) >= 63) {
	          return 30;
	      } else {
	          return 0;
	      }
	  };

	  function scoreUpperTotal() {
	      return scoreUpperSubtotal(card.upperScores) + scoreBonus(card.upperScores)
	  };

	  card.upperTotal = [{
	      name: "Subtotal",
	      score: scoreUpperSubtotal
	  }, {
	      name: "Bonus [63]",
	      score: scoreBonus
	  }, {
	      name: "Upper total",
	      score: scoreUpperTotal
	  }];

	  card.lowerScores = [{
	      name: "Three of a kind",
	      score: null,
	      isScored: false,
	      tally: scoreThreeOAK
	  }, {
	      name: "Four of a kind",
	      score: null,
	      isScored: false,
	      tally: scoreFourOAK
	  }, {
	      name: "Full house",
	      score: null,
	      isScored: false,
	      tally: scoreFullHouse
	  }, {
	      name: "Small straight",
	      score: null,
	      isScored: false,
	      tally: scoreStraight(4)
	  }, {
	      name: "Large straight",
	      score: null,
	      isScored: false,
	      tally: scoreStraight(5)
	  }, {
	      name: "Yahtzee",
	      score: null,
	      isScored: false,
	      tally: scoreYahtzee
	  }, {
	      name: "Chance",
	      score: null,
	      isScored: false,
	      tally: scoreChance
	  }];

	  function scoreLowerTotal() {
	      return arrSum(collectScores(card.lowerScores));
	  };

	  function scoreTotal() {
	      return scoreUpperTotal(card.upperScores) + scoreLowerTotal(card.lowerScores);
	  };

	  card.lowerTotal = [{
	      name: "Lower total",
	      score: scoreLowerTotal
	  }, {
	      name: "Total",
	      score: scoreTotal
	  }];

	  return card;

	  // Returns the sum of an array
	  function arrSum(arr) {
	      var sum = 0;
	      for (var i = 0; i < arr.length; i++) {
	          sum += arr[i];
	      }
	      return sum;
	  };

	  // Returns an array of values of an array of objects
	  function arrVals(arr, property) {
	      var vals = [];
	      for (var i = 0; i < arr.length; i++) {
	          vals.push(arr[i][property]);
	      }
	      return vals;
	  };

	  // Returns an array of scores for a given score sheet
	  function collectScores(scoreSheet) {
	      var arr = [];
	      for (var i = 0; i < scoreSheet.length; i++) {
	          arr.push(scoreSheet[i].score);
	      }
	      return arr;
	  };

	  // How many instances of dice value are there?
	  function getRepeats(arr) {
	      var counts = [];
	      for (var i = 1; i <= 6; i++) {
	          var count = 0;
	          for (var j = 0; j < arr.length; j++) {
	              if (arr[j] == i) {
	                  count++;
	              }
	          }
	          counts.push(count);
	      }
	      return counts;
	  };

	  // Does the array contain a straight of size x?
	  function straightOfSize(arr, cutoff) {
	      var streak = 0;
	      for (var i = 0; i < arr.length; i++) {
	          if (arr[i] > 0) {
	              streak += 1;
	              if (streak >= cutoff) {
	                  return true;
	              }
	          } else {
	              streak = 0;
	          }
	      }
	      return false;
	  };

	  function scoreUpper(val) {
	      return function (dice) {
	          var total = 0;
	          for (var i = 0; i < dice.length; i++) {
	              if (dice[i].val == val) {
	                  total = total + val;
	              }
	          }
	          return total;
	      };
	  };

	  function scoreThreeOAK(dice) {
	      var counts = getRepeats(arrVals(dice, "val"));
	      if (counts.indexOf(3) >= 0 || counts.indexOf(4) >= 0 || counts.indexOf(5) >= 0) {
	          return arrSum(arrVals(dice, "val"));
	      } else {
	          return 0;
	      }
	  };

	  function scoreFourOAK(dice) {
	      var counts = getRepeats(arrVals(dice, "val"));
	      if (counts.indexOf(4) >= 0 || counts.indexOf(5) >= 0) {
	          return arrSum(arrVals(dice, "val"));
	      } else {
	          return 0;
	      }
	  };

	  function scoreFullHouse(dice) {
	      var counts = getRepeats(arrVals(dice, "val"));
	      if (counts.indexOf(3) >= 0 & counts.indexOf(2) >= 0 || counts.indexOf(5) >= 0) {
	          return 25;
	      } else {
	          return 0;
	      }
	  };

	  function scoreStraight(size) {
	      return function (dice) {
	          var counts = getRepeats(arrVals(dice, "val"));
	          var isStraight = straightOfSize(counts, size);
	          var score = size == 4 ? 30 : 40;
	          return isStraight || counts.indexOf(5) >= 0 ? score : 0;
	      };
	  };

	  function scoreYahtzee(dice) {
	      var counts = getRepeats(arrVals(dice, "val"));
	      return counts.indexOf(5) >= 0 ? 50 : 0;
	  };

	  function scoreChance(dice) {
	      return arrSum(arrVals(dice, "val"));
	  };

	}

	return {scorecard: scorecard}


});
