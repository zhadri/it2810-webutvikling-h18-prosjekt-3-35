import React, 
    { Component
} from 'react';
import {
    ScrollView,
    Image,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';
import { PedometerProgressGraph } from '../components/PedometerGraph';
import { ExerciseCard } from '../components/ExerciseCard';
import { PedometerSensor } from '../components/PedometerSensor';

const logoSource = '../assets/images/pmm.png';
const addExerciseButton = '../assets/images/plus.png';
const dailyGoalLocation = 'dailyGoal';
const exerciseListsLocation = 'exerciseCards';

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepsWalked: 1000,
            stepGoal: 10000,
            exercises: [],
            exerciseNames: []
        }
    }
    static navigationOptions = {
        header: null,
    };

    // The mount function launches retrieval for the daily goal as well as the exercises created.
    componentDidMount = () => this.retrieveData();

    componentDidUpdate = () => {

    }

    //ExerciseNames is used to check if names are unique when creating a new exercise
    updateUniqueNames = (exerciseList) => {
        const exerciseNames = []
        for (const num in exerciseList) {
            const name = exerciseList[num].title;
            exerciseNames.push(name);
        }
        return exerciseNames;
    }

    //Takes in a location for the data, as well as the data saved
    saveData = async (location, data) => {
        try {
            await AsyncStorage.setItem(location, JSON.stringify(data));
        } catch (error) {
            console.warn(error);
        }
    }

    //Uses a list of locations to retrieve the data. 
    retrieveData = async () => {
        const locations = [dailyGoalLocation, exerciseListsLocation];
        try {
            await AsyncStorage.multiGet(locations)
                .then((response) =>{
                    let dailyGoal = JSON.parse(response[0][1]);
                    let exerciseList = JSON.parse(response[1][1]);
                    dailyGoal = dailyGoal === null ? 10000 : dailyGoal;
                    exerciseList = exerciseList === null ? [] : exerciseList;
                    const exerciseNames = this.updateUniqueNames(exerciseList);
                    this.setState({
                        stepGoal:dailyGoal,
                        exercises:exerciseList,
                        exerciseNames:exerciseNames,
                    })
                });
        } catch (error) {
            console.warn(error);
        }
    }

    //This function is sent down to PedometerSensor that updates the steps 
    updateSteps = (steps) => this.setState({stepsWalked:parseInt(steps,10)})

    //This function is sent down to StepGoalScreen to update the step goal, 
    //and saves the updated goal
    editStepGoal = (goal) => {
        this.setState({
            pedometerModalVisible: !this.state.pedometerModalVisible,
            stepGoal: parseInt(goal, 10),
        });
        this.saveData(dailyGoalLocation, goal);
    }
    
    //This function is sent down to CreateExerciseScreen and creates an exercise
    //based on data retrieved, as well as saving it 
    createExercise = (title, weightType, personalNotes, reps, sets, goal) => {
        const newExercise = {
            title: title,
            weightType: weightType, 
            personalNotes: personalNotes,
            reps: reps,
            sets: sets,
            goal: goal,
        }
        const exerciseLists = this.state.exercises;
        exerciseLists.push(newExercise);
        const exerciseNames = this.updateUniqueNames(exerciseLists);
        this.saveData(exerciseListsLocation, exerciseLists);
        this.setState({
            exercises:exerciseLists,
            exerciseNames:exerciseNames,
        });
    }

    //Opens the exercise screen and sends down a prop
    openExerciseGraphScreen = (exercise) => {
        this.props.navigation.navigate('ExerciseGraph', {
            exercise:exercise,
        });
    }

    //Opens the StepGoalScreen and sends down props and a function
    openStepGoalScreen = () => {
        this.props.navigation.navigate('StepGoal', {
            currentSteps: this.state.stepsWalked,
            stepGoal: this.state.stepGoal,
            acceptChange: this.editStepGoal.bind(this),
        })
    }

    //Opens the CreateExereciseScreen 
    openCreateExerciseScreen = () => {
        this.props.navigation.navigate('CreateExercise', {
            createExercise: this.createExercise.bind(this),
            exerciseNames: this.state.exerciseNames,
        })
    }

    //Creates the ExerciseCards that are rendered
    createExerciseCards = () => {
        const exerciseLists = this.state.exercises;
        const exerciseCards = []
        for (const num in exerciseLists) {
            exerciseCards.push(
                <TouchableOpacity 
                    key={num}
                    onPress={() => this.openExerciseGraphScreen(exerciseLists[num])} >
                    <ExerciseCard 
                        title={exerciseLists[num].title}
                    />
                </TouchableOpacity>);
        }
        return exerciseCards;
    }

    render() {
        const exerciseCards = this.createExerciseCards();
        return (
            <View style = {styles.container}>
                <Image 
                    source = {require(logoSource)}
                    style = {styles.logo}/>
                <View style = {styles.lineStyle}/>
                <ScrollView style = {styles.ScrollView} >
                    <TouchableOpacity onPress={() => this.openStepGoalScreen()}>
                        <PedometerProgressGraph 
                            stepsWalked={this.state.stepsWalked} 
                            goal={this.state.stepGoal} />
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity
                            style={styles.addExerciseView}
                            onPress={() => this.openCreateExerciseScreen()} >
                            <Text>Add exercise</Text>
                            <Image
                                //Icon made by wwww.flaticon.com/authors/freepik
                                source= {require(addExerciseButton)}
                                style= {styles.addExerciseSymbol} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cardContainer}>
                        {exerciseCards}
                    </View>
                </ScrollView>
                {/*
                    <PedometerSensor 
                        updateSteps={this.updateSteps.bind(this)} 
                    />
                */}
            </View>);
        }
    }

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgray',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,
    },
    logo: {
        marginTop: 18,
        marginBottom: 5,
        height: 100,
        width: 100
    },
    addExerciseView:  {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: 5,
    },
    addExerciseSymbol : {
        height: 25,
        width: 25,
        marginLeft: 5,
    },
    ScrollView: {
        backgroundColor: 'lightgray',
        alignSelf: 'stretch',
    },
    lineStyle: {
        alignSelf: 'stretch',
        borderWidth: 3,
        borderColor: 'black',
        borderBottomColor: 'lightgray',
        backgroundColor: 'lightgray',
        marginBottom: 10,
    },
    cardContainer: {
        flexDirection: 'column',
        padding: 8,
        justifyContent: 'space-between',
    }
});