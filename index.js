const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    const githubToken = core.getInput('github-token');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload)
    console.log(`The event payload: ${payload}`);
    const octokit = github.getOctokit(githubToken);
    console.log("github token:", githubToken)
    console.log("Octokit instance:", octokit)
    core.setFailed("Failing on purpose (mock)")
} catch (error) {
    core.setFailed(error.message);
}