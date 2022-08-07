import Link from "next/link"
import { useRouter } from "next/router"
import {
  LinkSimpleHorizontal,
  LinkSimpleHorizontalBreak,
  MagnifyingGlass,
  X,
} from "phosphor-react"
import { useCallback, useEffect, useState } from "react"
import { CONTENT_TYPE_ID_TO_ROUTE } from "../../lib/contentful/constants"
import { LINKS } from "../../lib/utils/constants"

import styles from "./search_component.module.scss"

export const Search = () => {
  const [searchInputValue, setSearchInputValue] =
    useState("")
  const [searchActive, setSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState<
    {
      title: string
      entryId: string
      entryType: string
    }[]
  >([])
  const router = useRouter()

  const searchFunction = () => {
    const timeOutId = setTimeout(async () => {
      if (searchInputValue.length < 2) {
        setSearchResults([])
        return false
      }

      // fetching from nextjs api to get data from contentful

      const searchResults = await fetch(
        "/api/contentful/search",
        {
          method: "POST",
          body: JSON.stringify({
            searchInput: searchInputValue,
            locale: "de", // TODO: implement localization
          }),
        }
      )

      const status = searchResults.status

      if (status != 200) {
        setSearchResults([])
        return
      }

      const jsonResults = await searchResults.json()

      const temporarySearchResults = []
      for (let result of jsonResults) {
        const entryResult = result[0] // ?? idk why
        const entryType = result.entryType
        const title = entryResult.title
        const entryId = entryResult.sys.id

        temporarySearchResults.push({
          entryType: entryType,
          title: title,
          entryId: entryId,
        })
      }
      setSearchResults(temporarySearchResults)
    }, 200)

    return () => clearTimeout(timeOutId)
  }

  useEffect(searchFunction, [searchInputValue])

  function redirectToSearchPage() {
    router.push(`${LINKS.search}?s=${searchInputValue}`)
  }

  const handleBlur = useCallback((e: any) => {
    const currentTarget = e.currentTarget
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        setSearchActive(false)
      }
    })
  }, [])

  return (
    <section className={styles.searchSection}>
      <div className={styles.miniSearch}>
        <MagnifyingGlass
          size={25}
          onClick={redirectToSearchPage}
        />
      </div>
      <form
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            redirectToSearchPage()
          }
        }}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        onFocus={() => setSearchActive(true)}
        onBlur={handleBlur}
      >
        <input
          value={searchInputValue}
          onChange={(e) => {
            e.preventDefault()
            setSearchInputValue(e.target.value)
          }}
          className={styles.searchInput}
          placeholder="Suchen..."
          minLength={2}
        />{" "}
        {/* !! Minlength von 2, da contentful search nur mit min. 2 Zeiche funktioniert */}
        <button
          className={styles.xButton}
          onClick={() => {
            setSearchInputValue("")
          }}
        >
          <X
            size={25}
            color="white"
            opacity={0.5}
            style={{
              display:
                searchInputValue != "" ? "block" : "none",
            }}
            alt="cancel input"
          />
        </button>
        <button
          className={styles.searchButton}
          onClick={(e) => redirectToSearchPage()}
        >
          <MagnifyingGlass
            alt="confirm search query"
            size={25}
            color="white"
            opacity={0.5}
          />
        </button>
        <section
          className={styles.resultsSection}
          style={{
            display: searchActive ? "block" : "none",
          }}
        >
          <ol>
            {searchResults.length == 0 ? (
              <li
                style={{
                  opacity: 0.7,
                }}
              >
                nix.
              </li>
            ) : (
              searchResults.map((pair) => {
                return (
                  <li key={pair.entryId}>
                    <div className={styles.linkTextWrapper}>
                      <Link
                        href={`${
                          CONTENT_TYPE_ID_TO_ROUTE[
                            pair.entryType
                          ]
                        }/${pair.entryId}`}
                      >
                        {pair.title}
                      </Link>
                    </div>
                    <LinkSimpleHorizontal
                      size={15}
                      color="white"
                      opacity={0.5}
                    />
                  </li>
                )
              })
            )}
            {searchResults.length != 0 ? (
              <li>
                <Link
                  href={`${LINKS.search}?s=${searchInputValue}`}
                  className={styles.viewMore}
                >
                  View more
                </Link>
                <LinkSimpleHorizontalBreak
                  size={17}
                  color="white"
                  opacity={0.7}
                />
              </li>
            ) : null}
          </ol>
        </section>
      </form>
    </section>
  )
}
