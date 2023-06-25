# Hugo Dead Simple

Simple hugo theme to be dead easy on the reader.

<p align="middle">
  <img src="https://raw.githubusercontent.com/barklan/hugo-dead-simple/main/images/screenshot.png" width="49%"/>
  <img src="https://raw.githubusercontent.com/barklan/hugo-dead-simple/main/images/tn.png" width="49%"/>
</p>

## Features

- Light and dark themes
- Site-wide search
- Keyboard-friendly: `h` to home, `t` to tags, `i` to search, `Tab` to navigate posts and search
- Simple non-intrusive menu
- Dynamic wiki-style table of contents
- Code blocks with highlight
- Katex math (inline and block)
- Info boxes

[Example site and overview of features.](https://aprilhamer.netlify.app/notes/make-posts-look-good/)

## Page parameters

```yml
title: "Post/Page title"
date: "2023-08-11"
toc: true # table of contents
bold: true # display post title in bold in posts list
math: true # load katex
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

Recommended markup settings:

```txt
markup:
  highlight:
    codeFences: true
    style: bw
    lineNumbersInTable: false
    noClasses: false
  goldmark:
    renderer:
      unsafe: true
```
