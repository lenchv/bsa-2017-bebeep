#!/usr/bin/env bash

echo "deploy on production"
echo $pwd
ssh -t $SSH_USER@$SSH_HOST -o StrictHostKeyChecking=no -i ../.travis/id_rsa -tt <<-EOF
echo $PWD
mkdir ~/test
EOF

