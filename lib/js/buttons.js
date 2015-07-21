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
        //create an array to hold all the values
        var sudArray = [];
        $(".boardSquare").each(function(){

            var sqNum = Number(this.id.substr(3));
            var sqObject;
            //console.log("called by square", sqNum);
            if (Number($(this).text())) {
                //if the square has a value
                //console.log(sqNum, " has a value");
                var sqVal = Number($(this).text());
                sqObject = new SudSq(sqNum, sqVal);
                //console.log(sqObject.report());
            } else {
                //if the square does not have a value, just set the position
                sqObject = new SudSq(sqNum);
                //console.log(sqNum, " has no value");
            }
            //push to the array
            sudArray.push(sqObject);

        });
        var puzzle = new SudBoard(sudArray);
        console.log(puzzle);
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
    //console.log(this.report());
}


SudSq.prototype.setVal = function(val){
    //var i;
    //remove every possibility except for the one in question
    for(var i=1; i<=9; i++){
        if (i != val) {
            this.removePoss(i);
        }
    }
    //old code where I explicitly set value - may decide this is the way to go later
   // this.possVals = [];
    //this.possVals[0] = val;

};

SudSq.prototype.removePoss = function(poss){
      // var i;
    for( var i=0; i<this.possVals.length; i++){
        if (this.possVals[i] === poss) {
            this.possVals.splice(i,1);
        }
    }

};

SudSq.prototype.isSolved = function(){
    //only one possibility = solved
    return (this.possVals.length === 1);

};

function SudBoard(sqArr){
    this.squares = sqArr;
    this.size = this.squares.length;
    this.columns = gridMaker(this.squares);
    //initial debug line
    //this.solvedQuant = this.solvedCount();
}

SudBoard.prototype.solvedCount = function(){
    var solvedNum = 0;
    //count the total number of solved squares
    for (var i=0; i<this.size; i++){
        //console.log("call ", i);
        if (this.squares[i].isSolved()){
            solvedNum++;
        }

    }
    return solvedNum;
};

function gridMaker(inpArr) {
    //make the columns - NESTED LOOPS
    var outArr = [];
    var sqNum;
    for(var i = 0; i<9; i++){
        var tmpArr = [];
        for(var j = 0; j<9; j++){
            sqNum = (j * 9) + i;
            tmpArr.push(inpArr[sqNum]);
        }
        outArr[i] = tmpArr;
    }
    return outArr;
}