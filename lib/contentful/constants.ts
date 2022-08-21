import { BLOCKS } from "@contentful/rich-text-types"
import { LINKS } from "../utils/constants"

export const CONTENT_TYPE_IDS = {
  blog: "blogPost",
  project: "projectPost",
  school: "schoolEntry",
}

export const COLLECTION_TYPE_IDS = Object.fromEntries(Object.entries(CONTENT_TYPE_IDS).map((value) => {
  return [value[0], `${value[1]}Collection`];
}));


export const CONTENT_TYPE_ID_TO_ROUTE: {
  [key: string]: string
} = {
  [CONTENT_TYPE_IDS.project]: LINKS.projekte,
  [CONTENT_TYPE_IDS.blog]: LINKS.blogs,
  [CONTENT_TYPE_IDS.school]: LINKS.schulen,
}

export const CONTENTFUL_IMAGE_QUERY = `{
  title
  width
  height
  url
}
`

export const CONTENTFUL_ID_QUERY = `
  sys {
    id
  }
`