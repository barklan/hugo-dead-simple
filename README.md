<h1 align=center>hugo-dead-simple | <a href="https://hugo-dead-simple.netlify.app/" rel="nofollow">demo</a></h1>

Dead simple Hugo theme.

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

- Lint with this `.pre-commit-config.yaml`

    ```yaml
    default_stages: [commit]
    repos:
    - repo: https://github.com/pre-commit/pre-commit-hooks
        rev: v4.1.0
        hooks:
        - id: end-of-file-fixer
        - id: check-added-large-files
        - id: trailing-whitespace
        - id: check-merge-conflict
        - id: check-toml
        - id: check-yaml
        - id: detect-private-key
        - id: check-json
            exclude: ".vscode/tasks.json"
        - id: check-case-conflict
        - id: check-symlinks
        - id: mixed-line-ending
            args: ["--fix=no"]
    - repo: https://github.com/jorisroovers/gitlint
        rev: v0.17.0
        hooks:
        - id: gitlint
            args: ["--ignore=body-is-missing", "--contrib=contrib-title-conventional-commits", "--msg-filename"]
    - repo: https://github.com/codespell-project/codespell
        rev: v2.1.0
        hooks:
        - id: codespell
            exclude: "^go.sum"
    - repo: https://github.com/igorshubovych/markdownlint-cli
        rev: v0.31.1
        hooks:
        - id: markdownlint
    ```

- Refine linting with `.markdownlint.yaml`

    ```yaml
    default: true
    MD013:
        line_length: 1200
    MD010: false
    ```
