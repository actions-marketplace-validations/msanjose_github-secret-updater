# github-secret-updater
Update repository secrets from a GitHub Action. This action is intended to support workflows that support rotation of secrets.

This action reads the [`GITHUB_TOKEN` environment variable](https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret) that is provided to GitHub Actions.

## Inputs

### `owner`
Owner of the repository

### `repo`
Repository name

### `secret-id`
Name of the repository secret to update

### `secret-value`
Value of the secret

## Example Usage
```yaml
- uses: msanjose/github-secret-updater@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GH_API_TOKEN }}
  with:
    owner: '<owner>'
    repo: '<repo_name>'
    secret-id: 'MY_SECRET'
    secret-value: 'Hello World'
```