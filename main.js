var slider = document.getElementById('range')
var output = document.getElementById('output')
let block = document.getElementsByClassName('block')
let bubbleButton = document.getElementById('bubble')
var animationOngoing = false
var animationDone = false
var data //global object

//sort coloring
var doneColor = 'white'
var processColor = 'red'
var highlightColor = 'green'
var normalColor = 'blue'
var sortedColor = 'purple'



slider.oninput = function() {
    output.innerHTML = this.value;
    var number = this.value
    data = new SortVisualizer(number)
    data.makeBlock()
}

//html button functions
function randomizeArray(){
    data = new SortVisualizer(slider.value)
    data.makeBlock()
}
function bubbleSort(){
    data.bubbleSort()
}
function selectionSort(){
    data.selectionSort()
}
function mergeSort(){
    data.mergeSort()
}

class SortVisualizer {
    constructor (number) {
        this.number = number * 4
        this.randomData = generateRandomArray(this.number)
        this.sortedData = this.randomData.valueOf()
        animationOngoing = false
        animationDone = false
    }
    makeBlock(){
        var data = document.querySelector('.data')
        data.replaceChildren()
        for (var i = 0; i < this.randomData.length; i++){
            var block = document.createElement('div')
            block.classList.add('block')
            block.setAttribute('id', i)
            block.style.height = this.randomData[i]/2 + 'px';
            block.style.width = 50 + 'px';
            data.append(block)
        }
        //reenable bubble button
        bubbleButton.disabled = false
    };
    async bubbleSort(){
        animationDone = false
        animationOngoing = true
        let length = this.randomData.length
        let speed = declareSpeed(length)
        for(var i = 0; i < length; i++){
            let sorted = true

            for (var j = 0; j < length - i - 1; j++){
                highlightBubbleAnimation(j, j+1, length, speed)
                await sleep(speed)
                if (compare(this.randomData[j], this.randomData[j + 1]) === 1){
                    swap(this.randomData, j, j + 1)
                    bubbleAnimation(j, j+1, this.randomData, speed)
                    await sleep(speed)
                    sorted = false
                    if (animationOngoing == false){
                        return
                    }
                }
            }
            doneBubbleBlock((length - 1) - i, length, speed)
            if(sorted == true){
                break
            }
        }
        animationDone = true
        doneAnimation(length, speed)
    }

    async selectionSort(){
        if (animationOngoing){
            return
        }
        animationDone = false
        while(!animationDone){
            bubbleButton.disabled = true
            animationOngoing = true
            let length = this.randomData.length
            let speed = declareSpeed(length)
            for (var i = 0; i < length - 1; i++){
                let sorted = true
                let minIndex = i
                for(var j = 1 + i; j < length; j++){
                    highlightSelectionAnimation(minIndex, j, length, speed)
                    await sleep(speed)
                    if(this.randomData[j] < this.randomData[minIndex] || (i == 0 && j == 0)){
                        selectionMinIndexAnimation(minIndex, j, this.randomData, speed)
                        await sleep(speed)
                        minIndex = j
                    }
                    sorted = false
                    if (animationOngoing == false){
                        return
                    }
                }
                swap(this.randomData, minIndex, i)
                selectionSortSwapAnimation(minIndex, i, this.randomData, speed)
                await sleep(speed)
                if(sorted == true){
                    break
                }
            }
            block[length - 1].style.backgroundColor = sortedColor
            animationDone = true
            doneAnimation(length,speed)
        }
        bubbleButton.disabled = false
    }
    //https://www.youtube.com/watch?v=pFXYym4Wbkc&t=1818s
    async mergeSort(){
        if(animationOngoing){
            return
        }
        animationDone = false
        animationOngoing = true
            let length = this.randomData.length
            let speed = length / 100000
            let animations = getMergeSortAnimations(this.randomData)
            for (let i = 0; i < animations.length; i++) {
                if (!animationOngoing){
                    return
                }
                const isColorChange = i % 3 !== 2;
                if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                const barOneStyle = block[barOneIdx].style;
                const barTwoStyle = block[barTwoIdx].style;
                const color = i % 3 === 0 ? processColor : normalColor;
                barOneStyle.backgroundColor = color;
                barTwoStyle.backgroundColor = color;
                await sleep(speed)
                } else {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = block[barOneIdx].style;
                    barOneStyle.height = `${newHeight / 2}px`;
                    await sleep(speed)
                }
            }
            animationDone = true
            if(animationDone){
                doneAnimation(length,speed)
                return
            }
    }
}



// BUBBLE SORTING
async function bubbleAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = processColor
    block[b].style.backgroundColor = processColor
    block[a].style.height = arr[a]/2 + 'px';
    block[b].style.height = arr[b]/2 + 'px';
    await sleep(speed)
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = normalColor
    return
}
async function highlightBubbleAnimation(a, b, length, speed){
    if (a == length - 1){
        block[a].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
    }else{
        block[a].style.backgroundColor = highlightColor
        block[b].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
        block[b].style.backgroundColor = normalColor
    }
}
async function doneBubbleBlock(a,length,speed){
    block[a].style.backgroundColor = sortedColor
}



//SELECTION SORTING
async function selectionMinIndexAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = processColor
}
async function selectionSortSwapAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = processColor
    block[b].style.backgroundColor = processColor
    await sleep(speed)
    block[a].style.height = arr[a]/2 + 'px'
    block[b].style.height = arr[b]/2 + 'px'
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = sortedColor
}
async function highlightSelectionAnimation(a, b, length, speed){
    if (a == length - 1){
        block[a].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
    }else{
        block[a].style.backgroundColor = processColor
        block[b].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
        block[b].style.backgroundColor = normalColor
    }
}
//MERGE SORT ALL CREDITS TO https://www.youtube.com/watch?v=pFXYym4Wbkc&t=1818s
function getMergeSortAnimations (arr){
    const animations = [];
    if (arr.length <= 1) return arr;
    const auxArr = arr.slice();
    mergeSortHelper(arr, 0, arr.length - 1, auxArr, animations);
    return animations;
    
}
function mergeSortHelper(arr, leftIndex, rightIndex, auxArr, animations){
    if(leftIndex === rightIndex) return;
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    mergeSortHelper(auxArr, leftIndex, middleIndex, arr, animations);
    mergeSortHelper(auxArr, middleIndex + 1, rightIndex, arr, animations);
    merge(arr, leftIndex, middleIndex, rightIndex, auxArr, animations);
}
function merge(
    mainArray,
    startIdx,
    middleIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([i, j]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([i, j]);
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        // We overwrite the value at index k in the original array with the
        // value at index i in the auxiliary array.
        animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        // We overwrite the value at index k in the original array with the
        // value at index j in the auxiliary array.
        animations.push([k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    while (i <= middleIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([i, i]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([i, i]);
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([j, j]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([j, j]);
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }




//HELPER FUNCTIONS
function sleep(length){
    return new Promise((resolve) => setTimeout(resolve, length))
}
function declareSpeed(length){
    let speed = length
    if (length <= 30){
        speed = length * 80
    }
    else{
        speed = length / 100000
    }
    return speed
}
async function doneAnimation(length, speed){
    for(let i = 0; i < length; i++){
        if(animationDone == true){
            block[i].style.backgroundColor = processColor
            await sleep(speed)
        }
    }
    for(let i = 0; i < length; i++){
        if(animationDone == true){
            block[i].style.backgroundColor = doneColor
            await sleep(speed)
            
        }
    }
}
function generateRandomArray(n){
    var array = []
    for (var i = 0; i < n; i++) {
        array.push(getRandomArbitrary(5,1000))
    }
    return array
}
//https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function swap(arr, a, b){
    let temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
    return
}
function compare(a, b){
    if (a === b){
        return 0;
    }
    else if (a > b){
        return 1;
    }
    else{
        return -1;
    }
    //TIED = 0
    //A GREATER B = 1
    //A LESSER B= -1
}



//displays array when loading the website
data = new SortVisualizer(50)
data.makeBlock()

