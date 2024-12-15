/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ImagePickerResponse, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import {Section, SectionText} from "./Section"
import { readImage } from "./AI"
import {listOfAllergens, containsAllergen} from "./Allergens"


function App(): React.JSX.Element {
  const [results, setResults] = useState("")
  const [details, setDetails] = useState("")
  const [meta, setMeta] = useState("")

  const onCamera = () => {
    onPhoto(launchCamera)
  }
  const onFile = () => {
    onPhoto(launchImageLibrary)
  }
  const onPhoto = async (captureMethod:(options:ImageLibraryOptions) => Promise<ImagePickerResponse>) => {
    try {
      const result = await captureMethod({
        mediaType: "photo",
        includeBase64: true,
      });
    
      if (!result.didCancel) {
        setResults("Processing...")
        setDetails("Processing...")
        setMeta("")

        if (result.errorCode || result.errorMessage) {
          setResults("Error taking photo")
          setDetails(result.errorMessage || result.errorCode || "No details")
        }
        else {
          if (!result.assets || !result.assets[0]) {
            setResults("Error processing photo")
            setDetails("No assets")
          }
          else if (!result.assets[0].base64) {
            setResults("Error processing photo")
            setDetails("No base64")
          }
          else if (result.assets[0].type !== "image/png" && result.assets[0].type !== "image/jpeg") {
            setResults("Error processing photo")
            setDetails("Not png or jpeg")
          }
          else {
            const data = result.assets[0].base64
            const type = result.assets[0].type
            const aiResponse = await readImage(type, data)
            if (!aiResponse.content || !aiResponse.content.length) {
              setResults("Errernous response from ai")
              setDetails("No content")
            }
            else {
              const aiDescription = (aiResponse.content[0] as TextBlock).text
              if (!aiDescription) {
                setResults("Errernous response from ai")
                setDetails("Response type isn't text or text is empty")
              }
              else {
                const listOfDanger = []
                for (const allergen of listOfAllergens) {
                  if (containsAllergen(aiDescription, allergen)) {
                    listOfDanger.push(allergen)
                  }
                }
                // TODO we could now pass the aiDescription and listOfAllergens to the AI now and ask it if there's any overlap, to get a second set of eyes
                listOfDanger.unshift(listOfDanger.length ? "DANGER" : "Safe")
                setResults(listOfDanger.join('\n'))
                setDetails(aiDescription)
                setMeta(JSON.stringify({stop_reason: aiResponse.stop_reason, usage: aiResponse.usage}))
              }
            }
          }
        }
      }
    }
    catch (e) {
      setResults("Thrown error")
      if (typeof e === "string") {
        setDetails(e)
      }
      else if (e instanceof Error) {
        setDetails(e.message)
      }
      else {
        setDetails(JSON.stringify(e))
      }
    }
  }

  
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={styles.backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle}>
        <View
          style={{ backgroundColor: "#000000"}}>
          <Section title="Capture">
            <TouchableOpacity onPress={onCamera} style={styles.button}>
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFile} style={styles.button}>
            <Text style={styles.buttonText}>File</Text>
            </TouchableOpacity>
          </Section>
          <Section title="Results">
            <SectionText>{results}</SectionText>
          </Section>
          <Section title="Details">
            <SectionText>{details}</SectionText>
          </Section>
          <Section title="Meta">
            <SectionText>{meta}</SectionText>
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: "#333333"
  },
  button: {
    margin: 12,
    padding: 12,
    backgroundColor: "#444444",
    alignContent: "center",
    alignItems: "center",
    borderRadius: 12
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20
  }
});




export default App;
