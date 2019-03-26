$(document).ready(function () {

    // Create playable characters
    var char1 = {
        name: "char1",
        hp: 120,
        attack: 6,
        counter: 18,
    }

    var char2 = {
        name: "char2",
        hp: 140,
        attack: 5,
        counter: 15,
    }

    var char3 = {
        name: "char3",
        hp: 160,
        attack: 4,
        counter: 12,
    }

    var char4 = {
        name: "char4",
        hp: 180,
        attack: 3,
        counter: 10,
    }

    // create array to hold characters
    var chars = [char1, char2, char3, char4];

    // create array to hold corresponding images
    var images = ["../images/img1.png", "", "", ""];

    // create hooks for important divs
    var selectChar = $("#select-character");
    var chosenChar = $("#chosen-character");
    var enemiesRem = $("#enemies-remaining");
    var chosenEnemy = $("#chosen-enemy");
    var fightText = $("#fight-text");
    var restart = $("#restart");

    // Create values to be used during the fight sequence
    var curAttack = 0;
    var attackCounter = 1;
    var curHP = 0;
    var counterAttack = 0;
    var counterHP = 0;

    var enemiesDefeated = 0;

    // Create boolean to track if game is over
    var gameOver = false;

    // Create booleans for testing if characters/enemies have been chosen
    var characterChosen = false;
    var enemyChosen = false;

    // Create function to initialize game
    function gameReset() {

        // Reset booleans
        gameOver = false;
        characterChosen = false;
        enemyChosen = false;

        // Empty chosen-character, enemies-remaining, and chosen-defender
        // and recreate them in select-character
        chosenChar.empty();
        enemiesRem.empty();
        chosenEnemy.empty();

        for (var i = 0; i < chars.length; i++) {
            var charDiv = $("<div>");
            charDiv.addClass("character background-white");
            charDiv.attr("id", "char-" + i);
            charDiv.append("<div class='char-detail' id='char-name'>" + chars[i].name + "</div>");
            // charDiv.append("<img src='" + images[i] + "' />");
            charDiv.append("<img src='https://via.placeholder.com/90' />");
            charDiv.append("<div class='char-detail' id='health-points'>" + chars[i].hp + "</div>");

            selectChar.append(charDiv);
        }

        // Remove restart button and clear fight-text
        fightText.empty();
        restart.empty();

        // Reset values to be used during the fight sequence
        curAttack = 0;
        attackCounter = 1;
        curHP = 0;
        counterAttack = 0;
        counterHP = 0;

        enemiesDefeated = 0;

    }

    // immediately initialize game
    gameReset();

    // Create choose character function which will process what happens
    // when a character box gets clicked.
    function chooseCharacter(clickedChar) {

        // if the users character has not been chosen...
        if (!characterChosen) {

            // loop through the characters
            $(".character").each(function (index) {

                // if the current character matches the clicked one,
                // move it to chosenChar and the rest to enemiesRem.
                // also change the other backgrounds to red
                if (clickedChar[0] == this) {
                    chosenChar.append(clickedChar);

                    // update curAttack and curHP
                    curAttack = chars[index].attack;
                    curHP = chars[index].hp;

                } else {

                    enemiesRem.append($(this));
                    $(this).removeClass("background-white");
                    $(this).addClass("background-red");
                }

            });

            // update boolean for future clicks
            characterChosen = true;

        }

        // if character has already been chosen, but an enemy hasn't...
        else if (!enemyChosen && clickedChar.hasClass("background-red")) {

            // loop through the potential enemies
            $(".character").each(function (index) {

                // if we have found the clicked character
                if (clickedChar[0] == this) {

                    // append clickedChar to chosenEnemy
                    // and change background color
                    chosenEnemy.append(clickedChar);
                    clickedChar.removeClass("background-red");
                    clickedChar.addClass("background-gray");

                    // update counterHP and counterAttack
                    counterAttack = chars[index].counter;
                    counterHP = chars[index].hp;

                    // update the boolean value
                    enemyChosen = true;

                }

            });
        }

        else if (clickedChar.hasClass("background-white")) {
            fightText.text("You cannot be your own Enemy!");
        }

        else if (clickedChar.hasClass("background-red")) {
            fightText.text("Enemy already chosen! Continue current fight to move on!");
        }

    }

    // Create click events for each character
    $(".character").click(function() {
        chooseCharacter($(this));
    });
   
    // $("#char-0").click(function () {
    //     chooseCharacter($(this));
    // });

    // $("#char-1").click(function () {
    //     chooseCharacter($(this));
    // });

    // $("#char-2").click(function () {
    //     chooseCharacter($(this));
    // });

    // $("#char-3").click(function () {
    //     chooseCharacter($(this));
    // });

    // Create click event for restart button
    $("#restart").click(function () {
        window.location.reload();
    });

    // Create click event for attack button
    $("#attack-button").click(function () {

        // if the game is over, tell the user to restart
        if (gameOver) {
            fightText.text("Game is over, press restart to play again!");
        }

        // if user character not chosen, tell them to select a character
        else if (!characterChosen) {
            fightText.text("Choose a character to fight with!");
        }

        // if enemy not chosen, tell them to select an enemy
        else if (!enemyChosen) {
            fightText.text("Choose an enemy to fight!");
        }

        // Otherwise.. advance the fight
        else {

            // empty fightText
            fightText.empty();

            // store pointer to your hp, and enemy's name and hp
            var userHP = $(".background-white > #health-points");
            var enemyName = $(".background-gray > #char-name").text();
            var enemyHP = $(".background-gray > #health-points");

            // calculate damage from each side
            var userDamage = curAttack * attackCounter;
            var enemyDamage = counterAttack;

            // increment attackCounter after processing current turn's attack
            attackCounter++;

            // update HPs, starting with enemy's hp (important)
            counterHP = counterHP - userDamage;
            enemyHP.text(counterHP);

            // display damage in fightText
            fightText.append("<div>You attacked and dealt " + userDamage + " damage to " + enemyName + "!</div>");

            // if you reduce their hp to zero, we do not take damage
            if (counterHP <= 0) {

                // remove enemy from defender section
                chosenEnemy.empty();

                // tell user that enemy was defeated
                fightText.append("<div>You defeated " + enemyName + "!</div>");

                // reset enemyChosen boolean
                enemyChosen = false;

                // increment enemies defeated
                enemiesDefeated++;

                // if enemiesDefeated = chars.length-1, game is over
                if (enemiesDefeated == (chars.length - 1)) {

                    gameOver = true;

                    // tell user that they have won
                    fightText.append("<div>All enemies defeated! Press restart to play again!</div>");
                }

                // otherwise tell user to choose another
                else {
                    fightText.append("<div>Select another enemy to fight!</div>");
                }

            }

            // if they are not defeated..
            else {

                // update your current health
                curHP = curHP - enemyDamage;
                userHP.text(curHP);

                // display damage in fightText
                fightText.append("<div>" + enemyName + " attacked and dealt " + enemyDamage + " to you!</div>");

                // if you have your hp reduced to zero..
                if (curHP <= 0) {

                    // tell user that they are defeated
                    fightText.append("<div>You have been defeated! You beat " + enemiesDefeated + " enemies!</div>");

                    // tell user to press restart
                    fightText.append("<div>Press restart to play again!</div>");

                    // set gameOver to true;
                    gameOver = true;

                }

            }

            // if game has ended, add the restart button
            if (gameOver) {
                $("#restart").append("<button>Restart</button>");
            }

        }

    });

});