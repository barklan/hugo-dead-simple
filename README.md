# Hugo Dead Simple

Simple hugo theme to be dead easy on the reader.

<p align="middle">
  <img src="https://raw.githubusercontent.com/barklan/hugo-dead-simple/main/images/screenshot.png" width="49%"/>
  <img src="https://raw.githubusercontent.com/barklan/hugo-dead-simple/main/images/tn.png" width="49%"/>
</p>


## Features

- Simple non-intrusive menu
- Dynamic wiki-style table of contents
- Black and white code blocks
- Katex math

## Install

- Initialize go module

    ```bash
    hugo mod init
    ```

- Add theme to your `config.yml`

    ```yml
    module:
      imports:
        - path: github.com/barklan/hugo-dead-simple
    ```

- Fetch theme

    ```bash
    hugo mod get -u
    ```

## Extra stuff

- Add `favicon.ico` to `/static`
- Deploy your site to Netlify with this `netlify.toml`

    ```toml
    [build]
    publish = "public"
    command = "hugo --gc --minify"
    ```
