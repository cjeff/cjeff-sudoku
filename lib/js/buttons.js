/**
 * Created by chrisjefferies on 7/12/15.
 */

$(document).ready(function(){

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