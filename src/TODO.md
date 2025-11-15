// TODO 
// Add red text to the top if the user has not configured the app
// add a button that opens a popup for users to configure the app. this popup should appear by default when the app is opened if either of the inputs are blank
// allow user to input an anthropic api key. include a link next to this input to the anthropic api site
// allow users to enter a list of allergens. this will be a comma or newline seperated list. i will parse it by replacing all commas with newlines, then splitting by newline, then removing empty strings
// once the app is configured, the app will ask anthropic to expand the allergen list with all known synonyms (and translate it to english if needed). on a successful response we'll update our list and remove the red text 
// add full state preserve using async storage