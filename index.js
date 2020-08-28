const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet = core.getInput('who-to-greet');
        const githubToken = core.getInput('github-token');
        console.log(`Hello ${nameToGreet}!`);
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        console.log("token:", githubToken)
        const octokit = github.getOctokit(githubToken);
        const team = await octokit.teams.listMembersInOrg({
            org: 'BetssonGroup',
            team_slug: 'obg-fe-adaptive-release-gatekeepers'
        });
        const url = team.data.members_url;
        console.log("Team:", team)
        core.setFailed('Mocking a fail')
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();