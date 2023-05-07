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

## Page parameters

```yml
title: "Post/Page title"
date: "2023-08-11"
toc: true  # table of contents
bold: true  # display post title in bold in posts list
math: true  # load katex
categories:
  - ...
tags:
  - ...
next: true ## show link to next post in footer
```

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

    [context.production]
    environment = { HUGO_VERSION = "0.111.3" }
    ```
