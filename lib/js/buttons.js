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
        $(".boardSquare").each(function(){
            //only log to console if square has a value
            if (Number($(this).text())) {
                sqNum = Number(this.id.substr(3));
                sqVal = Number($(this).text());
                sqObject = new SudSq(sqNum, sqVal);
                //console.log(sqObject.report());
            }
        });
    });

    //square classes
    $(".boardSquare").click(function(){
        $(".boardSquare").removeClass("boardSqSelect");
        $(this).toggleClass("boardSqSelect");
    });


});


function SudSq(pos, val){
    //every square knows its position
    this.position = pos;

    //a square starts with all possibilities
    this.possVals = [1,2,3,4,5,6,7,8,9];

    //unless it has its value set
    if (val) {
        this.setVal(val);
    }

    //is everything working?
    console.log(this.report());
}

SudSq.prototype.report = function(){
    return "position: " + this.position + " possible values: " + this.possVals;
};

SudSq.prototype.setVal = function(val){
    //var i;
    //remove every possibility except for the one in question
    for(i=1; i<=9; i++){
        if (i != val) {
            this.removePoss(i);
        }
    }
    //old code where I explicitly set value - may decide this is the way to go later
   // this.possVals = [];
    //this.possVals[0] = val;

};

SudSq.prototype.removePoss= function(poss){
       // var i;
    for(i=0; i<this.possVals.length; i++){
        if (this.possVals[i] === poss) {
            this.possVals.splice(i,1);
        }
    }

};