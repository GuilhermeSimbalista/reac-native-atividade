// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function FoodScreen({navigation, ...props}) {
  const [foodText, setFoodText] = useState('')
  const [foods, setFoods] = useState([])

  const foodRef = firebase.firestore().collection('foods')
  const userId = props.extraData.id

  useEffect(() => {
    foodRef.where('authorId', '==', userId).onSnapshot(
      querySnapshot => {
        const newFoods = []
        querySnapshot.forEach(doc => {
          const food = doc.data()
          food.id = doc.id
          newFoods.push(food)
        })
        setFoods(newFoods)
      },
      error => {
        console.log(error)
      }
    )
  }, [])
  const onAddButtonPress = () => {
    if (foodText && foodText.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
      const data = {
        text: foodText,
        authorId: userId,
        createAt: timeStamp
      }
      foodRef
        .add(data)
        .then(_doc => {
          setFoodText('')
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
          placeholder="Adicione uma comida"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setFoodText(text)}
          value={foodText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonViewTwo}> 
        <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('FoodsView')}>
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
