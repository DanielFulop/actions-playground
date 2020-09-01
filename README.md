# Release Gatekeeper Check

This action checks if the PR has approves from the release GK group.

## Inputs

### `github-token`

**Required** Personal access token to github. Once this actions is moved to the organization, ${{ secrets.GITHUB_TOKEN }} can be used in the workflow's main.yml

## Example usage

https://github.com/DanielFulop/test-repository