export function sum(a,b){
    return a+b;
}

//sprawdza poprawność emaila - zgodny z specyfikacją RFC 5322
export function isEmail(text){
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test
}


function hasNLetters(text, n){
    return (text.Length()===n);
}

//prawda jeśli znajdzie tylko spacje
function hasWhiteSpace(text) {
    return /\s/.test(text);
}

//prawda jeśli znajdzie małą literę
function hasLowerCaseText(text) {
    return /[a-z]/.test(text);
}

//prawda jeśli nie znajdzie niczego prócz małych liter
function hasOnlyLowerCaseText(text) {
    return !/[^a-z]/.test(text);
}

//prawda jeśli znajdzie dużą literę
function hasOnlyCaseText(text){
    return /[A-Z]/.test(text);
}

//prawda jeśli nie znajdzie niczego prócz dużych liter
function hasOnlyUpperCaseText(text){
    return !/[^A-Z]/.test(text);
}

//prawda jeśli znajdzie numer
function hasNumers(text){
    return /\d/.test(text);
}

function hasOnlyNumbers(text){
    return !/\D/.test(text);
}



