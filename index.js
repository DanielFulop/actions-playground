const core = require('@actions/core');
const github = require('@actions/github');

const ORG_SLUG = 'BetssonGroup';
const TEAM_SLUG = 'obg-fe-adaptive-release-gatekeepers';

async function run() {
    try {
        /* An access token provided in the workflow main.yml */
        const githubToken = core.getInput('github-token');

        const context = github.context.payload;
        const repo = context.repository.name;
        const owner = context.repository.owner.login;
        const pull_number = context.pull_request.number;

        const octokit = github.getOctokit(githubToken);

        const team = await octokit.teams.listMembersInOrg({
            org: ORG_SLUG,
            team_slug: TEAM_SLUG
        });

        const reviews = await octokit.pulls.listReviews({
            owner,
            repo,
            pull_number
        })

        /*
         * `reviews` is chronologically ordered,
         *  each person can have multiple reviews,
         *  but we only care about the last
         */
        const latestReviewsPerPerson = reviews.data.reverse().reduce((acc, curr) => {
            if (!acc.find(review => review.user.login === curr.user.login)) {
                acc.push(curr)
            }
            return acc;
        }, [])

        const isApprovedByPersonFromTeam = latestReviewsPerPerson.some(review => !!team.data.find(person => review.user.login === person.login && review.state === 'APPROVED'))

        if (isApprovedByPersonFromTeam) {
            return true;
        } else {
            core.setFailed(`This PR needs an approve from anyone in team '${TEAM_SLUG}' before it can be merged.`)
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();