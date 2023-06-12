// importando as bibliotecas
import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../style/styles'
import { firebase } from '../../firebase/config'

export default function UtilitiesScreen({navigation, ...props}) {
  const [utilityText, setUtilityText] = useState('')
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
  const onAddButtonPress = () => {
    if (utilityText && utilityText.length > 0) {
      const timeStamp = firebase.firestore.FieldValue.serverTimestamp()
      const data = {
        text: utilityText,
        authorId: userId,
        createAt: timeStamp
      }
      utilityRef
        .add(data)
        .then(_doc => {
          setUtilityText('')
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
          placeholder="Adicione um utilitário"
          placeholderTextColor="#aaaaaa"
          onChangeText={text => setUtilityText(text)}
          value={utilityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonViewTwo}> 
        <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate('UtilitiesView')}>
          <Text style={styles.buttonText}>Visualizar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
