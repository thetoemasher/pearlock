import {useRef} from 'react';

export const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

export const shuffle = (arr) => {
    let newArr = arr.map(obj => {
        return {...obj}
    })
    for(let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
    }
    return newArr
}