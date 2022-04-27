# hugo-dead-simple

## Instructions

1. Create repo and copy contents of `exampleSite` into it.
2. Initialize go module

    ```bash
    hugo mod init
    ```

3. Fetch theme

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
