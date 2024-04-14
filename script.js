const { useEffect, useState } = React

function CreateButton({ number, onClick }) {
    return (
        <button onClick={() => onClick(number)}
            className='btn'
            disabled={number === 0}
            id={number === 0 ? "empty" : ''}
            value={number}>
            {!!number && number}
        </button>
    )
}

function Row({ id, numbers, func }) {
    return (
        <div id={id} >
            {numbers.map(num => <CreateButton key={num} number={num} onClick={func} />)}
        </div>
    )
}

function MixButton({ onClick }) {
    function handleClick(event) {
        onClick(event.target.value)
    }
    return (
        <div>
            <button key='mixbtn' id='mixbtn' onClick={handleClick} >
                перемешать
            </button>
        </div>
    )
}

function GameBoard({ numbers, func }) {
    return (
        <div className='board'>
            {numbers.map((row, index) => <Row id={'row' + index} key={index} numbers={row} func={func} />)}
        </div>
    )
}

function mixGameBoard() {
    let numbers = [];
    let x = 0;
    let z = 0;
    let counter = 0;
    while (numbers.length != 8) {
        x = Math.floor(Math.random() * 8) + 1;
        if (!numbers.includes(x)) {
            numbers.push(x);
        }
    }

    for (let i = 0; i <= 6; i++) {
        for (let a = i; a <= 7; a++) {
            if (numbers[i] > numbers[a]) {
                counter += 1;
            }
        }
    }

    z = Math.floor(Math.random() * 8);
    numbers.splice(z, 0, 0);

    if (counter % 2 == 0) {
        let result = []
        let row = []
        for (let element in numbers) {
            if (row.length === 3) {
                result.push(row);
                row = [];
                row.push(numbers[element]);
            }
            else {
                row.push(numbers[element]);
            }
        }
        result.push(row);
        return (result);
    }
}

function whereIsNull(value) {
    for (let elements in value) {
        for (let element in value[elements]) {
            if (value[elements][element] == 0) {
                return [Number(elements), Number(element)];
            }
        }
    }
}

function getCoordinates(nullCoord, event, value) {
    let moving = false;
    for (let row in value) {
        for (let element in value[row]) {
            if (event == value[row][element]) {
                if (nullCoord[0] == row && nullCoord[1] - 1 == element) {
                    moving = true;
                }
                else if (nullCoord[0] == row && nullCoord[1] + 1 == element) {
                    moving = true;
                }
                else if (nullCoord[1] == element && nullCoord[0] + 1 == row) {
                    moving = true;
                }
                else if (nullCoord[1] == element && nullCoord[0] - 1 == row) {
                    moving = true;
                }
                return [moving, Number(row), Number(element)];
            }
        }
    }
}

function areYouWin(result) {
    const rightNum = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
    let count = 0;
    for (let row in rightNum) {
        for (let num in rightNum) {
            if (rightNum[row][num] == result[row][num]) {
                count += 1;
            }
        }
    }
    if (count == 9) {
        alert('Ты справился! Молодец!!!');
    }
}
function Page() {
    const [value, setValue] = useState([[1, 2, 3], [4, 5, 6], [7, 8, 0]])
    let number = undefined;
    let result = value;
    function handleClick() {
        while (number === undefined) {
            number = mixGameBoard();
        }
        setValue(number);
        number = undefined;
    }

    function handleMove(event) {
        let nullCoord = whereIsNull(value);
        let canWeMove = getCoordinates(nullCoord, event, value);
        let place = '';
        if (canWeMove[0]) {
            place = result[canWeMove[1]][canWeMove[2]];
            result[canWeMove[1]][canWeMove[2]] = result[nullCoord[0]][nullCoord[1]];
            result[nullCoord[0]][nullCoord[1]] = place;
        }
        setValue([result[0], result[1], result[2]]);
        areYouWin(result);
    }

    return (
        <div className='wrapper'>
            <div className='main'>
                <div className='page-title'>
                    ПЯТНАШКИ
                </div>
                <GameBoard numbers={value} func={handleMove} />
                <MixButton onClick={handleClick} />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Page />);