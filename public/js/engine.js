// -----M-O-D-E-L----- //
var players = [
  {
    name: "Tesla",
    image: "img/tesla.png",
  },
  {
    name: "Apple",
    image: "img/apple.png",
  },
  {
    name: "Firefox",
    image: "img/firefox.jpg",
  },
  {
    name: "Instagram",
    image: "img/instagram.jpg",
  },
  {
    name: "Tesla",
    image: "img/tesla.png",
  },
  {
    name: "Messenger",
    image: "img/messengers.png",
  },
  {
    name: "Pinterest",
    image: "img/pinterest.png",
  },
  {
    name: "Telegram",
    image: "img/telegram.jpg",
  },
  {
    name: "Pinterest",
    image: "img/pinterest.png",
  },
  {
    name: "Firefox",
    image: "img/firefox.jpg",
  },
  {
    name: "Snapchat",
    image: "img/snapchat.png",
  },
  {
    name: "Instagram",
    image: "img/instagram.jpg",
  },
  {
    name: "Messengers",
    image: "img/messengers.png",
  },
  {
    name: "Telegram",
    image: "img/telegram.jpg",
  },
  {
    name: "Apple",
    image: "img/apple.png",
  },
  {
    name: "Snapchat",
    image: "img/snapchat.png",
  },
];

/* Global variables */
var count = 0;
var pair = 0;
var moves = 0;
var timeElapsed = 0;
var timer;
var src;
var id;
var hasSrc = [];
var hasId = [];
var score = 0;
let dbUsers;
let users = localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [];

let name = "";

const loadDataFromDB = () => {
  let Data;
  $.get("/allData", (data, textStatus, jqXHR) => {
    Data = data;
  });
  return Data;
};
loadDataFromDB();

// -----V-I-E-W-M-O-D-E-L----- //

// Function to trigger the game to start when clicking on Start Modal
$(function () {
  $("#start").on("click", function () {
    startGame();
    $(this).off();
  });
});

// Function to Start the Game
var startGame = function () {
  //setTimeout function to Show and Hide the Modal

  name = prompt("Enter Your Name : ");
  if (name === "" || name === null) {
    name = "Player";
  }
  // if(name){
  //   $("#total_name").text(name);
  //   }else {
  //     $("#total_name").text("Unknown");
  //   }
  setTimeout(function () {
    $("#startModal").hide();
    $(".fliprow").show();
    $(".foot").show().css("display", "flex");
    runGame();
  }, 100);
};

// Function to Run the Game
var runGame = function () {
  // Function to shuffle the Array of players
  function shuffleArray(players) {
    for (var i = players.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = players[i];
      players[i] = players[j];
      players[j] = temp;
    }
    return players;
  }

  // Function Call
  shuffleArray(players);

  // Function to create the Cards
  function createCards(players) {
    var allCards = " ";
    for (var i = 0; i < players.length; i++) {
      allCards =
        allCards +
        '<div class="flipper animated col-offset-3 col-sm-offset-6 col-md-offset-5 col-lg-offset-4 col-xl-offset-3" id="' +
        i +
        '"><div class="front"><img src="img/cover.jpg" class="img-responsive card"/></div><div class="back"><img src="' +
        players[i].image +
        '" class="img-responsive card"/></div></div>';
    }
    // Appending Cards in fliprow
    $(".fliprow").html(allCards);
  }

  // Function Call
  createCards(players);

  // Function to set rating on game board
  /* function setRating() {
          // Assigning Stars according to number of moves
          if (moves <= 12) {
              var stars = '<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i>';
          } else if (moves <= 14) {
              var stars = '<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star-half-o" aria-hidden="true"></i>';
          } else if (moves <= 16) {
              var stars = '<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i>';
          } else if (moves <= 18) {
              var stars = '<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star-half-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i>';
          } else if (moves <= 20) {
              var stars = '<i class="fa fa-star" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i>';
          } else {
              var stars = '<i class="fa fa-star-half-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i> <i class="fa fa-star-o" aria-hidden="true"></i>';
          }
          // Appending Stars
          $('.starsB').html(stars);
      }*/

  // Function call
  //setRating();

  // Function to flip the Cards by toggling 'active' class
  function flipCard(self) {
    $(self).toggleClass("active");
  }

  // Initializing an interval function to update time at every 1 second.
  let timeout = 25;
  timer = setInterval(() => {
    // timeElapsed += 1;
    // console.log("running");
    if (timeout > 0) {
      timeout -= 1;
      $("#timeB").html(" " + timeout);
    } else {
      endGame();
      callToBackend();
      leadboard();
    }
  }, 1000);

  // function to call backend & send data

  dbUsers = $.get("/allData", function () {
    console.log("get request success");
  }).fail(function () {
    console.log("error");
  });
  console.log({ dbUsers });
  const callToBackend = () => {
    let data = { name: name, moves: moves, match: pair, score: pair * 10 };
    // alert(name)
    users.push(data);
    dbUsers.responseJSON.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    $.ajax({
      type: "POST",
      url: "/",
      data: data,
    });
  };
  console.log({ users });

  //
  // Calling matchCards function on clicking of a flipper
  $(".flipper").on("click", matchCards);

  // Function to Check if Cards are same or not
  function matchCards() {
    // Function Call to flip 'this' particular Card
    flipCard(this);

    // Storing Id and Src of Clicked Cards
    id = $(this).attr("id");
    src = $($($(this).children()[1]).children()[0]).attr("src");

    // Counting Number of Moves
    count += 1;
    if (count % 2 == 0) {
      moves = count / 2;
      $("#moves").html(moves);
      // Function call to set stars as number of moves changes
      //setRating();
    }

    // Pushing values in Array if less than 2 Cards are open
    if (hasSrc.length < 2 && hasId.length < 2) {
      hasSrc.push(src);
      hasId.push(id);

      // Turning off Click on first Card
      if (hasId.length == 1) $(this).off("click");
    }

    // Matching the two opened Cards

    if (hasSrc.length == 2 && hasId.length == 2) {
      if (hasSrc[0] == hasSrc[1] && hasId[0] != hasId[1]) {
        // Counting Pairs
        pair += 1;

        // Turning off Click on matched Cards
        $.each(hasId, function (index) {
          $("#" + hasId[index] + "").off("click");
        });
      } else {
        // Flipping back unmatched Cards with a bit of delay
        $.each(hasId, function (index, open) {
          setTimeout(function () {
            flipCard("#" + open + "");
          }, 600);
        });

        // Turing on Click on first unmatched Card
        $("#" + hasId[0] + "").on("click", matchCards);
      }

      // Emptying the Arrays
      hasSrc = [];
      hasId = [];
    }

    // Checking if all Cards are matched
    if (pair == 8) {
      endGame();
    }
  }
};

// Function to restart the game by resetting the game board
var resetGame = function () {
  // Resetting all the variables
  count = 0;
  pair = 0;
  hasSrc = [];
  hasId = [];
  moves = 0;
  $("#moves").html(moves);
  // Resetting time Elapsed
  clearInterval(timer);
  timeElapsed = 0;
  $("#time").html(" " + timeElapsed);
  // Showing startModal and hiding others
  setTimeout(function () {
    $("#winModal").hide();
    $("#startModal").hide();
    $(".fliprow").show();
    $(".foot").show().css("display", "flex");
  }, 100);
  runGame();
};

// Function to End the Game
var endGame = function () {
  // Calculating Random Score
  //  var score = Math.round(1000 / (timeElapsed + (moves * 10)));

  // Appending the score
  // $('.score').html(score);

  // Assigning Stars according to number of moves
  /*   if (moves <= 12) {
          var stars = '<i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star fa-4x" aria-hidden="true"></i>';
      } else if (moves <= 14) {
          var stars = '<i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star-half-o fa-4x" aria-hidden="true"></i>';
      } else if (moves <= 16) {
          var stars = '<i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i>';
      } else if (moves <= 18) {
          var stars = '<i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star-half-o fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i>';
      } else if (moves <= 20) {
          var stars = '<i class="fa fa-star fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i>';
      } else {
          var stars = '<i class="fa fa-star-half-o fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i> <i class="fa fa-star-o fa-4x" aria-hidden="true"></i>';
      }
      // Appending Stars
      $('.starsW').html(stars);*/

  // Appending Time Taken
  $("#timeW").html(" " + timeElapsed);

  // Stopping Clock
  clearInterval(timer);

  //setTimeout function to Show and Hide the Modal
  setTimeout(function () {
    $(".fliprow").hide();
    $(".foot").hide();
    $("#winModal").show();
  }, 100);
};

function leadboard() {
  //   var lsscorelist = [];
  //   lsscorelist = JSON.parse(localStorage.getItem("id"));
  //   var lsmoveslist = [];
  //   lsmoveslist = JSON.parse(localStorage.getItem("id2"));
  var ns = "";
  var list = " ";
  var ls = " ";
  var ps = "";
  let data = loadDataFromDB();
  console.log(data);
  let local = dbUsers.responseJSON;
  local.sort((a, b) => {
    if (a.score === b.score) {
      // Price is only important when cities are the same
      return a.moves - b.moves;
    }
    return b.score - a.score;
    // return b.score - a.score ;
  });
  let index = local.length < 10 ? local.length : 10;
  console.log("sorted", local);
  for (let i = 0; i < index; i++) {
    list = list + '<div class="" >' + local[i].match + "</div>";
    ls = ls + '<div class="" >' + local[i].moves + "</div>";
    ps = ps + '<div class="" >' + local[i].score + "</div>";
    ns = ns + '<div class="" >' + local[i].name + "</div>";
  }

  $("#total_match").html(list);
  $("#total_moves").html(ls);
  $("#total_score").html(ps);
  $("#total_name").html(ns);

  var nsl = "";
  var listl = " ";
  var lsl = " ";
  var psl = "";
  let i = users.length - 1;

  listl = listl + '<div class="" >' + users[i].match + "</div>";
  lsl = lsl + '<div class="" >' + users[i].moves + "</div>";
  psl = psl + '<div class="" >' + users[i].score + "</div>";
  nsl = nsl + '<div class="" >' + users[i].name + "</div>";

  $("#total_match-local").html(listl);
  $("#total_moves-local").html(lsl);
  $("#total_score-local").html(psl);
  $("#total_name-local").html(nsl);
}
function reset() {
  localStorage.removeItem("users");
  leadboard();
}
