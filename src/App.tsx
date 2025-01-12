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
  TextInput,
} from 'react-native';
import {ImagePickerResponse, ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { TextBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import {Section, SectionText} from "./Section"
import { readImage, translateText, doubleCheckList } from "./AI"
import {listOfAllergens, containsAllergen} from "./Allergens"
import CheckBox from 'react-native-check-box'
import { Message } from '@anthropic-ai/sdk/src/resources/messages.js';

function App(): React.JSX.Element {
  const [results, setResults] = useState("")
  const [details, setDetails] = useState("")
  const [showList, setShowList] = useState(false)
  const [meta, setMeta] = useState("")
  const [textInputText, setTextInputText] = useState("")
  const [translate, setTranslate] = useState(true)
  const [askAI, setAskAI] = useState(true)
  const [reverseSearch, setReverseSearch] = useState(false)

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
            setResults("AI Vision...")
            setDetails("AI Vision...")
            const data = result.assets[0].base64
            const type = result.assets[0].type
            const aiResponse = await readImage(type, data)
            const aiDescription = vetAIResult(aiResponse, "Vision")
            if (aiDescription) {
                processTextForAllergens(aiDescription)
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

  const vetAIResult = (aiResponse: Message, aiQuestion: string):string|null => {
    if (!aiResponse.content || !aiResponse.content.length) {
      setResults("Errernous response from ai during " + aiQuestion)
      setDetails("No content")
      return null
    }
    else {
      const aiDescription = (aiResponse.content[0] as TextBlock).text
      if (!aiDescription) {
        setResults("Errernous response from ai during " + aiQuestion)
        setDetails("Response type isn't text or text is empty")
        return null
      }
      else {
        setMeta((meta) => meta + "\n" + aiQuestion + ": " + JSON.stringify({stop_reason: aiResponse.stop_reason, usage: aiResponse.usage}))
        return aiDescription
      }
    }
  }

  const processTextForAllergens = async (text:string) => {
    try {
      let translation = ""
      if (translate) {
        setResults("Translating...")
        setDetails("Translating...")
        const translationResponse = await translateText(text)
        const translationText = vetAIResult(translationResponse, "Translation")
        if (translationText) translation = "\n\n" + translationText
      }
      // now go through all of our allergens, the text, and the translated text, and see if we have any matches
      const listOfDanger = []
      for (const allergen of listOfAllergens) {
        let contains = false
        // reverse search searches each allergen for the text input
        // normal search searches the text for each allergen
        if (reverseSearch) contains = containsAllergen(allergen, text)
        else contains = containsAllergen(text, allergen)
        // if we got a translation from the ai, search that as well
        if (translation) {
          if (reverseSearch) contains = contains || containsAllergen(allergen, translation)
          else contains = contains || containsAllergen(translation, allergen)
        }
        if (contains) {
          listOfDanger.push(allergen)
        }
      }
      // now ask the AI for a second set of eyes to see if we missed any synonyms, etc
      let doubleChecked = ""
      if (askAI) {
        setResults("AI double checking...")
        setDetails("AI double checking...")
        const doubleCheckResponse = await doubleCheckList(text)
        const doubleCheckText = vetAIResult(doubleCheckResponse, "Double Check")
        if (doubleCheckText) {
          doubleChecked = "\n\n" + doubleCheckText
        }
      }
      listOfDanger.unshift(listOfDanger.length ? "DANGER" : "Safe")
      setResults(listOfDanger.join('\n') + doubleChecked)
      setDetails(text + translation)
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
              <CheckBox rightTextStyle={{color: "#ffffff"}} checkBoxColor='#ffffff' style={styles.checkbox} isChecked={translate} onClick={() => setTranslate(!translate)} rightText={"Translate"} />
              <CheckBox rightTextStyle={{color: "#ffffff"}} checkBoxColor='#ffffff' style={styles.checkbox} isChecked={askAI} onClick={() => setAskAI(!askAI)} rightText={"AI Double-Check"} />
              <CheckBox rightTextStyle={{color: "#ffffff"}} checkBoxColor='#ffffff' style={styles.checkbox} isChecked={reverseSearch} onClick={() => {
                setAskAI(reverseSearch)
                setTranslate(reverseSearch)
                setReverseSearch(!reverseSearch)
              }} rightText={"Reverse Search (used to lookup allergens in your list)"} />
            <TouchableOpacity onPress={onCamera} style={styles.button}>
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onFile} style={styles.button}>
              <Text style={styles.buttonText}>File</Text>
            </TouchableOpacity>
            <View style={{height: 150, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              <TextInput multiline style={styles.textInput} onChangeText={setTextInputText} />
              <TouchableOpacity onPress={() => {setMeta(""); processTextForAllergens(textInputText)}} style={styles.button}>
                <Text style={styles.buttonText}>Text</Text>
              </TouchableOpacity>
            </View>
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
          <Section title="Full List">
          <TouchableOpacity onPress={() => {setShowList(!showList)}} style={styles.button}>
            <Text style={styles.buttonText}>{showList ? "Hide List" : "Show List"}</Text>
          </TouchableOpacity>
            <SectionText>{showList ? listOfAllergens.join('\n') : null}</SectionText>
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
  },
  checkbox: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    backgroundColor: "#444444",
    padding: 12,
    margin: 12,
    minHeight: 120
  }
});




export default App;
