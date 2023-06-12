// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function DrinkViewScreen({navigation, ...props}) {
  const [drinks, setDrinks] = useState([])

  const drinkRef = firebase.firestore().collection('drinks')
  const userId = props.extraData.id

  useEffect(() => {
    drinkRef.where('authorId', '==', userId).onSnapshot(
      querySnapshot => {
        const newDrink = []
        querySnapshot.forEach(doc => {
          const drink = doc.data()
          drink.id = doc.id
          newDrink.push(drink)
        })
        setDrinks(newDrink)
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const renderDrink = ({ item, index }) => {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}>
          {index}. {item.text}
        </Text>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.buttonView}>
      <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('Drink')}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={drinks}
          renderItem={renderDrink}
          keyExtractor={item => item.id}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  )
}
