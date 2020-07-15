<p align="center">
  <img src="https://insidersec.io/wp-content/uploads/2020/03/insider-novo-logo.png">
  <p align="center">
      <a href="https://github.com/insidersec/insider-action/releases">
        <img src="https://img.shields.io/badge/version-0.2.0-blue.svg">
      </a>
      <a href="https://github.com/marketplace/actions/insider-action">
        <img alt="GitHub marketplace" src="https://img.shields.io/badge/marketplace-insider--action-blue?logo=github&style=flat-square">
      </a>
      <a href="https://github.com/insidersec/insider-action/actions?workflow=test">
        <img alt="Test workflow" src="https://img.shields.io/github/workflow/status/insidersec/insider-action/test?label=test&logo=github&style=flat-square">
      </a>
  </p>
</p>

* [About](#about)
* [Usage](#usage)
  * [Workflow](#workflow)
* [Customization](#customizing)
  * [Inputs](#inputs)

## About
Hello! You are here because you are concerned about the security of your code, right? Cool, you are in the right place. Insider-action is the key that permits you protect your repository with [Insider](https://github.com/insidersec/insider), free, easy to integrate and frictionless. It is the most easy way to protect your code directly on your repository.

We currently support the following technologies: **Java (Maven and Android), Kotlin (Android), Swift (iOS), .NET Full Framework, C#, and Javascript (Node.js).**

## Usage

### Workflow

```yaml
name: insider
on:
  pull_request:
  push:
jobs:
  insider:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Run Insider
        uses: insidersec/insider-action@v0
        with:
            technology: javascript
            # Relative path under $GITHUB_WORKSPACE to use as a target
            # In this example, will use $GITHUB_WORKSPACE/src as a target
            target: src
```

## Customizing

### Inputs

Following inputs can be used as `steps.with` keys

| Name             | Type    | Default   | Description                                                 |
|------------------|---------|-----------|-------------------------------------------------------------|
| `version`        | String  | `latest`  | Insider version                                             |
| `technology`     | String  |           | Specify which technology ruleset to load                    |
| `target`         | String  | `.`       | Relative path under $GITHUB_WORKSPACE to use as a target    |
| `security`       | String  |           | Set the Security level, values between 0 and 100            |
| `noHtml`         | Bool    |           | Skips the report generation in the HTML format              |
| `noJson`         | Bool    |           | Skips the report generation in the JSON format              |
| `noBanner`       | Bool    |           | Skips the banner printing                                   |

