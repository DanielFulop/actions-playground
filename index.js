const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const githubToken = core.getInput('github-token');
        console.log("token:", githubToken)
        const octokit = github.getOctokit(githubToken);
        const team = await octokit.teams.listMembersInOrg({
            org: 'BetssonGroup',
            team_slug: 'obg-fe-adaptive-release-gatekeepers'
        });
        const context = github.context.payload;
        const repo = context.repository.name;
        const owner = context.repository.owner.login;
        const pull_number = context.pull_request.number;
        console.log("details:", repo, owner, pull_number)

        const reviews = await octokit.pulls.listReviews({
            owner,
            repo,
            pull_number
        })

        console.log("reviews:", reviews)
        console.log("Team:", team)

        const latestReviewsPerPerson = reviews.data.reverse().reduce((acc, curr) => {
            if (!acc.find(review => review.user.login === curr.user.login)) {
                acc.push(curr)
            }
            return acc;
        }, [])

        const isApprovedByPersonFromTeam = latestReviewsPerPerson.some(review => !!team.data.find(person => review.user.login === person.login))

        if (isApprovedByPersonFromTeam) {
            return true;
        } else {
            core.setFailed('Not approved from team.')
        }


    } catch (error) {
        core.setFailed(error.message);
    }
}

run();