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
        const context = github.context.payload;
        const repo = context.repository.name;
        const owner = context.repository.owner;
        const pull_number = context.pull_request.number;

        const reviews = await octokit.pulls.listReviews({
            owner,
            repo,
            pull_number
        })

        console.log("reviews:", reviews)


        console.log("Team:", team)
        core.setFailed('Mocking a fail')
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();