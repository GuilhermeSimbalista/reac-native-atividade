// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function UtilitiesViewScreen({navigation, ...props}) {
  const [utilities, setUtilities] = useState([])

  const utilityRef = firebase.firestore().collection('utilities')
  const userId = props.extraData.id

  useEffect(() => {
    utilityRef.where('authorId', '==', userId).onSnapshot(
      querySnapshot => {
        const newUtilities = []
        querySnapshot.forEach(doc => {
          const utility = doc.data()
          utility.id = doc.id
          newUtilities.push(utility)
        })
        setUtilities(newUtilities)
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  const renderUtility = ({ item, index }) => {
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
      <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('Utility')}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={utilities}
          renderItem={renderUtility}
          keyExtractor={item => item.id}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  )
}
