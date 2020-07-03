![Insider Action](.github/insider-action.png)

* [Usage](#usage)
  * [Workflow](#Workflow)
* [Customization](#Customizing)
  * [Inputs](#Inputs)
* [License](#license)

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
    - name: Run Insider
      uses: insidersec/insider@v1
      with:
        technology: javascript
```

## Customizing

### Inputs

Following inputs can be used as `steps.with` keys

| Name             | Type    | Default   | Description                                                 |
|------------------|---------|-----------|-------------------------------------------------------------|
| `version`        | String  | `latest`  | Insider version                                             |
| `technology`     | String  |           | Specify which technology ruleset to load                    |
| `target`         | String  | `.`       | Specify where to look for files to run the specific ruleset |
| `security`       | String  |           | Set the Security level, values between 0 and 100            |
| `noHtml`         | Bool    |           | Skips the report generation in the HTML format              |
| `noJson`         | Bool    |           | Skips the report generation in the JSON format              |
| `noBanner`       | Bool    |           | Skips the banner printing                                   |




## License
