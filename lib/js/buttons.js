/**
 * Created by chrisjefferies on 7/12/15.
 */

$(document).ready(function () {
    //we start in entry mode
    var dispPoss = false;
    var puzzle;
    //build in the squares
    var size = 81;
    var elemsToAppend = $();
    for (i = 0; i < size; i++) {

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
    $('.btn-nmbr').click(function () {
        $(".boardSqSelect").text(Number($(this).text()));
    });

    //blank button action
    $('.btn-blank').click(function () {
        $(".boardSqSelect").text("");
    });

    //reset button action
    $('.btn-reset').click(function () {
        dispPoss = false;
        $(".boardSquare").text("");
        $(".boardSquare").removeClass("boardSqSolved");
    });

    //solve button action
    $('.btn-solve').click(function () {
        dispPoss = true;
        $(".boardSquare").removeClass("boardSqSelect");
        //create an array to hold all the values
        var sudArray = [];
        $(".boardSquare").each(function () {

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
        puzzle = new SudBoard(sudArray);
        console.log(puzzle);
    });

    //square classes
    $(".boardSquare").click(function () {
        if (dispPoss) {
            var sqNum = Number(this.id.substr(3));
            $(".possDisp").text(puzzle.gridBoard.squares[sqNum].possVals);
        } else {
            $(".boardSquare").removeClass("boardSqSelect");
            $(this).toggleClass("boardSqSelect");
        }

    });


});


function SudSq(pos, val) {
    //every square knows its position
    this.position = pos;

    //a square starts with all possibilities
    this.possVals = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    //unless it has its value set
    if (val) {
        this.setVal(val);
    }


    //is everything working?
    //console.log(this.report());
}


SudSq.prototype.setVal = function (val) {
    //var i;
    //remove every possibility except for the one in question
    for (var i = 1; i <= 9; i++) {
        if (i != val) {
            this.removePoss(i);
        }
    }
    //old code where I explicitly set value - may decide this is the way to go later
    // this.possVals = [];
    //this.possVals[0] = val;

};

SudSq.prototype.removePoss = function (poss) {


    for (var i = 0; i < this.possVals.length; i++) {
        if (this.possVals[i] === poss) {
            this.possVals.splice(i, 1);
            if (this.possVals.length === 1) {
                //put value on board if it is the only remaining value
                this.displayVal();
            }

        }
    }

};

SudSq.prototype.displayVal = function () {
    var selecto = "#sqa" + this.position;
    //update if does not already have value
    if ($(selecto).text().length === 0) {
        $(selecto).text(this.possVals[0]);
        $(selecto).addClass("boardSqSolved");
    }

};


SudSq.prototype.isSolved = function () {
    //only one possibility = solved
    return (this.possVals.length === 1);

};

function SudBoard(sqArr) {
    this.squares = sqArr;
    this.size = this.squares.length;
    this.gridBoard = new GridBoard(this.squares);
    //initial debug line
    //this.solvedQuant = this.solvedCount();
}

SudBoard.prototype.solvedCount = function () {
    var solvedNum = 0;
    //count the total number of solved squares
    for (var i = 0; i < this.size; i++) {
        //console.log("call ", i);
        if (this.squares[i].isSolved()) {
            solvedNum++;
        }

    }
    return solvedNum;
};

function GridBoard(inpSquares) {

    this.squares = inpSquares;
    //make the columns - NESTED LOOPS
    var outArr = [];
    var sqNum;
    for (var i = 0; i < 9; i++) {
        var tmpArr = [];
        for (var j = 0; j < 9; j++) {
            sqNum = (j * 9) + i;
            tmpArr.push(sqNum);
        }
        outArr[i] = new Grid(tmpArr, this);
    }

    //make the rows - NESTED LOOPS
    for (var i = 0; i < 9; i++) {
        var tmpArr = [];
        for (var j = 0; j < 9; j++) {
            sqNum = (i * 9) + j;
            tmpArr.push(sqNum);
        }
        outArr.push(new Grid(tmpArr, this));
    }

    //make the 3x3 grids - more nested loops
    //find origin square of row of grids
    for (var i = 0; i < 81; i += 27) {


        //for each grid
        for (var j = 0; j < 3; j++) {
            var tmpArr = [];
            // for each row of the grid
            for (var k = 0; k < 3; k++) {
                //proceed through each column square of the row
                for (var l = 0; l < 3; l++) {
                    //now you can get the square number
                    sqNum = i + (j * 3) + (k * 9) + l;
                    tmpArr.push(sqNum)
                }

            }
            outArr.push(new Grid(tmpArr, this, "square"));
        }

    }
    this.grids = outArr;
    //this.possCount = 729;

    //do initial reconciliation
    while (this.needsReconcile()) {
        //console.log("reconcile loop");
        for (var i = 0; i < 27; i++) {

            this.grids[i].reconcile();
        }
    }


}

//reconciled when grids lastPoss and squares present poss match
GridBoard.prototype.needsReconcile = function () {
    //console.log("needsrec called");
    for (var i = 0; i < 27; i++) {

        if (this.grids[i].lastPoss > this.grids[i].getPossCount()) {
            return true
        }

    }

    return false;
};


function Grid(theArr, inpBoard, type) {
    this.type = type || "line";
    this.gridSquares = theArr;

    this.board = inpBoard.squares;
    this.puzzle = inpBoard;
    this.lastPoss = 81;

    this.possMatrix = new PossMatrix(this);
    this.locMatrix = new LocMatrix(this);

    // debug value setting
    //this.lastSolved = this.getSolvedCount();
    //this.lastPoss = this.getPossCount();
    //this.reconcile();
}

Grid.prototype.getSolvedCount = function () {
    var solvedtmp = 0;
    for (var i = 0; i < 9; i++) {
        var theSq = this.gridSquares[i];
        if (this.board[theSq].isSolved()) {
            solvedtmp++;
        }
    }
    return solvedtmp;
};

Grid.prototype.getPossCount = function () {
    var posstmp = 0;
    for (var i = 0; i < 9; i++) {
        var theSq = this.gridSquares[i];
        posstmp += this.board[theSq].possVals.length;
    }
    return posstmp;
};

Grid.prototype.reconcile = function () {

    //reconcile locations
    this.locMatrix.reconcile();

    //reconcile possibilities
    this.possMatrix.reconcile();
    //console.log("possCount: ", this.getPossCount());
    this.lastPoss = this.getPossCount();

};


Grid.prototype.reconcileOld = function () {
    for (var i = 0; i < 9; i++) {
        //get the referred square
        var theSq = this.gridSquares[i];
        //is that square solved?
        if (this.board[theSq].isSolved()) {
            //get the solved value
            var theSol = this.board[theSq].possVals[0];
            //remove that value as a possibility from all other squares
            for (var j = 0; j < 9; j++) {
                if (j != i) {
                    //get the square to remove possibilities from
                    var tgtSq = this.gridSquares[j];
                    //remove that possibility
                    this.board[tgtSq].removePoss(theSol);
                }

            }
        }
    }
    this.possMatrix.reconcile();

    if (this.getPossCount() != this.lastPoss) {
        this.lastPoss = this.getPossCount();
        this.reconcile();

    }

};

function LocMatrix(gridInp) {

    //the remaining possibilities for each location
    this.members = gridInp.gridSquares;
    this.board = gridInp.board;
    this.matrix = [];
    this.update();
    //console.log("locMatrix complete");
}

LocMatrix.prototype.update = function () {
    //gets the current possibilities for the grid

    //clear the matrix
    this.matrix = [];

    //rebuild the second dimension of the matrix
    for (var i = 0; i < 9; i++) {

        //build the inner array
        this.matrix[i] = [];
    }

    //for each square in the grid
    for (var i = 0; i < this.members.length; i++) {

        //get the number for the square
        //console.log("the square is ", this.members[i]);
        var tmpNum = this.members[i];
        //console.log("the board is ", this.board);
        //get the real square in the board
        var tmpSq = this.board[tmpNum];

        //for each possibility in the square
        for (var j = 0; j < tmpSq.possVals.length; j++) {
            //get the possibility
            var tmpPoss = tmpSq.possVals[j];

            //put that possibility into the matrix
            this.matrix[i].push(tmpPoss);
        }
    }
    //console.log("update complete");
};

LocMatrix.prototype.reconcile = function () {
    //you do not need to recurse until you change the matrix
    //var changed = false;
    //get the new values
    this.update();
    var oldSize = sizeMatrix(this.matrix);
    //reconcile the matrix
    var newMatrix = recMatrix(this.matrix);
    var newSize = sizeMatrix(newMatrix);

    //did the matrix change?
    if (newSize !== oldSize) {
        //console.log("changed triggered in locMatrix");
        changed = true;
        this.matrix = newMatrix;
    }
    //push the updated possibilities to the squares
    this.pushVals();

    //if nothing changed, we do not need to recurse

};

LocMatrix.prototype.pushVals = function () {
    //for every row in the matrix
    for (var i = 0; i < this.matrix.length; i++) {
        //set the position value

        var tmpPos = this.members[i];
        //console.log("the square is ", tmpPos);
        //for every possibility
        for (var j = 0; j < this.matrix.length; j++) {
            //bump up the poss by one (zero based array)

            var realPoss = j + 1;
            //if that possibility is not in this row of the matrix
            if (this.matrix[i].indexOf(realPoss) < 0) {
                //remove that possibility from the square
                //console.log("remove ", realPoss, " from ", tmpPos);
                this.board[tmpPos].removePoss(realPoss);
            }
        }
    }
};

function PossMatrix(gridInp) {
    // the remaining locations in the grid for all possibilities
    this.members = gridInp.gridSquares;
    this.board = gridInp.board;
    this.matrix = [];
    this.update();
}

PossMatrix.prototype.update = function () {
    //gets the current possibilties for the grid

    //clear the matrix
    this.matrix = [];

    //rebuild the 2nd dimension of the matrix
    for (var i = 0; i < 9; i++) {
        //build the inner array
        this.matrix[i] = [];
    }

    //for each square in the grid
    for (var i = 0; i < this.members.length; i++) {

        //get the number for the square
        var tmpNum = this.members[i];
        //get the real square in the board
        var tmpSq = this.board[tmpNum];

        //for each possibility in the square
        for (var j = 0; j < tmpSq.possVals.length; j++) {
            //get the possibility
            var tmpPoss = tmpSq.possVals[j];

            //put the Square number in the matrix for that possibility
            this.matrix[tmpPoss - 1].push(tmpNum);


        }

    }
};

PossMatrix.prototype.reconcile = function () {
    //you do not need to recurse until you change the matrix
    var changed = false;
    //get the new values
    this.update();
    var oldSize = sizeMatrix(this.matrix);
    //reconcile the matrix
    var newMatrix = recMatrix(this.matrix);
    var newSize = sizeMatrix(newMatrix);

    //did the matrix change?
    if (newSize !== oldSize) {
        //console.log("changed triggered in possmatrix");
        changed = true;
        this.matrix = newMatrix;
    }
    //push the updated possibilities to the squares
    this.pushVals();

    //if nothing changed, we do not need to recurse

};

PossMatrix.prototype.pushVals = function () {
    //for every row in the matrix
    for (var i = 0; i < this.matrix.length; i++) {
        //set the real possibility value to make life easier
        var realPoss = i + 1;
        //for every square in the grid
        for (var j = 0; j < this.members.length; j++) {
            //get the position value
            var tmpPos = this.members[j];
            //if you are not in this row of the matrix
            if (this.matrix[i].indexOf(tmpPos) < 0) {
                //remove the possibility from the square
                this.board[tmpPos].removePoss(realPoss);
            }
        }
    }
};


function sameArray(arr1, arr2) {
    //different lengths = not the same
    if (arr1.length !== arr2.length) {
        return false
    }

    //different items = not the same
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    //you win!
    if (arr1.length > 1) {
        //console.log("match found: ", arr1, arr2);
    }

    return true
}


recMatrix = function (inpArr) {
    var inp = inpArr;
    for (var i = 0; i < inp.length; i++) {
        // don't need to reconcile until we do
        var needsRec = false;

        //set up to match duplicates
        var dupCount = 0;
        var matchArr = inp[i];

        //loop through to match duplicates
        for (var x = 0; x < inp.length; x++) {
            if (sameArray(inp[x], matchArr)) {
                dupCount++
            }
        }

        if (dupCount == matchArr.length) {
            if (matchArr.length > 1) {
                // console.log("match found,", matchArr);
            }

            needsRec = true;
        }

        // if it can be reconciled
        if (needsRec) {

            //for each cell in the outer matrix
            for (var j = 0; j < inp.length; j++) {

                //if it doesn't match the inner matrix to reconcile
                if (!sameArray(inp[j], matchArr)) {

                    //for every item in that inner matrix to reconcile
                    for (var k = 0; k < matchArr.length; k++) {

                        //if that item exists in the outer matrix cell
                        var removeMe = inp[j].indexOf(matchArr[k]);

                        if (removeMe > -1) {
                            //console.log("removed one");
                            //remove that item from outer matrix
                            inp[j].splice(removeMe, 1);
                        }
                    }

                }

            }

        }

    }
    return inp;
};


sizeMatrix = function (inpMatrix) {
    var count = 0;
    //for each cell in outer array
    for (var i = 0; i < inpMatrix.length; i++) {
        count += inpMatrix[i].length;
    }
    return count;
};

