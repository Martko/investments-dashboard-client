#!/usr/bin/env bash

RELEASE_FILE_NAME="build-$CI_BUILD_NUMBER.tar.gz"

echo "================== STARTING TO DEPLOY ==================="
echo "BRANCH: $CI_BRANCH ($COMMIT_ID)"
echo "Commit message: $CI_COMMIT_MESSAGE"
echo "Committer: $CI_COMMITTER_NAME ($CI_COMMITTER_EMAIL)"
echo "========================================================="

echo "======== ZIPPING DEPLOYMENT $CI_BUILD_NUMBER ========"
tar -zcf ~/$RELEASE_FILE_NAME ./
echo "DEPLOYMENT ZIPPING COMPLETE"

echo "======== STARTING TO TRANSFER DEPLOYMENT PACKAGE TO LIVE ======== "
scp -i ~/.ssh/id_rsa.deploy -C ~/$RELEASE_FILE_NAME $LIVE_SERVER_USER@$LIVE_SERVER_HOST:$LIVE_SERVER_APP_PATH
echo "======== DEPLOYMENT PACKAGE TRANSFER TO LIVE COMPLETE ========"

