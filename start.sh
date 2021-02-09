#!/usr/bin/env bash
#########################
# Setup scripts-common
# repo: https://gitlab.com/bertrand-benoit/scripts-common
#########################
currentDir="$( dirname "$( command -v "$0" )" )"
scriptsCommonUtilities="$( dirname "$currentDir" )/scripts-common/utilities.sh"
[ ! -f "$scriptsCommonUtilities" ] && echo -e "ERROR: scripts-common utilities not found, you must install it before using this script (checked path: $scriptsCommonUtilities)" >&2 && exit 1
# shellcheck disable=1090
. "$scriptsCommonUtilities"

BSC_VERBOSE=1
BSC_CATEGORY="DeepDream Maker"

#########################
# The command line help #
#########################
display_help() {
    warning "Invalid option"
    info "Usage: $(basename "$0") [option...] {prod|dev}"
    exit 1
}

if (( $# == 0 )); then
    # no parameters given, run production
    DOCKERFILE=docker-compose.prod.yml
elif [ "$1" == "dev" ]; then
    # run development env only if specified
    DOCKERFILE=docker-compose.yml
elif [ "$1" == "prod" ]; then
    # run run production
    DOCKERFILE=docker-compose.yml
else
    display_help
    exit 0
fi

# Check if docker and docker compose are installed
BSC_MODE_CHECK_CONFIG=1
checkBin docker || errorMessage "This tool requires Docker. Install it please, and then run this tool again."
checkBin docker-compose || errorMessage "This tool requires Docker compose. Install it please, and then run this tool again."
BSC_MODE_CHECK_CONFIG=0

#docker-compose -f ${DOCKERFILE} --build
docker-compose -f "${DOCKERFILE}" up --build
