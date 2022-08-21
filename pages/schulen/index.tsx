import { NextPage } from "next"
import {
  ContentfulCollection,
  StandardPageTemplate,
} from "../../components"
import { COLLECTION_TYPE_IDS } from "../../lib/contentful/constants"
import { KEYWORDS } from "../../lib/utils/constants"

const Schulen: NextPage = () => {
  return (
    <StandardPageTemplate
      heading="Projekte"
      titleSentence={[
        "Die",
        "Mitglieds-Schulen / -AGs",
        "der Community",
      ]}
      titleIndex={1}
      metaDescription={`Auf dieser Seite findest du die AGs, die Mitglieder der ${KEYWORDS.nameSeparate} sind`}
      codeSnippet={`
      
  if (formatList.length != replaceList.length) {
    console.log("%c util, l. 31: formatList length not equal to replaceList length", 
                "color: red");
    return;
  } else {

      // replaces all ~tag~ with its contents
      for (let index=0; index<formatList.length; index++) {
          let formatString = "...";

          let replaceString = replaceList[index];

          domTemplate = domTemplate.replace(
              new RegExp(formatString, "g"), 
              replaceString
          );
      }

      return domTemplate;

  }
  `}
    >
      <StandardPageTemplate.section>
        <ContentfulCollection
          collectionId={COLLECTION_TYPE_IDS.school}
        />
      </StandardPageTemplate.section>
    </StandardPageTemplate>
  )
}
export default Schulen
