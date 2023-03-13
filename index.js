const core = require('@actions/core');
const {Octokit} = require('@octokit/action');
const sodium = require('libsodium-wrappers')

async function run() {

  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo')
    const secretId = core.getInput('secret-id');
    const secretValue = core.getInput('secret-value');

    const octokit = new Octokit({})

    // get encryption key
  
    const pk = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const encKey = pk.data.key
    const encId = pk.data.key_id

    // encrypt secret value
    await sodium.ready;
    // Convert Secret & Base64 key to Uint8Array.
    let binkey = sodium.from_base64(encKey, sodium.base64_variants.ORIGINAL)
    let binsec = sodium.from_string(secretValue)
    // Encrypt the secret using LibSodium
    let encBytes = sodium.crypto_box_seal(binsec, binkey)
    // Convert encrypted Uint8Array to Base64
    let encSecretValue = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);

    // transmit secret
    await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner: owner,
      repo: repo,
      secret_name: secretId,
      encrypted_value: encSecretValue,
      key_id: encId,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
