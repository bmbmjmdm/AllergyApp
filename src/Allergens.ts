export const listOfAllergens:string[] = [
  // Textiles
  "Neoprene",
  "Elastane",
  "Nylon",
  "Spandex",
  "Rayon",


  // Carba Mix (MX-06)
  "Carba Mix",
  "MX-06",
  // Synonyms
  "Carbamates",
  // Composition
  "Diphenylguanidine",
  "DPG",
  "Noccel D",
  "Sanceler D",
  "Soxinol D",
  "Zinc Dibutyldithiocarbamate",
  "Butasan",
  "Butazate",
  "Butazin",
  "Butyl Zimate",
  "Zinc Deithydithiocarbamate",
  "ZDC",
  "ZBC",
  "Nocceler BZ",
  "Soxinol",
  "Etazin",
  "Ethasan",
  "Ethazate",
  "Ethyl Zimate",
  "Nocceler EZ",
  "Soxinol EZ",
  // Online synonyms
  "zinc bis(diethyldithiocarbamate)",
  "bis(N,N-dibutyldithiocarbamato)zinc",
  "carbamic acid dibutyldithio",
  "zinc complex",
  "zinc bis(dibutyldithiocarbamate)",
  "Zincdiethyldithiocarbamate",
  "diethyldithiocarbamic acid zinc salt",
  // Norsk
  "Karbamater",
  "Difenyloguanidin",
  "Sinkdibutylditiokarbamat",
  "Sinkdietylditiokarbamat",
  "Sinkbis(dietylditiokarbamat)",
  "bis(N,N-dibutylditiokarbamato)sink",
  "Karbaminsyre dibutylditio",
  "Sinkkompleks",
  "Sinkbis(dibutylditiokarbamat)",
  "Sinkdietylditiokarbamat",
  "Dietylditiokarbaminsyre, sinksalt",
  "Etyl Zimate",


  // MDBGN (Methyldibromo glutaronitrile) (D-049E)
  "MDBGN",
  "Methyldibromo glutaronitrile",
  "Méthyldibromo glutaronitrile",
  "D-049E",
  // Synonyms
  "2-Bromo-2",
  "bromomethyl glutaronitrile",
  "bromomethyl pentanedinitrile",
  "Dibromo dicyanobutane",
  "1,2-Dibromo-2,4-dicyanobutane",
  "Dibromodicyanobutane",
  "Merquat 2200",
  "Phenoxyethanol",
  "Tektamer 38",
  // Online synonyms
  "Bromothalonil",
  "Euxyl K400",
  "Metacide 38",
  // Norsk
  "Metyl-dibromoglutaronitril",
  "Bromometylglutaronitril",
  "Bromometylpentandinitril",
  "Dibromodicyanobutan",
  "1,2-Dibrom-2,4-dicyanobutan",
  "Dibromdicyanobutan",
  "Fenoksyetanol",
  "Bromotalonil"
  

  
  
]

export const containsAllergen = (aiDescription: string, allergen: string):boolean => {
  /* TODO determine if its in the string. this is difficult because the strings may be different for a variet of reasons: hyphens, paranthesis, spaces, capitalization, roman numerals vs numbers, even language (norsk vs engelsk) or chemical categorization (US D-# T-# MX-# system vs Norway's E# system etc) */
  // I could get around some of this by stripping capitalization, paranthesis, hyphens, spaces, etc
  // I MIGHT be able to get around the english-norsk barrier by asking the ai to convert my listOfAllergens into other languages as well and add those to the listOfAllergens source code
  // see TODO in App.tsx
}
