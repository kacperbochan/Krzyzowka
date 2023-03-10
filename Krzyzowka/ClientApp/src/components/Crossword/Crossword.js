import React, { Component } from 'react';
import { useSearchParams } from "react-router-dom";
import Grid from "./Grid";
import authService from '../api-authorization/AuthorizeService';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export class Crossword extends Component {
    constructor(props) {
        super(props);
        // definicja krzyżówki
        this.state = {
            data: {
                height: 0,
                width: 0,
                name: "",
                wordList: [],
                questions: []
            },
            metaData: {
                numberOfWords: 0,
                firstLetters: [],
            },
            positioning: {
                refs: [],
                currentFocus: 0,
                currentWord: null,
            },
            user_answers: [],
            answers: [],
        
            reset: false,
            loading: true,
        };

        
    }

    componentDidMount() {
        this.populateCrosswordData();
        this.setState({ loading: false });

    }

    //dodawanie słowa do krzyżówki
    addSolvedWord = (tuple) => {
        let { user_answers } = this.state;
        let answeredIndices = [];
        tuple.word = tuple.word.toLowerCase();

        for (let i = 0; i < user_answers.length; i++) {
            answeredIndices.push(user_answers[i].number);
        }

        if ( user_answers.length !== 0) {
            if (answeredIndices.includes(tuple.number)) {
                user_answers[answeredIndices.indexOf(tuple.number)].word = tuple.word;

                this.setState(
                    () => ({
                        user_answers: user_answers
                        
                    }),
                    console.log("Edytowano slowo ", tuple)
                );
            } else {
                //add an attempt
                user_answers[tuple.number] = tuple.word;
                this.setState(
                    () => ({
                         user_answers: user_answers
                    }),
                    console.log("Dodano slowo ", tuple)
                );
            }
        } else {
            //add an attempt
            user_answers[tuple.number] = tuple.word;
            this.setState(
                () => ({
                    user_answers: [user_answers]
                }),
                console.log("Dodano slowo ", tuple)
            );
        }
    };


    checkAnswers = () => {
        //pobieramy odpowiedzi użytkownika i te prawdziwe

        this.populateAnswers();

    };


    //przechodzimy do słowa o indeksie podanym w inpucie
    handleClueClick = (e, index) => {
        //określamy indeks pierwszego znaku słowa
        //jeśli mówimy o 1 słowie, jest to już jego indeks
        let startingCell = 0;

        //sumujemy liczby znaków w poprzednich słowach
        for (let i = 0; i < index; i++) {
            startingCell += this.state.data.wordList[i].length;
        }

        //ustawiamy inteks słowa i jego początkowego znaku,
        //po czym przenosimy na jego komurkę uwagę
        this.setState(
            () => ({
                positioning: {
                    ...this.state.positioning,
                    currentFocus: startingCell,
                    currentWord: index
                }
            }),
            this.state.positioning.refs[startingCell].current.focus()
            );
    };


    handleNewCurrentWord = (neWord) => {
        this.setState(
            () => ({
                positioning: {
                    ...this.state.positioning,
                    currentWord: neWord
                }
            }),
            console.log("CWhandleNewCurrentWord", neWord)
        );
    };


    moveToNextCell = (backwards) => {
        //all the cell change logic is in changeActiveCell
        //here we will just call changeActiveCell with parameters in a
        //loop

        const { currentFocus, refs } = this.state.positioning;
        let nextCell = 0;

        if (backwards) {
            nextCell = currentFocus === 0 ? (refs.length - 1) : (currentFocus - 1);
        } else {
            nextCell = (currentFocus < refs.length - 1) ? currentFocus + 1 : 0;
        }

        //liczymy następny wyraz
        let newWord = 0;

        for (let i = 1; this.state.metaData.firstLetters[i] <= nextCell; i++) {
            newWord = i;
        }

        this.setState(
            {
                positioning: {
                    ...this.state.positioning,
                    currentFocus: nextCell,
                    currentWord: newWord
                }
            }
        );   

        this.state.positioning.refs[nextCell].current.focus();
        
    };

    
    //funkcja która przenosi nas do następnego/poprzedniego słowa
    moveToNextWord = (backwards) => {

        //pobieramy zmienne ze stanu
        const { numberOfWords } = this.state.metaData;
        const { currentWord } = this.state.positioning;

        //określamy zmienne na index następnego słowa i jego komurki początkowej
        let nextWord = 0;

        //jeśli przekazaliśmy true to cofamy się
        if (backwards) {
            //liczymy indeks poprzedniego słowa, pamiętając o tym, że jeśli obecne to 0, to musimy przejść na koniec
            nextWord = currentWord === 0 ? (numberOfWords - 1) : (currentWord - 1);
        } else {
            //liczymy indeks następnego słowa tym razem możemy użyć modulo
            nextWord = (currentWord + 1) % numberOfWords;
        }

        //liczymy indeks pierwszego znaku w następnym słowie
        //aby to zrobić przejdziemy po każdym poprzednim 
        //i dodamy do siebie ilości ich znaków
        //jeśli mowa o 1 słowie, to jego indeks już mamy
        

        //ustawiamy inteks słowa i jego początkowego znaku,
        //po czym przenosimy na jego komurkę uwagę
        this.setState(
            () => ({
                positioning: {
                    ...this.state.positioning,
                    currentFocus: this.state.metaData.firstLetters[nextWord], 
                    currentWord: nextWord
                },
            }),
            this.state.positioning.refs[this.state.metaData.firstLetters[nextWord]].current.focus()
        );
        
    };


    //przez wyłącza focus na słowie
    handleInputBlur = () => {
        this.setState(
            () => ({
                positioning: {
                    ...this.state.positioning,
                    currentWord: null
                }
            }));
    }

    changeActiveCell = (activeCell) => {
        let newActiveCell = 0,
            allPrevWords = 0,
            allCurWordChars = activeCell.index;

        for (let i = 0; i < activeCell.wordNum; i++) {
            allPrevWords += this.state.data.wordList[i].length;
        }

        newActiveCell = allPrevWords + allCurWordChars;

        this.setState((prevState) => ({
            positioning: {
                ...this.state.positioning,
                currentFocus: newActiveCell,
                currentWord: activeCell.wordNum
            }
        }));
    };



    //przekazanie do Grid w render()
    addToRefs = (ref) => {
        const { positioning } = this.state;
        this.setState((prevState) => ({
            positioning: {
                ...positioning,
                refs: prevState.positioning.refs.concat(ref)
            }
        }));
    };



    render() {
        //return (
        //    <div>
        //        <p>{this.state.data.wordList.length}</p>
        //        <Grid data={this.state.data}></Grid>
        //    </div>
        //);
        
        if (this.state.loading) {
            return (
                <div>
                    <h1 id="tabelLabel" >Strona Krzyżówki</h1>
                    <p>Pobieranie pytań</p>
                    <p><em>Loading...</em></p>
                </div>
            );
        }
        else if (this.state.answers.length == 0) {
            if (this.state.metaData.numberOfWords > 0) {
                return (
                    <div className="CW-container">
                        <div className="title"><h1>{this.state.data.name}</h1></div>
                        <Grid
                            data={this.state.data}
                            metaData={this.state.metaData}
                            positioning={this.state.positioning}
                            addSolvedWord={this.addSolvedWord}
                            addToRefs={this.addToRefs}
                            moveToNextCell={this.moveToNextCell}
                            moveToNextWord={this.moveToNextWord}
                            changeActiveCell={this.changeActiveCell}
                            currentWord={this.state.positioning.currentWord}
                            handleNewCurrentWord={this.handleNewCurrentWord}
                            handleInputBlur={this.handleInputBlur}
                        ></Grid>
                        <div className='questions'>
                            {this.state.data.questions.map((question, index) => {
                                return (

                                    <div className={this.state.data.currentWord === index ? "question editing" : "question "} key={question}>
                                        <li onClick={(e) => this.handleClueClick(e, index)} >
                                            {index + 1}.  {question}&nbsp;({this.state.data.wordList[index].length})
                                        </li>
                                    </div>

                                );
                            })}
                        </div>
                        <div className="buttons">
                            <button className="button" onClick={this.checkAnswers}>Sprawdź</button>
                            <CrosswordButton></CrosswordButton>
                        </div>
                    </div>
                );
            } else {
                return <p>Loading...</p>;
            }
        }
        else {
            return (
                <div className="CW-container">
                    <div className="title"><h1>{this.state.data.name}</h1></div>
                    
                    <table className='table table-striped' aria-labelledby="tabelLabel">
                        <thead>
                            <tr className="trHeader">
                                <th>id</th>
                                <th>pytanie</th>
                                <th>podana odpowiedź</th>
                                <th>poprawna odpowiedź</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.questions.map((question, index) => {
                                return (
                                    <tr className={this.state.answers[index] === this.state.user_answers[index] ? "correctAnswer" : "wrongAnswer"} key={question}>
                                        <td>
                                            {index + 1}.
                                        </td>
                                        <td>
                                            {question}
                                        </td>
                                        <td>
                                            {this.state.user_answers[index]}
                                        </td>
                                        <td>
                                            {this.state.answers[index]}
                                        </td>
                                    </tr>

                                );
                            })}
                        </tbody>
                    </table>
                    <div className="buttons">
                        <CrosswordButton></CrosswordButton>
                    </div>
                </div>
            );
        }
        
    }

    async populateCrosswordData() {
        
        const params = new URLSearchParams(location.search);
        let id = params.get("id");
        const token = await authService.getAccessToken();
        const response = await fetch('epcrossword/data/'+id, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }

        });
        const responseData = await response.json();
        this.setState({
            data: responseData,
        }, () => {

            //ustawiamy długość tablicy z indeksami pierwszych znaków 
            let firsts = new Array(this.state.data.wordList.length).fill(0);
            let userAnswers = new Array(this.state.data.wordList.length).fill(" ");

            //wypełniamy tablicę licząc indeksy pirewszych znaków
            this.state.data.wordList.forEach((word, index) => {
                if (index < this.state.data.wordList.length - 1) {
                    firsts[index + 1] = firsts[index] + word.length;
                }
            });
            //zapisujemy stan ilości liter i indeksów początkowych
            this.setState({
                metaData: {
                    numberOfWords: this.state.data.wordList.length,
                    firstLetters: firsts
                }
            });

            this.setState({
                user_answers: userAnswers
            });
        }
        );        
    }

    async populateAnswers() {
        const params = new URLSearchParams(location.search);
        let id = params.get("id");

        const response = await fetch('epcrossword/answers/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const answers = await response.json();
        this.setState({
            answers: answers
        });
    }

}




function CrosswordButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/crosswordList");
  }

  return (
    <button className="button" type="button" onClick={handleClick}>
      Powrót
    </button>
  );
}

// chyba brak tutaj
// import PropTypes, { number, string } from 'prop-types';
// Crossword.propTypes = {
// 	currentWord: PropTypes.number,
//     data: PropTypes.shape({
//         height: PropTypes.number,
//         width: PropTypes.number,
//         wordList: PropTypes.shape({
//             word: PropTypes.string,
//             orientation: PropTypes.string,
//             x: PropTypes.number,
//             y: PropTypes.number,
//             length: PropTypes.number  
//         }),
//         questions: arrayOf(PropTypes.string),
//       }),

// };