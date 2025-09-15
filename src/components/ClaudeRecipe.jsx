import React from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ClaudeRecipe(props){
    return(
        <>
          <section className="suggested-recipe-container" aria-live="polite">
            <h2>Chef Recommends: </h2>
            <ReactMarkdown remarkPlugins={remarkGfm}>{props.recipe}</ReactMarkdown>
             
        </section>
        </>
    )
}