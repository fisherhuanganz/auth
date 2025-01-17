'use strict';

import { getBooleanInput, setFailed, info as logInfo } from '@actions/core';
import { errorMessage, forceRemove } from '@google-github-actions/actions-utils';

/**
 * Executes the post action, documented inline.
 */
export async function run(): Promise<void> {
  try {
    const createCredentials = getBooleanInput('create_credentials_file');
    if (!createCredentials) {
      logInfo(`Skipping credential cleanup - "create_credentials_file" is false.`);
      return;
    }

    const cleanupCredentials = getBooleanInput('cleanup_credentials');
    if (!cleanupCredentials) {
      logInfo(`Skipping credential cleanup - "cleanup_credentials" is false.`);
      return;
    }

    // Look up the credentials path, if one exists. Note that we only check the
    // environment variable set by our action, since we don't want to
    // accidentially clean up if someone set GOOGLE_APPLICATION_CREDENTIALS or
    // another environment variable manually.
    const credentialsPath = process.env['GOOGLE_GHA_CREDS_PATH'];
    if (!credentialsPath) {
      logInfo(`Skipping credential cleanup - $GOOGLE_GHA_CREDS_PATH is not set.`);
      return;
    }

    // Remove the file.
    await forceRemove(credentialsPath);
    logInfo(`Removed exported credentials at "${credentialsPath}".`);
  } catch (err) {
    const msg = errorMessage(err);
    setFailed(`google-github-actions/auth post failed with: ${msg}`);
  }
   const configDefaultPath = 'root/.config/gcloud/configurations/config_default'
    // Remove the default configfile.
    if (!isEmptyDir(configDefaultPath)) {
      await forceRemove(configDefaultPath);
      logInfo(`Removed default credentials at "${configDefaultPath}".`);
    } catch (err) {
      const msg = errorMessage(err);
      setFailed(`google-github-actions/auth post failed with: ${msg}`);
    }
}

run();
