export function appendKey(array,key){
    return [key].concat(array);
}

export function removeKey(array,key){
    var retArr = [];
    for (let i of array){
        if (i != key) retArr.push(i)
    }
    return retArr;
}
