# Hugo Dead Simple

Simple hugo theme to be dead easy on the reader.

![screenshot](https://github.com/barklan/hugo-dead-simple)

## Features

## Instructions

- Initialize go module

    ```bash
    hugo mod init
    ```

- Fetch theme

    ```bash
    hugo mod get -u
    ```

## Extra stuff

- Add `favicon.ico` to `/static`
- Launch with this

    ```bash
    hugo server --minify -D
    ```

- Build with this

    ```bash
    hugo --gc --minify
    ```

- Deploy to netlify with this `netlify.toml`

    ```toml
    [build]
    publish = "public"
    command = "hugo --gc --minify"
    ```
