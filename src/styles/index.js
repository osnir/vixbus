import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({

    scroll: {
      paddingTop: 10,
      paddingBottom: 20
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },    
    logo: {
      height: 50
    },
    title: {      
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#c86673',
      borderColor: '#c1636f',
      width: '98%',
      borderRadius: 6,
      height: 60  
    },
    titleText: {
      fontSize: 15,  
      fontWeight: 'bold',
      color: '#fff',
      padding: 10
    },
    textLoading: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333'
    },    
    button: {
      backgroundColor: '#3071a9',  
      borderColor: '#285e8e',
      padding: 6,
      marginBottom: 30,
      fontSize: 14,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      width: '90%',
      height: 42
    },
    buttonText: {
      color: '#fff',
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      fontSize: 18
    },
    picker: {
      width: '90%',
      height: 40,
      color: '#333'
    },
    result: {
      width: '90%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#3071a9',
      borderRadius: 6,
      padding: 5,
      marginBottom: 25
    },
    list: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',     
      backgroundColor: '#fff',
      padding: 10             
    },    
    containerSaida: {
      alignItems: 'center',
      justifyContent: 'center', 
      marginTop: 10,
      marginBottom: 10
    },
    containerDia: {
      alignItems: 'center',
      justifyContent: 'center', 
      backgroundColor: '#E2DDDD',
      borderColor: '#ddd',
      color: '#333'
    },
    buttonHora: {
      width: 60,
      height: 30,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },   
    buttonHoraSel: {
      width: 60,
      height: 30,
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#6B9AC3',
      borderWidth: 1,
      borderColor: '#6B9AC3',
      borderRadius: 6
    },
    textSaida: {
      fontSize: 16,
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      color: '#4d4d4d',
      fontWeight: 'bold'
    },
    textDia: {
      fontSize: 15,
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      color: '#4d4d4d'
    },
    textHora: {
      color: '#016380'
    },
    textHoraSel: {
      color: '#fff'
    },    
    listObs: {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginBottom: 40,
      width: '90%',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#3071a9',
      borderRadius: 6,
      padding: 10             
    },    
    containerObs: {
      padding: 2
    },
    textObs: {
      fontSize: 11,
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      color: '#4d4d4d'
    },
    listIt: {
      alignItems: 'center',
      justifyContent: 'flex-start',     
      backgroundColor: '#fff',
      padding: 10       
    },
    containerIt: {
      width: 320,
      backgroundColor: '#fff',
      padding: 5,
      margin: 1
    },
    textItHeader: {
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      color: '#4d4d4d'
    },
    textIt: {
      fontSize: 13,
      fontFamily: "'OpenSans-Bold',Arial,sans-serif",
      color: '#333'
    }
});

export default styles;