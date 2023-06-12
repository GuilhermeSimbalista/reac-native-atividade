// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function FoodViewScreen({navigation, ...props}) {
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

  const renderFood = ({ item, index }) => {
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
      <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('Food')}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={foods}
          renderItem={renderFood}
          keyExtractor={item => item.id}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  )
}
