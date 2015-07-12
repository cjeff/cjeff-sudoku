/**
 * Created by chrisjefferies on 7/12/15.
 */

$(document).ready(function(){

    //build in the squares
    var size = 81;
    var elemsToAppend=$();
    for(i=0; i < size; i++){

        //TODO make thicker gridlines where needed to mark the 3x3 grids

        //create elements & add to list
            elemsToAppend = elemsToAppend.add(
                $('<div>', {
                    'class': 'boardSquare',
                    'id': ("sqa" + i)
                })
            );

    }
    //add to page
    $(".sudokuBoard").append(elemsToAppend);



    //number button action
    $('.btn-nmbr').click(function(){
        $(".boardSqSelect").text(Number($(this).text()));
    });

    //blank button action
    $('.btn-blank').click(function(){
        $(".boardSqSelect").text("");
    });

    //reset button action
    $('.btn-reset').click(function(){
        $(".boardSquare").text("");
    });

    //solve button action
    $('.btn-solve').click(function(){
        console.log("solve pressed");
    });

    //square classes
    $(".boardSquare").click(function(){
        $(".boardSquare").removeClass("boardSqSelect");
        $(this).toggleClass("boardSqSelect");
    });


});