// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function DrinkScreen({navigation, ...props}) {
  const [drinkText, setDrinkText] = useState('')
  const [drinks, setDrinks] = useState([])

  const drinkRef = firebase.firestore().collection('drinks')
  const userId = props.extraData.id

  useEffect(() => {
    drinkRef.where('authorId', '==', userId).onSnapshot(
      querySnapshot => {
        const newDrinks = []
        querySnapshot.forEach(doc => {
          const drink = doc.data()
          drink.id = doc.id
          newDrinks.push(drink)
        })
        setDrinks(newDrinks)
      },
      error => {
        console.log(error)
      }
    )
  }, [])
  const onAddButtonPress = () => {
    if (drinkText && drinkText.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
      const data = {
        text: drinkText,
        authorId: userId,
        createAt: timeStamp
      }
      drinkRef
        .add(data)
        .then(_doc => {
          setDrinkText('')
          Keyboard.dismiss()
        })
        .catch(error => {
          alert(error)
        })
    }
  }
  return (
    <View style={styles.container}>
          <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicione uma bebida"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setDrinkText(text)}
          value={drinkText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonViewTwo}> 
        <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('DrinksView')}>
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
