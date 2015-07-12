/**
 * Created by chrisjefferies on 7/12/15.
 */

$(document).ready(function(){

    //number button action
    $('.btn-nmbr').click(function(){
        console.log(Number($(this).text()));
    });

    //blank button action
    $('.btn-blank').click(function(){
        console.log("Blank pressed");
    });

    //reset button action
    $('.btn-reset').click(function(){
        console.log("reset pressed");
    });

    //solve button action
    $('.btn-solve').click(function(){
        console.log("solve pressed");
    });

});